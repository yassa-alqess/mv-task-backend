import { devLogger } from './logger.dev';
import { prodLogger } from './logger.prod';
import { testLogger } from './logger.test-d';
import { ENV } from '../../shared/constants';
import { Logger } from 'winston';
import { StageEnum } from '../../shared/enums';

let logger: Logger | null = null;

switch (ENV) {
    case StageEnum.DEV:
        logger = devLogger;
        break;
    case StageEnum.TEST:
        logger = testLogger;
        break;
    default:
        logger = prodLogger;
}

export default logger as Logger;


// timezone printed is UTC