import type { Request, Response } from 'express';
import { salvarUsuario } from '../services/firestore.service.js';
import { verificarAssinaturaPorCpf } from '../services/asaas.service.js';
import axios from 'axios';
import { configDotenv } from 'dotenv';
configDotenv();

export class UsuarioController {
    static async criarOuAtualizar(req: Request, res: Response) {
        try {
            const usuario = req.body;
            if (!usuario.cpf) {
                return res.status(400).json({ error: 'CPF é obrigatório.' });
            }

            // Verifica se usuário existe no Rapidoc
            let rapidocContaExiste = false;
            try {
                const resp = await axios.get(`${process.env.RAPIDOC_BASE_URL}/${usuario.cpf}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.RAPIDOC_TOKEN}`,
                        clientId: process.env.RAPIDOC_CLIENT_ID,
                        'Content-Type': 'application/vnd.rapidoc.tema-v2+json'
                    }
                });
                const data = resp.data && resp.data.beneficiary;
                rapidocContaExiste = !!data && !!data.uuid && data.isActive === true;
            } catch (err) {
                rapidocContaExiste = false;
            }
            if (!rapidocContaExiste) {
                return res.status(404).json({ error: 'Usuário não possui conta no Rapidoc.' });
            }

            // Verifica se usuário existe no Asaas e pagamento está em dia
            const asaasCheck = await verificarAssinaturaPorCpf(usuario.cpf);
            if (!asaasCheck.assinaturaOk || !asaasCheck.cliente?.pagamentoEmDia) {
                return res.status(402).json({ error: 'Usuário não possui assinatura ativa e paga no Asaas.' });
            }

            const result = await salvarUsuario(usuario);
            return res.status(201).json({ message: 'Usuário salvo com sucesso.', id: result.id });
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Erro ao salvar usuário.' });
        }
    }
}
