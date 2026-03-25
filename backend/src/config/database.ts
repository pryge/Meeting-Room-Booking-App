import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'mydb',
  process.env.DB_USER || 'admin',
  process.env.DB_PASSWORD || '1234',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5435,
    dialect: 'postgres',
    logging: false
  }
);

export default sequelize;