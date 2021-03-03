#!/usr/bin/env node

import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import yargsInit from 'yargs';

import ConfigService from './config';
import * as logging from './logging';
import {renderServer} from './renderServer';
import {renderStream} from './renderStream';

dotenv.config();
Sentry.init({dsn: process.env.SENTRY_DSN});

yargsInit(process.argv.slice(2))
  .env('CHARTCUTERIE')
  .option('config', {
    alias: 'c',
    desc: 'Chart rendering style configuration module',
    type: 'string',
  })
  .demandOption(
    'config',
    'You must provided a file/url to load the chart rendering config'
  )
  .command(
    'server [port]',
    'start the graph rendering web api',
    yargs => {
      yargs
        .positional('port', {
          desc: 'Port to run the webserver on',
          default: 8000,
        })
        .coerce('port', Number);
    },
    async argv => {
      logging.registerConsoleLogger();

      const config = new ConfigService(argv.config);
      await config.resolve();

      renderServer({config, port: argv.port as number});
    }
  )
  .command(
    'render',
    'renders a chart from a valid JSON input',
    () => {},
    async argv => {
      // All logging output needs to happen over stderr, otherwise we'll
      // pollute the image output produced when rendering a chart.
      logging.registerConsoleLogger({stderrLevels: ['error', 'info', 'debug']});

      const config = new ConfigService(argv.config);
      await config.resolve();

      renderStream(config);
    }
  )
  .demandCommand(1, '')
  .parse();
