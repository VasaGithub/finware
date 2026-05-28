import express, { type Request, type Response } from 'express';
import { logger } from './lib/logger.js';

const app = express();
const port = Number(process.env.API_PORT ?? 4000);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

const server = app.listen(port, () => {
  logger.info({ port }, 'API listening');
});

const shutdown = (signal: string): void => {
  logger.info({ signal }, 'Shutting down');
  server.close(() => process.exit(0));
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
