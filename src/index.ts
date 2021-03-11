#!/usr/bin/env node

import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import yargsInit from 'yargs';

import ConfigService from './config';
import * as logging from './logging';
import {renderServer} from './renderServer';
import {renderStream} from './renderStream';
import {PollingConfig} from './types';

dotenv.config();
Sentry.init({dsn: process.env.SENTRY_DSN});

const defaultPollingConfig: PollingConfig = {
  /**
   * Poll every 5 seconds on boot
   */
  bootInterval: 5 * 1000,
  /**
   * Poll every 5 minutes after the first config has been loaded
   */
  idleInterval: 300 * 1000,
};

yargsInit(process.argv.slice(2))
  .env('CHARTCUTERIE')
  .option('config', {
    alias: 'c',
    desc: 'Chart rendering style configuration module',
    type: 'string',
  })
  .option('loglevel', {
    desc: 'Specify the minum log level',
    choices: ['debug', 'info', 'warn', 'error'],
    default: 'info',
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
        .option('configPolling', {
          desc: 'Poll for new configuration updates',
          type: 'boolean',
          default: false,
        })
        .coerce('port', Number);
    },
    async argv => {
      logging.logger.level = argv.loglevel;
      logging.registerConsoleLogger();

      const config = new ConfigService(argv.config);

      if (!argv.configPolling) {
        await config.resolveEnsured();
      } else {
        config.resolveWithPolling(defaultPollingConfig);
      }

      const server = renderServer(config);
      server.listen(argv.port as number);
      logging.logger.info(`Server listening for render requests on port ${argv.port}`);
    }
  )
  .command(
    'render',
    'renders a chart from a valid JSON input',
    () => {},
    async argv => {
      logging.logger.level = argv.loglevel;

      // All logging output needs to happen over stderr, otherwise we'll
      // pollute the image output produced when rendering a chart.
      logging.registerConsoleLogger({
        stderrLevels: ['error', 'info', 'warn', 'debug'],
      });

      const config = new ConfigService(argv.config);
      await config.resolveEnsured();

      renderStream(config);
    }
  )
  .demandCommand(1, '')
  .parse();
