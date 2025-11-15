import { Router } from 'express';
import { AgendamentoController } from '../controller/agendamento.controller.js';
import { autenticarFirebase } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/agendamentos - agenda consulta no Rapidoc
router.post('/agendamentos', autenticarFirebase, AgendamentoController.criar);
router.get('/agendamentos/:uuid', autenticarFirebase, AgendamentoController.ler);
router.delete('/agendamentos/:uuid', autenticarFirebase, AgendamentoController.cancelar);

// Consulta imediata (fila/triagem)
router.post('/agendamentos/imediato', autenticarFirebase, AgendamentoController.solicitarImediato);
router.get('/agendamentos/imediato/:id', autenticarFirebase, AgendamentoController.statusImediato);
router.delete('/agendamentos/imediato/:id', autenticarFirebase, AgendamentoController.cancelarSolicitacaoImediato);

export default router;
