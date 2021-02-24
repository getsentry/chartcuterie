import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import yargsInit from 'yargs';

import {renderServer} from './renderServer';
import {renderStream} from './renderStream';
import {validateStyleConfig} from './validate';

dotenv.config();
Sentry.init({dsn: process.env.SENTRY_DSN});

/**
 * Load external style configurations
 */
function styleConfigLoader(path: string) {
  const config = require(/* webpackIgnore: true */ path).default;

  if (!validateStyleConfig(config)) {
    throw new Error('Invalid style configuration');
  }
  return config;
}

yargsInit(process.argv.slice(2))
  .option('styles', {
    alias: 's',
    desc: 'Chart style configuration module',
    type: 'string',
  })
  .coerce('styles', styleConfigLoader)
  .demandOption('styles')
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
    argv => renderServer({styles: argv.styles, port: argv.port as number})
  )
  .command(
    'render',
    'renders a chart from a valid JSON input',
    () => {},
    argv => renderStream(argv.styles)
  )
  .demandCommand(1, '')
  .parse();
