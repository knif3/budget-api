import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();
const database_host = process.env.DATABASE_HOST || '';
const database = process.env.DATABASE || '';
const user = process.env.USER || '';
const password = process.env.PASSWORD || '';

const sequelize = new Sequelize(database, user, password, {
  host: database_host,
  dialect: 'postgres',
});

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

(async () => {
  const retriesLimit = 120;
  let retries = 0;
  for (;;) {
    try {
      if (retries++ === retriesLimit) {
        console.error('Failed to connect to the database!');
        process.exit(-1);
      }

      await sequelize.authenticate();
      await sequelize.sync();

      console.log('Connection to the database has been established successfully.');
      break;
    } catch (error) {
      console.error(`${error.message} - Waiting for database (${retries}/${retriesLimit}) ...`);
      await sleep(3000);
    }
  }
})();

export { sequelize };
