import type { Request, Response } from 'express';
import admin from 'firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { firebaseApp } from '../config/firebase.js';

export class AdminController {
  // Cadastro de administrador (apenas outro admin pode cadastrar)
  static async cadastrar(req: Request, res: Response) {
    try {
      const { nome, email, senha } = req.body;
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
      }

      // Verifica se já existe admin com esse email
      const db = getFirestore(firebaseApp);
      const adminSnap = await db.collection('administradores').where('email', '==', email).get();
      if (!adminSnap.empty) {
        return res.status(409).json({ error: 'Já existe um administrador com esse email.' });
      }

      // Cria usuário no Firebase Auth
      const userRecord = await getAuth(firebaseApp).createUser({
        email,
        password: senha,
        displayName: nome,
      });

      // Salva na coleção administradores
      await db.collection('administradores').doc(userRecord.uid).set({
        uid: userRecord.uid,
        nome,
        email,
        criadoEm: new Date().toISOString(),
      });

      return res.status(201).json({ message: 'Administrador cadastrado com sucesso.', uid: userRecord.uid });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro ao cadastrar administrador.' });
    }
  }
}
