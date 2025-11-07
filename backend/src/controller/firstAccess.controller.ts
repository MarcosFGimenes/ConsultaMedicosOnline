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
      if (!cpf) {
        return res.status(400).json({ error: 'CPF é obrigatório.' });
      }
      // Busca usuário no Firestore
      const usuarioRef = getFirestore(firebaseApp).collection('usuarios').doc(cpf);
      const usuarioDoc = await usuarioRef.get();
      if (!usuarioDoc.exists) {
        return res.status(404).json({ error: 'Usuário não encontrado.' });
      }
      const usuario = usuarioDoc.data();
      if (usuario?.primeiroAcesso) {
        // Usuário já realizou o primeiro acesso
        return res.status(409).json({ error: 'Usuário já realizou o primeiro acesso.' });
      }
      // Gera senha temporária
      const senhaTemporaria = FirstAccessController.gerarSenhaTemporaria();
      // Cria usuário no Firebase Auth
      const email = usuario?.email;
      try {
        // Tentando criar usuário no Firebase Auth
        await getAuth(firebaseApp).createUser({
          uid: cpf,
          email,
          password: senhaTemporaria,
          displayName: usuario?.nome || undefined,
        });
        // Usuário criado no Firebase Auth com sucesso
      } catch (error: any) {
        // Erro ao criar usuário no Firebase Auth
        if (error.code === 'auth/email-already-exists' || error.code === 'auth/uid-already-exists') {
          return res.status(409).json({ error: 'Usuário já existe no sistema de autenticação.' });
        }
        throw error;
      }
      // Marca primeiro acesso no banco
      await usuarioRef.update({ primeiroAcesso: true });
      // Primeiro acesso marcado no Firestore
      return res.status(201).json({
        message: 'Primeiro acesso realizado com sucesso.',
        cpf,
        email,
        senhaTemporaria
      });
    } catch (error: any) {
      // Erro geral
      return res.status(500).json({ error: error.message || 'Erro no primeiro acesso.' });
    }
  }
}
