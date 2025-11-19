import { Router } from 'express';
import { AuthController } from '../controller/auth.controller.js';

const router = Router();

router.post('/auth/tipo-usuario', AuthController.tipoUsuario);

export default router;
