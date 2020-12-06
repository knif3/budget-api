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

(async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log('Connection to the database has been established successfully.');
  }
  catch (error) {
    console.error(error.message);
    process.exit(-1);
  }
})();

export { sequelize };
