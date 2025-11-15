import { Router } from 'express';
import { FaturasController } from '../controller/faturas.controller.js';
import { autenticarFirebase } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/faturas - lista faturas do usuário autenticado (via CPF no token)
router.get('/faturas', autenticarFirebase, FaturasController.listarDoAutenticado);

export default router;
