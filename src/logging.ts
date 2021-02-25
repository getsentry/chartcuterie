import {createLogger, format, transports} from 'winston';

export const logger = createLogger({
  level: 'info',
  format: format.json(),
  transports: [],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({format: format.combine(format.colorize(), format.simple())})
  );
}
