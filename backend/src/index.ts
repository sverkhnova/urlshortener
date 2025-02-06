import express from 'express';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import shortenerRoutes from './routes/shortener.routes';

dotenv.config();

const app = express();
app.use(express.json());

// Подключаем наш роут
app.use('/', shortenerRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log('Data Source has been initialized!');
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });
