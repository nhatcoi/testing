import express from 'express';
import cors from 'cors';
import { createProductRouter } from './routes/products.js';

export function createApp(store) {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/products', createProductRouter(store));

  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ error: message });
  });

  return app;
}
