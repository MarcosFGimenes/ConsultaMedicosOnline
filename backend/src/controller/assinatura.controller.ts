import type { Request, Response } from 'express';
import { salvarAssinatura } from '../services/firestore.service.js';

export class AssinaturaController {
    static async criarOuAtualizar(req: Request, res: Response) {
        try {
            const assinatura = req.body;
            if (!assinatura.idAssinatura) {
                return res.status(400).json({ error: 'idAssinatura é obrigatório.' });
            }
            const result = await salvarAssinatura(assinatura);
            return res.status(201).json({ message: 'Assinatura salva com sucesso.', id: result.id });
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Erro ao salvar assinatura.' });
        }
    }
}
