import { Router } from 'express';
import { PlanosController } from '../controller/planos.controller.js';
import { autenticarAdministrador } from '../middlewares/auth.middleware.js';

const router = Router();

// GET /api/planos - Lista todos os planos locais
router.get('/planos', PlanosController.listarPlanos);

// GET /api/planos/:id - Obtém um plano local específico
router.get('/planos/:id', PlanosController.obterPlano);

// GET /api/planos/rapidoc - Lista planos Rapidoc (direto da API)
router.get('/planos/rapidoc', PlanosController.listarPlanosRapidoc);

// GET /api/planos/rapidoc/:uuid - Detalhes de um plano Rapidoc
router.get('/planos/rapidoc/:uuid', PlanosController.obterPlanoRapidoc);

// PUT /api/planos/rapidoc/:uuid/especialidades - atualiza specialties do plano Rapidoc (admin)
router.put('/planos/rapidoc/:uuid/especialidades', autenticarAdministrador, PlanosController.atualizarEspecialidadesPlanoRapidoc);

export default router;
