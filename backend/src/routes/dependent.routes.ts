import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'List dependents endpoint' });
});

router.post('/', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Create dependent endpoint' });
});

router.put('/:id', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Update dependent endpoint' });
});

router.delete('/:id', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Delete dependent endpoint' });
});

export default router;
