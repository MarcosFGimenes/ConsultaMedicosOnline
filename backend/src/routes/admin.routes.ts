import { Router } from 'express';
import { AdminController } from '../controller/admin.controller.js';
import { autenticarAdministrador } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/admin/cadastrar - Cadastro de administrador
router.post('/admin/cadastrar', AdminController.cadastrar);

// POST /api/admin/cadastrar-plano - Cadastro de plano
router.post('/admin/cadastrar-plano', autenticarAdministrador, AdminController.cadastrarPlano);

export default router;
