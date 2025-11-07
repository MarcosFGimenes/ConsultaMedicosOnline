import type { Request, Response } from 'express';

export class SubscriptionController {
    static async createRapidocBeneficiary(req: Request, res: Response) {
        const { nome, email, cpf, birthday } = req.body;
        if (!nome || !email || !cpf || !birthday) {
            return res.status(400).json({ error: 'Nome, email, CPF e birthday são obrigatórios.' });
        }
        try {
            const { cadastrarBeneficiarioRapidoc } = await import('../services/rapidoc.service.js');
            const beneficiario = await cadastrarBeneficiarioRapidoc({ nome, email, cpf, birthday });
            return res.status(201).json({ message: 'Beneficiário Rapidoc criado com sucesso.', beneficiario });
        } catch (error: any) {
            return res.status(500).json({ error: error?.response?.data || error.message || 'Erro ao cadastrar beneficiário Rapidoc.' });
        }
    }

    static async startSubscription(req: Request, res: Response) {
        const { nome, email, cpf, telefone, valor } = req.body;
        if (!nome || !email || !cpf) {
            return res.status(400).json({ error: 'Nome, email e CPF são obrigatórios.' });
        }
        if (typeof valor !== 'number' || isNaN(valor) || valor <= 0) {
            return res.status(400).json({ error: 'Valor da assinatura é obrigatório e deve ser um número válido.' });
        }

        try {
            // 1. Criar cliente no Asaas
            const { criarClienteAsaas } = await import('../services/asaas.service.js');
            const cliente = await criarClienteAsaas({ nome, email, cpf, telefone });

            // 2. Criar assinatura no Asaas
            const { criarAssinaturaAsaas } = await import('../services/asaas.service.js');
            const ciclo = req.body.ciclo;
            const billingType = req.body.billingType || 'BOLETO';
            const description = req.body.description || 'Assinatura Consulta Médicos Online';
            const assinatura = await criarAssinaturaAsaas({ customer: cliente.id, value: valor, cycle: ciclo, billingType, description });
            const assinaturaId = assinatura.id;

            return res.status(201).json({
                message: 'Assinatura iniciada. Aguarde confirmação do pagamento.',
                clienteId: cliente.id,
                assinaturaId
            });
        } catch (error: any) {
            return res.status(500).json({ error: error?.response?.data?.errors || error.message || 'Erro ao iniciar assinatura.' });
        }
    }

    static async checkFirstPayment(req: Request, res: Response) {
        const { assinaturaId } = req.params;
        if (!assinaturaId) {
            return res.status(400).json({ error: 'assinaturaId é obrigatório.' });
        }
        try {
            const { verificarPrimeiroPagamentoAssinatura } = await import('../services/asaas.service.js');
            const resultado = await verificarPrimeiroPagamentoAssinatura(assinaturaId);
            return res.status(200).json(resultado);
        } catch (error: any) {
            return res.status(500).json({ error: error?.response?.data?.errors || error.message || 'Erro ao verificar pagamento.' });
        }
    }
}