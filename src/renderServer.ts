import {performance} from 'perf_hooks';

import * as Sentry from '@sentry/node';
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

  app.use(express.json());
  app.use(Sentry.Handlers.requestHandler());

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

    const [stream, dispose] = renderSync(style, renderData.data);

    resp
      .status(200)
      .contentType('png')
      .header('X-Config-Version', config.version.toString())
      .attachment('chart.png');

    stream.pipe(resp);

    try {
      await new Promise((resolve, reject) => {
        stream.on('end', resolve);
        stream.on('error', reject);
      });
    } catch {
      resp.status(500);
    }

    dispose();
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

  app.get('/health-check', (_req, resp) =>
    config.isLoaded
      ? resp.status(200).send('OK')
      : resp.status(503).send('NOT CONFIGURED')
  );

  app.use(Sentry.Handlers.errorHandler());

  return app;
}
