import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: 'mysql', // <- harus literal 'mysql', bukan string umum
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'basedbnest',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  logging: true,
  logger: 'advanced-console',
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
