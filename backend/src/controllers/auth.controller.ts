import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import prisma from '../lib/prisma';
import { AuthRequest } from '../middlewares/auth.middleware';

// Schemas de validação
const loginSchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
});

const registerSchema = z.object({
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
});

const validateCpfSchema = z.object({
  cpf: z.string().length(11, 'CPF deve ter 11 dígitos'),
});

export class AuthController {
  // POST /api/auth/login
  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = loginSchema.parse(req.body);

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: { email },
        include: { subscription: true },
      });

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas',
        });
        return;
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Credenciais inválidas',
        });
        return;
      }

      // Gerar token JWT
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      // Remover senha do retorno
      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
        message: 'Login realizado com sucesso',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao fazer login',
      });
    }
  }

  // POST /api/auth/validate-cpf
  async validateCpf(req: Request, res: Response): Promise<void> {
    try {
      const { cpf } = validateCpfSchema.parse(req.body);

      // Verificar se CPF já está cadastrado
      const existingUser = await prisma.user.findUnique({
        where: { cpf },
      });

      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'CPF já cadastrado. Faça login.',
        });
        return;
      }

      // Aqui você pode adicionar lógica para verificar se o CPF tem assinatura ativa
      // Por exemplo, verificar em uma tabela de assinaturas pendentes

      res.json({
        success: true,
        message: 'CPF válido para cadastro',
        data: { cpf },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'CPF inválido',
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao validar CPF',
      });
    }
  }

  // POST /api/auth/register
  async register(req: Request, res: Response): Promise<void> {
    try {
      const { cpf, email, password, name } = registerSchema.parse(req.body);

      // Verificar se e-mail já existe
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        res.status(400).json({
          success: false,
          message: 'E-mail já cadastrado',
        });
        return;
      }

      // Verificar se CPF já existe
      const existingCpf = await prisma.user.findUnique({
        where: { cpf },
      });

      if (existingCpf) {
        res.status(400).json({
          success: false,
          message: 'CPF já cadastrado',
        });
        return;
      }

      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 10);

      // Criar usuário
      const user = await prisma.user.create({
        data: {
          cpf,
          email,
          password: hashedPassword,
          name,
          role: 'SUBSCRIBER',
        },
      });

      // Gerar token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;

      res.status(201).json({
        success: true,
        data: {
          user: userWithoutPassword,
          token,
        },
        message: 'Cadastro realizado com sucesso',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: error.errors,
        });
        return;
      }

      res.status(500).json({
        success: false,
        message: 'Erro ao criar conta',
      });
    }
  }

  // GET /api/auth/me
  async getMe(req: AuthRequest, res: Response): Promise<void> {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.userId },
        include: {
          subscription: {
            include: { plan: true },
          },
          address: true,
        },
      });

      if (!user) {
        res.status(404).json({
          success: false,
          message: 'Usuário não encontrado',
        });
        return;
      }

      const { password: _, ...userWithoutPassword } = user;

      res.json({
        success: true,
        data: userWithoutPassword,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar dados do usuário',
      });
    }
  }

  // POST /api/auth/logout
  async logout(req: Request, res: Response): Promise<void> {
    // Logout é feito no frontend removendo o token
    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  }

  // POST /api/auth/forgot-password
  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Por segurança, retornar sucesso mesmo se usuário não existir
        res.json({
          success: true,
          message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha',
        });
        return;
      }

      // TODO: Implementar envio de e-mail com token de recuperação
      // const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
      // await sendPasswordResetEmail(user.email, resetToken);

      res.json({
        success: true,
        message: 'Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha',
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao processar solicitação',
      });
    }
  }

  // POST /api/auth/reset-password
  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        userId: string;
      };

      // Hash da nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Atualizar senha
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
      });

      res.json({
        success: true,
        message: 'Senha redefinida com sucesso',
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Token inválido ou expirado',
      });
    }
  }
}
