// 3rd-party dependencies
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Server } from 'http';
import { createServer, Server as SecureServer } from 'https';
import fs from 'fs';

// src imports & config
import './config/env'
import { ENV, PORT } from './shared/constants'; //will also trigger dotenv config procedure
import logger from './config/logger';
import { initDatabases, closeConnections } from './config/database/db-factory'; // close db connection
import { errorMiddleware, notFoundMiddleware, responseFormatter, loggerMiddleware } from './shared/middlewares';
import { initializeRedisClient } from './config/cache'; // initialize redis client
import { StageEnum } from './shared/enums';

// app container & server instance
const APP = express();
let server: Server | SecureServer | null = null;

// spin up the server depenging on the stage
switch (ENV) {
  case StageEnum.DEV:
    server = APP.listen(PORT, () => {
      logger.info(`⚡️[server]: Server is running at http://localhost:${PORT} in ${ENV} mode`);
    });
    break;

  case StageEnum.PROD:
    // Load SSL certificates
    const sslOptions = {
      key: fs.readFileSync('./certs/privkey1.pem'),
      cert: fs.readFileSync('./certs/fullchain1.pem'),
    };
    server = createServer(sslOptions, APP);
    server.listen(PORT, () => {
      logger.info(`⚡️[server]: Server is running at https://localhost:${PORT} in ${ENV} mode`);
    });
    break;

  default:
    server = APP.listen(PORT, () => {
      logger.info(`⚡️[server]: Server is running at http://localhost:${PORT} in ${ENV} mode`);
    });
    break;
}


// startup script
(async () => {
  try {

    // middleware stack
    // 3rd party middlewares
    APP.use(express.json())
    APP.use(express.urlencoded({ extended: true })); // no need for body-parser
    APP.use(cors(
      {
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        allowedHeaders: 'Content-Type, Authorization, Origin, X-Requested-With, Accept',
      },
    ));
    APP.use(helmet());
    APP.use(
      rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 500, // limit each IP to 100 requests per windowMs
      }),
    );
    APP.set('trust proxy', 1); // trust nginx

    // custom middlewares
    APP.use(loggerMiddleware)
    APP.use(responseFormatter)
    const { default: restRouter } = await import('./modules/routes');
    APP.use('/api/v0.1/', restRouter);
    APP.use(errorMiddleware);
    APP.use(notFoundMiddleware);

    // app dependencies
    await initDatabases(); // initialize db connections
    await initializeRedisClient(); // initialize redis client

  } catch (error) {
    logger.error('Unable to connect,', error);
    process.exit(1);
  }
})();

// graceful shutdown
process.on('SIGINT', async () => {
  server!.close(() => {
    logger.info('Server closed gracefully');
    closeConnections().then(() => {
      process.exit(0);
    });
  });
});

export const APP_SERVER = APP; // exports for testing