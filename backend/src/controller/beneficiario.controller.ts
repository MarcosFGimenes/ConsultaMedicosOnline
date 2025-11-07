import type { Request, Response } from 'express';
import { salvarBeneficiarioRapidoc } from '../services/firestore.service.js';

export class BeneficiarioController {
    static async criarOuAtualizar(req: Request, res: Response) {
        try {
            const beneficiario = req.body;
            if (!beneficiario.cpf) {
                return res.status(400).json({ error: 'CPF do beneficiário é obrigatório.' });
            }
            const result = await salvarBeneficiarioRapidoc(beneficiario);
            return res.status(201).json({ message: 'Beneficiário salvo com sucesso.', id: result.id });
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Erro ao salvar beneficiário.' });
        }
    }
}
