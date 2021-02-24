import * as Sentry from '@sentry/node';
import express from 'express';

import {renderSync} from './render';
import {StyleConfig} from './types';
import {validateRenderData} from './validate';

type Options = {
  styles: StyleConfig;
  port: number;
};

/**
 * Start a server that accepts requests to generate charts
 */
export function renderServer({styles, port}: Options) {
  const app = express();

  app.use(express.json());
  app.use(Sentry.Handlers.requestHandler());

  console.log('booting');

  app.post('/render', async (request, response) => {
    const data = request.body;

    if (!validateRenderData(data)) {
      response.status(400).send('Invalid render data provided');
      return;
    }

    const style = styles.get(data.style);

    if (style === undefined) {
      response.status(400).send('Invalid style key provided');
      return;
    }

    const [stream, dispose] = renderSync(style, data.series);

    response.status(200).contentType('png').attachment('chart.png');
    stream.pipe(response);

    await new Promise((resolve, reject) => {
      stream.on('end', resolve);
      stream.on('error', reject);
    });

    dispose();
    response.send();
  });

  app.use(Sentry.Handlers.errorHandler());
  app.listen(port);
}
