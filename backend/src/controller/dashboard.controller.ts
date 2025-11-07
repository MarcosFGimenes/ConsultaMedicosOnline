import type { Request, Response } from 'express';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseApp } from '../config/firebase.js';

export class DashboardController {
  static async getDashboard(req: Request, res: Response) {
    try {
      const uid = req.user?.uid || req.user?.sub;
      if (!uid) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }
      // Busca dados do usuário
      const usuarioRef = getFirestore(firebaseApp).collection('usuarios').doc(uid);
      const usuarioDoc = await usuarioRef.get();
      if (!usuarioDoc.exists) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      const usuario = usuarioDoc.data();
      // Busca assinaturas
      const assinaturasSnap = await getFirestore(firebaseApp).collection('assinaturas').where('cpfUsuario', '==', uid).get();
      const assinaturas = assinaturasSnap.docs.map(doc => doc.data());
      // Busca beneficiários
      const beneficiariosSnap = await getFirestore(firebaseApp).collection('beneficiarios').where('holder', '==', uid).get();
      const beneficiarios = beneficiariosSnap.docs.map(doc => doc.data());
      return res.status(200).json({ usuario, assinaturas, beneficiarios });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro ao buscar dashboard.' });
    }
  }
}
