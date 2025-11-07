import { Router } from 'express';
import { UsuarioController } from '../controller/usuario.controller.js';
import { AssinaturaController } from '../controller/assinatura.controller.js';
import { BeneficiarioController } from '../controller/beneficiario.controller.js';

const router = Router();

router.post('/usuarios', UsuarioController.criarOuAtualizar);
router.post('/assinaturas', AssinaturaController.criarOuAtualizar);
router.post('/beneficiarios', BeneficiarioController.criarOuAtualizar);

export default router;
