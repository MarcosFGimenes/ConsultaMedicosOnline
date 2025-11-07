import type { Request, Response } from 'express';
import { salvarUsuario } from '../services/firestore.service.js';

export class UsuarioController {
    static async criarOuAtualizar(req: Request, res: Response) {
        try {
            const usuario = req.body;
            if (!usuario.cpf) {
                return res.status(400).json({ error: 'CPF é obrigatório.' });
            }
            const result = await salvarUsuario(usuario);
            return res.status(201).json({ message: 'Usuário salvo com sucesso.', id: result.id });
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Erro ao salvar usuário.' });
        }
    }
}
