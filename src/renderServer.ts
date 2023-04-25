// eslint-disable-next-line simple-import-sort/imports
import {performance} from 'perf_hooks';

import * as Sentry from '@sentry/node';
import {ProfilingIntegration} from '@sentry/profiling-node';
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
  const renderRoutes = express.Router();

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      new Sentry.Integrations.Http({tracing: true}),
      new Sentry.Integrations.Express({router: renderRoutes}),
      new ProfilingIntegration(),
    ],
    profilesSampleRate: 1,
    tracesSampleRate: 1,
  });

  renderRoutes.use(express.json({limit: '20mb'}));
  renderRoutes.use(Sentry.Handlers.requestHandler());
  renderRoutes.use(Sentry.Handlers.tracingHandler());
  renderRoutes.use((req, resp) => {
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
    let style = config.getConfig(renderData.style)!;

    // Override the default width/height from the payload sent to /render
    if (renderData.width && renderData.height) {
      style = {...style, width: renderData.width, height: renderData.height};
    }

    let render: ReturnType<typeof renderSync> | undefined;
    try {
      render = renderSync(style, renderData.data);

      resp
        .status(200)
        .contentType('png')
        .header('X-Config-Version', config.version.toString())
        .attachment('chart.png')
        .send(render.buffer);
    } catch (error) {
      Sentry.captureException(error);
      resp.status(500);
    } finally {
      render?.dispose();
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
  renderRoutes.use(Sentry.Handlers.errorHandler());

  app.post('/render', renderRoutes);

  app.get('/api/chartcuterie/healthcheck/live', (_req, resp) =>
    resp.status(200).send('OK')
  );

  app.get('/api/chartcuterie/healthcheck/ready', (_req, resp) =>
    config.isLoaded
      ? resp.status(200).send('OK')
      : resp.status(503).send('NOT CONFIGURED')
  );

  return app;
}
