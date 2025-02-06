import dotenv from 'dotenv';
dotenv.config();

import { AppDataSource } from './data-source';
import express from 'express';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello from Express + TypeORM');
});

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

