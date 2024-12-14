import { createLogger, transports, format, Logger } from 'winston';
const { combine, timestamp, printf, json, colorize } = format;
import { ENV } from '../../shared/constants';
import { StageEnum } from '../../shared/enums';

let testLogger: Logger | null = null;
if (ENV === StageEnum.TEST) {
  testLogger = createLogger({
    transports: [
      new transports.File({ filename: `.logs/test/test.log` }),
      new transports.Console({ format: format.combine(colorize(), format.simple()) }),
    ],
    level: process.env.LOG_LEVEL || 'warn',
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSSZZ' }),
      json(),
      printf(({ timestamp, level, message, service = '' }) => {
        return `[${timestamp}] ${service} [${level}]: ${message}`;
      }),
    ),
  });
}


export { testLogger };