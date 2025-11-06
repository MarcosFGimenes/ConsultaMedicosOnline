import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Get subscription endpoint' });
});

router.get('/invoices', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'List invoices endpoint' });
});

router.post('/cancel', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Cancel subscription endpoint' });
});

export default router;
