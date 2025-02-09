import express from 'express';
import dotenv from 'dotenv';
import shortenerRoutes from './routes/shortener.routes';
// ... другие импорты

dotenv.config();

export const app = express();
app.use(express.json());

// Роуты
app.use('/', shortenerRoutes);
// ... etc
