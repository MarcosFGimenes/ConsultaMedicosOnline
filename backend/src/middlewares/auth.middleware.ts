
import type { Request, Response, NextFunction } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { firebaseApp } from '../config/firebase.js';

// Extensão do tipo Request para incluir user
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
  }
}

export async function autenticarFirebase(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido.' });
    }
  const token = authHeader.split(' ')[1] || '';
  const decoded = await getAuth(firebaseApp).verifyIdToken(token);
  req.user = decoded;
  return next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}
