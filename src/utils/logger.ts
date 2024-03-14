import * as winston from 'winston';
// import 'winston-mongodb';
const { combine, label, timestamp, printf } = winston.format;

class Logger {
  private readonly LOG_FILE = {
    ERROR: 'logs/error.log',
    WARN: 'logs/warn.log',
    VERBOSE: 'logs/verbose.log',
    DEBUG: 'logs/debug.log',
    INFO: 'logs/info.log',
    ALL: 'logs/all.log',
  };

  logFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}:  ${message}`;
  });

  // constructor() {}

  error(data) {
    const logger = winston.createLogger({
      format: combine(
        label({ label: '---- [ERROR]logs ----' }),
        timestamp(),
        this.logFormat,
      ),
      transports: [
        new winston.transports.Console(), // remove line on production
        // new winston.transports.MongoDB({
        //   db: `${process.env.DATABASE_URL}`,
        //   level: 'error',
        //   options: {
        //     useUnifiedTopology: true,
        //   },
        // }),
      ],
    });

    logger.error(typeof data === 'object' ? JSON.stringify(data) : data);
  }

  warn(data) {
    console.warn(data);
  }
  debug(data) {
    console.debug(data);
  }

  info(data) {
    console.info(data);
  }
  verbose(data) {
    console.log(data);
  }
}

export default Logger;
