import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'List notifications endpoint' });
});

router.put('/:id/read', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Mark notification as read endpoint' });
});

router.delete('/:id', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Delete notification endpoint' });
});

export default router;
