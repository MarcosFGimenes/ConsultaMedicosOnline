import { Router } from 'express';

const router = Router();

router.get('/', async (req: any, res) => {
  res.json({ success: true, message: 'List specialties endpoint' });
});

export default router;
