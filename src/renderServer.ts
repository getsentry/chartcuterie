import {performance} from 'perf_hooks';

import * as Sentry from '@sentry/node';
import express from 'express';

import ConfigService from './config';
import {logger} from './logging';
import {renderSync} from './render';
import {validateRenderData} from './validate';

type Options = {
  config: ConfigService;
  port: number;
};

/**
 * Start a server that accepts requests to generate charts
 */
export function renderServer({config, port}: Options) {
  const app = express();

  app.use(express.json());
  app.use(Sentry.Handlers.requestHandler());

  app.post('/render', async (req, resp) => {
    const startMark = performance.now();
    const data = req.body;

    const [renderData, errors] = validateRenderData(config, data);

    if (errors !== undefined) {
      logger.info(`Failed to validate chart request: ${errors.message}`);
      resp.status(400).send(errors.message);
      return;
    }

    const style = config.getConfig(renderData.style);

    if (style === undefined) {
      resp.status(400).send('Invalid config style key provided');
      return;
    }

    const [stream, dispose] = renderSync(style, renderData.data);

    resp.status(200).contentType('png').attachment('chart.png');
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

  app.get('/health-check', (_req, resp) => resp.status(200).send('OK'));

  app.use(Sentry.Handlers.errorHandler());
  app.listen(port);

  logger.info(`Server listening for render requests on port ${port}`);
}
