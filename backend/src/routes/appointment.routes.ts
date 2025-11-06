import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'List appointments endpoint' });
});

router.get('/history', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Get appointment history endpoint' });
});

router.get('/available-slots', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Get available slots endpoint' });
});

router.post('/', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Create appointment endpoint' });
});

router.put('/:id', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Update appointment endpoint' });
});

router.delete('/:id', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Cancel appointment endpoint' });
});

export default router;
