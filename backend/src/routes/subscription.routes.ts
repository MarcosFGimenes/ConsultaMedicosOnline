import { Router } from 'express';
import { SubscriptionController } from '../controller/subscription.controller.js';
import { autenticarFirebase } from '../middlewares/auth.middleware.js';

const router = Router();

// POST /api/subscription/rapidoc-beneficiary
router.post('/subscription/rapidoc-beneficiary', SubscriptionController.createRapidocBeneficiary);

// POST /api/subscription/start
router.post('/subscription/start', SubscriptionController.startSubscription);

// GET /api/subscription/check-payment/:assinaturaId
router.get('/subscription/check-payment/:assinaturaId', SubscriptionController.checkFirstPayment);

// GET /api/subscription/payment-details/:assinaturaId
router.get('/subscription/payment-details/:assinaturaId', SubscriptionController.paymentDetails);

// DELETE /api/subscription/cancel/:assinaturaId
router.delete('/subscription/cancel/:assinaturaId', SubscriptionController.cancelSubscription);

// POST /api/subscription/cancelar-plano (protegido - requer autenticação)
router.post('/subscription/cancelar-plano', autenticarFirebase, SubscriptionController.cancelarPlanoUsuario);

// GET /api/subscription/status-plano (protegido - requer autenticação)
router.get('/subscription/status-plano', autenticarFirebase, SubscriptionController.verificarStatusPlano);

// GET /api/subscription/onboarding-status/:cpf
router.get('/subscription/onboarding-status/:cpf', SubscriptionController.onboardingStatus);

// POST /api/subscription/complete-onboarding
router.post('/subscription/complete-onboarding', SubscriptionController.completeOnboarding);

// PUT /api/subscription/update-payment-method/:assinaturaId (protegido - requer autenticação)
router.put('/subscription/update-payment-method/:assinaturaId', autenticarFirebase, SubscriptionController.updatePaymentMethod);

// POST /api/subscription/generate-card-verification-url/:assinaturaId (protegido - requer autenticação)
router.post('/subscription/generate-card-verification-url/:assinaturaId', autenticarFirebase, SubscriptionController.generateCardVerificationUrl);

// POST /api/subscription/verify-and-update-card/:assinaturaId (protegido - requer autenticação)
router.post('/subscription/verify-and-update-card/:assinaturaId', autenticarFirebase, SubscriptionController.verifyAndUpdateCard);

export default router;