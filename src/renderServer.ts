import {performance} from 'perf_hooks';

import * as Sentry from '@sentry/node';
import {Integrations} from '@sentry/tracing';
import express from 'express';

import ConfigService from './config';
import {logger} from './logging';
import {renderSync} from './render';
import {validateRenderData} from './validate';

/**
 * Start a server that accepts requests to generate charts
 */
export function renderServer(config: ConfigService) {
  const app = express();

  Sentry.getCurrentHub().bindClient(
    new Sentry.NodeClient({
      dsn: process.env.SENTRY_DSN,
      integrations: [
        new Integrations.Express({app}),
        new Sentry.Integrations.Http({ tracing: true }),
      ],
      tracesSampleRate: 1.0,
    })
  );

  app.use(express.json({limit: '20mb'}));
  app.use(Sentry.Handlers.requestHandler());
  app.use(Sentry.Handlers.tracingHandler());

  app.post('/render', async (req, resp) => {
    if (!config.isLoaded) {
      resp.status(503).send();
      return;
    }

    const startMark = performance.now();
    const data = req.body;

    const [renderData, errors] = validateRenderData(config, data);

    if (errors !== undefined) {
      logger.info(`Failed to validate chart request: ${errors.message}`);
      resp.status(400).send(errors.message);
      return;
    }

    // validateRenderData ensures the config key is valid
    const style = config.getConfig(renderData.style)!;

    try {
      const [stream, dispose] = renderSync(style, renderData.data);

      resp
        .status(200)
        .contentType('png')
        .header('X-Config-Version', config.version.toString())
        .attachment('chart.png');

      stream.pipe(resp);

      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });

      dispose();
    } catch (error) {
      Sentry.captureException(error);
      resp.status(500);
    }

    resp.send();

    const completeMark = performance.now();
    const time = Math.round(completeMark - startMark);

    logger.info({
      message: `[requestId:${renderData.requestId}] rendered in ${time}ms`,
      requestId: renderData.requestId,
      status: resp.statusCode,
      time,
    });
  });

  app.get('/api/chartcuterie/healthcheck/live', (_req, resp) =>
    resp.status(200).send('OK')
  );

  app.get('/api/chartcuterie/healthcheck/ready', (_req, resp) =>
    config.isLoaded
      ? resp.status(200).send('OK')
      : resp.status(503).send('NOT CONFIGURED')
  );

  app.use(Sentry.Handlers.errorHandler());

  return app;
}
