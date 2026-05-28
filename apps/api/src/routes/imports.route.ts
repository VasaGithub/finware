import { Router, type NextFunction, type Request, type Response, type Router as RouterType } from 'express';
import multer from 'multer';
import { z } from 'zod';
import { processImport } from '../services/imports/import.service.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const bodySchema = z.object({
  accountId: z.string().min(1),
});

export const importsRouter: RouterType = Router();

importsRouter.post(
  '/',
  upload.single('file'),
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsedBody = bodySchema.safeParse(req.body);
      if (!parsedBody.success) {
        res.status(400).json({
          error: 'Invalid request',
          details: parsedBody.error.flatten(),
        });
        return;
      }

      if (!req.file) {
        res.status(400).json({ error: 'file is required' });
        return;
      }

      // TODO(auth): replace with authenticated session userId
      const userId = req.header('x-user-id');
      if (!userId) {
        res.status(400).json({ error: 'X-User-Id header required (dev mode)' });
        return;
      }

      const result = await processImport({
        accountId: parsedBody.data.accountId,
        userId,
        filename: req.file.originalname,
        buffer: req.file.buffer,
        source: 'MANUAL_UPLOAD',
      });

      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },
);
