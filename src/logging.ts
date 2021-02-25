import {createLogger, format, transports} from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [
    // TODO: What transports need to go into here in production?
  ],
});

export function registerConsoleLogger(options?: transports.ConsoleTransportOptions) {
  const transport = new transports.Console({
    format: format.combine(format.colorize(), format.simple()),
    ...options,
  });

  logger.add(transport);
}
