import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

const envFilePath = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({
    path: envFilePath,
});

// console.log('Environment:', process.env.NODE_ENV);
// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_PORT:', process.env.DB_PORT);
// console.log('DB_ROOT_USERNAME:', process.env.DB_ROOT_USERNAME);
// console.log('DB_ROOT_PASSWORD:', process.env.DB_ROOT_PASSWORD);
// console.log('DATABASE:', process.env.DATABASE);

const dataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_ROOT_USERNAME,
    password: process.env.DB_ROOT_PASSWORD,
    database: process.env.DATABASE,
    migrations: [`${__dirname}/migrations/**/*.ts`],
});

export default dataSource;
