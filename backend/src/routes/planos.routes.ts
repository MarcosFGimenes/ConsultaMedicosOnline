import { Router } from 'express';
import { PlanosController } from '../controller/planos.controller.js';

const router = Router();

// GET /api/planos - Lista todos os planos disponíveis
router.get('/planos', PlanosController.listarPlanos);


export default router;
