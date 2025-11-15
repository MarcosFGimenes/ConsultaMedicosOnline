import { Router } from 'express';
import { EspecialidadesController } from '../controller/especialidades.controller.js';
import { autenticarFirebase } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/especialidades - lista especialidades globais
router.get('/especialidades', autenticarFirebase, EspecialidadesController.listarGlobais);

export default router;
