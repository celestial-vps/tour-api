import { DataSource } from 'typeorm';
import * as path from 'path';
import { Bank } from '../models/bank.entity';

console.log("DataSource File Loaded");

// Your DataSource definition here
export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Serverh5n&*#',
    database: 'basedbNest',
    synchronize: false,
    logging: true,
    entities: ['src/**/*.entity.ts'],
    migrations: [path.join(__dirname, 'migrations/*.ts')]
});
