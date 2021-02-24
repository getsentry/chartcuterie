import * as Sentry from '@sentry/node';
import dotenv from 'dotenv';
import yargsInit from 'yargs';

import {renderServer} from './renderServer';
import {renderStream} from './renderStream';
import {stylesConfigLoader} from './stlyesLoader';

dotenv.config();
Sentry.init({dsn: process.env.SENTRY_DSN});

yargsInit(process.argv.slice(2))
  .option('styles', {
    alias: 's',
    desc: 'Chart style configuration module',
    type: 'string',
  })
  .coerce('styles', stylesConfigLoader)
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
