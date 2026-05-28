import express, { type NextFunction, type Request, type Response } from 'express';
import { logger } from './lib/logger.js';
import { importsRouter } from './routes/imports.route.js';

const app = express();
const port = Number(process.env.API_PORT ?? 4000);

app.use(express.json());

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/imports', importsRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  logger.error({ errorMessage: err.message, stack: err.stack }, 'Unhandled error');
  res.status(500).json({ error: 'Internal server error' });
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
