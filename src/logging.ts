import * as Sentry from '@sentry/node';
import {createLogger, format, transports} from 'winston';
import Transport from 'winston-transport';

const SentryWinstonTransport = Sentry.createSentryWinstonTransport(Transport);

export const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    new SentryWinstonTransport(),
  ],
});

export function registerConsoleLogger(options?: transports.ConsoleTransportOptions) {
  const transport = new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
    ...options,
  });

  logger.add(transport);
}
