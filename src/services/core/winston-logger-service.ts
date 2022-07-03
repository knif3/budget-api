import winston from 'winston';

winston.configure({
  level: 'debug',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.errors({ stack: true }),
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(({
          level, message, timestamp, stack,
        }) => {
          if (stack) {
            return `${timestamp} ${level}: ${message} - ${stack}`;
          }
          return `${timestamp} ${level}: ${message}`;
        }),
      ),
    }),
  ],
});
export { winston as logger };
