import { Router } from 'express';
import { FirstAccessController } from '../controller/firstAccess.controller.js';

const router = Router();

// POST /api/first-access/validate-cpf
router.post('/first-access/validate-cpf', FirstAccessController.validateCpf);

// POST /api/first-access
router.post('/first-access', FirstAccessController.primeiroAcesso);

export default router;
