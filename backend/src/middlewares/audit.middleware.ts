import type { Request, Response, NextFunction } from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseApp } from '../config/firebase.js';

function hrtimeMs(start: bigint, end: bigint) {
  const ns = end - start; // bigint ns
  return Number(ns) / 1e6;
}

export function auditLogger(req: Request, res: Response, next: NextFunction) {
  // Permite desativar via env
  const enabled = (process.env.ENABLE_API_AUDIT_LOGS ?? 'true').toLowerCase() !== 'false';
  if (!enabled) return next();

  const start = process.hrtime.bigint();

  // Captura dados básicos agora
  const method = req.method;
  const originalUrl = req.originalUrl || req.url;
  const ip = (req.headers['x-forwarded-for'] as string) || req.ip || '';
  const userAgent = (req.headers['user-agent'] as string) || '';

  res.on('finish', () => {
    try {
      const end = process.hrtime.bigint();
      const latencyMs = hrtimeMs(start, end);
      const status = res.statusCode;

      // Pode ser preenchido por middlewares de auth
      const uid = (req as any)?.user?.uid || (req as any)?.admin?.uid || null;
      const cpf = (req as any)?.user?.cpf || (req.params as any)?.cpf || (req.body as any)?.cpf || null;

      const log: Record<string, any> = {
        ts: new Date().toISOString(),
        method,
        url: originalUrl,
        status,
        latencyMs: Math.round(latencyMs * 1000) / 1000, // 3 casas
        uid,
        cpf,
        ip,
        userAgent,
      };

      const db = getFirestore(firebaseApp);
      // fire-and-forget
      db.collection('logs_api').add(log).catch(() => { /* ignora falhas de log */ });
    } catch {
      // Nunca quebra o fluxo por erro de log
    }
  });

  next();
}
