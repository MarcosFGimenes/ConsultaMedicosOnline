import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// GET /api/users/profile
router.get('/profile', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'User profile endpoint' });
});

// PUT /api/users/profile
router.put('/profile', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Update profile endpoint' });
});

// PUT /api/users/password
router.put('/password', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Change password endpoint' });
});

// POST /api/users/avatar
router.post('/avatar', authMiddleware, async (req: any, res) => {
  res.json({ success: true, message: 'Upload avatar endpoint' });
});

export default router;
