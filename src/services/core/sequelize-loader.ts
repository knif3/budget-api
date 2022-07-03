import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { logger } from './winston-logger-service';

dotenv.config();
const database_host = process.env.DATABASE_HOST || '';
const database = process.env.DATABASE_NAME || '';
const user = process.env.DATABASE_USER || '';
const password = process.env.DATABASE_PASSWORD || '';

const sequelize = new Sequelize(database, user, password, {
  host: database_host,
  dialect: 'postgres',
});

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  const retriesLimit = 120;
  let retries = 0;
  for (;;) {
    try {
      if (retries++ === retriesLimit) {
        logger.error('Failed to connect to the database!');
        process.exit(-1);
      }

      await sequelize.authenticate();
      await sequelize.sync();

      logger.info('Connection to the database has been established successfully.');
      break;
    } catch (error) {
      logger.warn(`${error.message} - Waiting for database (${retries}/${retriesLimit}) ...`);
      await sleep(3000);
    }
  }
})();

export { sequelize };
