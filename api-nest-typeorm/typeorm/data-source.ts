import { DataSource } from 'typeorm';
import { config } from 'dotenv';
config();

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
