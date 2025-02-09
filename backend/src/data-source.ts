import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ShortLink } from './entities/ShortLink';
import { Analytics } from './entities/Analytics';
import 'dotenv/config'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'url_shortener',
  entities: [ShortLink, Analytics],
  synchronize: true
});
