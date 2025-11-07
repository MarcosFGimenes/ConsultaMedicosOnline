import type { Request, Response } from 'express';
import { salvarBeneficiarioRapidoc } from '../services/firestore.service.js';
import admin from 'firebase-admin';

export class BeneficiarioController {
    static async criarOuAtualizar(req: Request, res: Response) {
        try {
            const beneficiario = req.body;

            if (!beneficiario.cpf) {
                return res.status(400).json({ error: 'CPF do beneficiário é obrigatório.' });
            }
            if (!beneficiario.holder) {
                return res.status(400).json({ error: 'CPF do responsável (holder) é obrigatório.' });
            }

            // Verifica se o responsável existe no banco de dados
            const responsavelRef = admin.firestore().collection('usuarios').doc(beneficiario.holder);
            const responsavelDoc = await responsavelRef.get();
            if (!responsavelDoc.exists) {
                return res.status(404).json({ error: 'Responsável não cadastrado no banco de dados.' });
            }

            // Permitir campo parentesco (opcional)
            if (typeof beneficiario.parentesco !== 'string') {
                beneficiario.parentesco = undefined;
            }

            const result = await salvarBeneficiarioRapidoc(beneficiario);
            return res.status(201).json({ message: 'Beneficiário salvo com sucesso.', id: result.id });
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Erro ao salvar beneficiário.' });
        }
    }
}
