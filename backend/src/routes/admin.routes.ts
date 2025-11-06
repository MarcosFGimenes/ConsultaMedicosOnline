import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middlewares/auth.middleware';

const router = Router();

// Todas as rotas de admin requerem autenticação E permissão de admin
router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/dashboard', async (req: any, res) => {
  res.json({ success: true, message: 'Admin dashboard endpoint' });
});

router.get('/users', async (req: any, res) => {
  res.json({ success: true, message: 'List all users endpoint' });
});

router.get('/plans', async (req: any, res) => {
  res.json({ success: true, message: 'List plans endpoint' });
});

router.post('/plans', async (req: any, res) => {
  res.json({ success: true, message: 'Create plan endpoint' });
});

router.get('/logs', async (req: any, res) => {
  res.json({ success: true, message: 'Get logs endpoint' });
});

export default router;
