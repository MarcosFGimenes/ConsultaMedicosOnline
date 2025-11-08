import { Router } from 'express';
import { AdminController } from '../controller/admin.controller.js';

const router = Router();

// POST /api/admin/cadastrar - Cadastro de administrador
router.post('/admin/cadastrar', AdminController.cadastrar);

export default router;
