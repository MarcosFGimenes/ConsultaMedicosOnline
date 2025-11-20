import type { Request, Response } from 'express';

export class AuthController {
  static async tipoUsuario(req: Request, res: Response) {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ error: 'Email é obrigatório.' });
    try {
      const { getFirestore } = await import('firebase-admin/firestore');
      const { firebaseApp } = await import('../config/firebase.js');
      const db = getFirestore(firebaseApp);
      // 1. Admin
      const adminSnap = await db.collection('administradores').where('email', '==', email).limit(1).get();
      if (!adminSnap.empty) return res.json({ tipo: 'admin' });
      // 2. Assinante
      const userSnap = await db.collection('usuarios').where('email', '==', email).limit(1).get();
      if (!userSnap.empty) return res.json({ tipo: 'subscriber' });
      // 3. Dependente
      const depSnap = await db.collection('beneficiarios').where('email', '==', email).limit(1).get();
      if (!depSnap.empty) return res.json({ tipo: 'dependent' });
      return res.json({ tipo: null });
    } catch (e: any) {
      return res.status(500).json({ error: e.message || 'Erro ao consultar tipo de usuário.' });
    }
  }
}
