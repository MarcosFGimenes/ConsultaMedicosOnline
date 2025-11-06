import { Router } from 'express';
import { FirstAccessController } from '../controller/firstAccess.controller.js';

const router = Router();

// POST /api/first-access/validate-cpf
router.post('/first-access/validate-cpf', FirstAccessController.validateCpf);

export default router;
