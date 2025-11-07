import { configDotenv } from 'dotenv';
import type { Request, Response } from 'express';
import { firebaseApp } from '../config/firebase.js';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
configDotenv();

export class FirstAccessController {
  static async validateCpf(req: Request, res: Response) {
    const { cpf } = req.body;
    if (!cpf || typeof cpf !== 'string') {
      return res.status(400).json({ error: 'CPF é obrigatório e deve ser uma string.' });
    }

    try {
      // Consultar Asaas por assinatura
      const { verificarAssinaturaPorCpf } = await import('../services/asaas.service.js');
        const resultado = await verificarAssinaturaPorCpf(cpf);
        if (!resultado.assinaturaOk) {
          return res.status(200).json({
            podeCadastrar: true,
            message: 'CPF não validado. Você pode se cadastrar para iniciar sua assinatura.'
          });
        }

      return res.status(200).json({
        message: 'CPF validado com sucesso.',
          usuario: resultado.cliente,
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno ao validar CPF.' });
    }
  }
  static gerarSenhaTemporaria(tamanho = 8) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
    let senha = '';
    for (let i = 0; i < tamanho; i++) {
      senha += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return senha;
  }

  static async primeiroAcesso(req: Request, res: Response) {
    try {
      const { cpf } = req.body;
      console.log('[PrimeiroAcesso] CPF recebido:', cpf);
      console.log('[PrimeiroAcesso] FIREBASE_CREDENTIALS_FILE:', process.env.FIREBASE_CREDENTIALS_FILE);
      if (!cpf) {
        console.error('[PrimeiroAcesso] CPF não informado');
        return res.status(400).json({ error: 'CPF é obrigatório.' });
      }
      // Busca usuário no Firestore
      const usuarioRef = getFirestore(firebaseApp).collection('usuarios').doc(cpf);
      const usuarioDoc = await usuarioRef.get();
      if (!usuarioDoc.exists) {
        console.error('[PrimeiroAcesso] Usuário não encontrado no Firestore');
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      const usuario = usuarioDoc.data();
      if (usuario?.primeiroAcesso) {
        console.warn('[PrimeiroAcesso] Usuário já realizou o primeiro acesso');
        return res.status(409).json({ error: 'Usuário já realizou o primeiro acesso.' });
      }
      // Gera senha temporária
      const senhaTemporaria = FirstAccessController.gerarSenhaTemporaria();
      // Cria usuário no Firebase Auth
      const email = usuario?.email;
      try {
        console.log('[PrimeiroAcesso] Tentando criar usuário no Firebase Auth:', { uid: cpf, email });
        await getAuth(firebaseApp).createUser({
          uid: cpf,
          email,
          password: senhaTemporaria,
          displayName: usuario?.nome || undefined,
        });
        console.log('[PrimeiroAcesso] Usuário criado no Firebase Auth com sucesso');
      } catch (error: any) {
        console.error('[PrimeiroAcesso] Erro ao criar usuário no Firebase Auth:', error);
        if (error.code === 'auth/email-already-exists' || error.code === 'auth/uid-already-exists') {
          return res.status(409).json({ error: 'Usuário já existe no sistema de autenticação.' });
        }
        throw error;
      }
      // Marca primeiro acesso no banco
      await usuarioRef.update({ primeiroAcesso: true });
      console.log('[PrimeiroAcesso] Primeiro acesso marcado no Firestore');
      return res.status(201).json({
        message: 'Primeiro acesso realizado com sucesso.',
        cpf,
        email,
        senhaTemporaria
      });
    } catch (error: any) {
      console.error('[PrimeiroAcesso] Erro geral:', error);
      return res.status(500).json({ error: error.message || 'Erro no primeiro acesso.' });
    }
  }
}
