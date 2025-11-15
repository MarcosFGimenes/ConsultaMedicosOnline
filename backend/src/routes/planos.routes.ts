import { Router } from 'express';
import { PlanosController } from '../controller/planos.controller.js';

const router = Router();

// GET /api/planos - Lista todos os planos locais
router.get('/planos', PlanosController.listarPlanos);

// GET /api/planos/rapidoc - Lista planos Rapidoc (direto da API)
router.get('/planos/rapidoc', PlanosController.listarPlanosRapidoc);

// PUT /api/planos/rapidoc/:uuid/especialidades - atualiza specialties do plano Rapidoc
router.put('/planos/rapidoc/:uuid/especialidades', PlanosController.atualizarEspecialidadesPlanoRapidoc);

export default router;
