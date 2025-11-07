import { Router } from 'express';
import { SubscriptionController } from '../controller/subscription.controller.js';

const router = Router();

// POST /api/subscription/start
router.post('/subscription/start', SubscriptionController.startSubscription);

// GET /api/subscription/check-payment/:assinaturaId
router.get('/subscription/check-payment/:assinaturaId', SubscriptionController.checkFirstPayment);

export default router;
