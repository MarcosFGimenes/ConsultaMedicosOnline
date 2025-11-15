import type { Request, Response } from 'express';
import axios from 'axios';
import admin from 'firebase-admin';

const ASAAS_API_URL = process.env.ASAAS_BASE_URL || 'https://sandbox.asaas.com/api/v3';
const ASAAS_API_KEY = process.env.ASAAS_API_KEY;

export class FaturasController {
  static async listarDoAutenticado(req: Request, res: Response) {
    try {
      // Fonte primária: claim cpf no token
      let cpf = req.user?.cpf as string | undefined;
      // Fallback: query param ?cpf= ou header x-user-cpf
      if (!cpf && typeof req.query.cpf === 'string') cpf = req.query.cpf.trim();
      const headerCpf = req.headers['x-user-cpf'];
      if (!cpf && typeof headerCpf === 'string') cpf = headerCpf.trim();
      // Fallback: buscar no Firestore pelo email do token
      if (!cpf && req.user?.email) {
        const snap = await admin.firestore().collection('usuarios').where('email', '==', req.user.email).limit(1).get();
        if (!snap.empty) {
          const first = snap.docs[0];
          if (first) {
            cpf = (first.data().cpf as string) || first.id;
          }
        }
      }
      if (!cpf) return res.status(400).json({ error: 'CPF não encontrado (token sem claim, parâmetro ou registro).' });
      if (!ASAAS_API_KEY) return res.status(500).json({ error: 'Chave da API Asaas não configurada.' });

      // 1) Localiza o cliente Asaas pelo CPF
      const clientesResp = await axios.get(`${ASAAS_API_URL}/customers`, {
        params: { cpfCnpj: cpf },
        headers: { access_token: ASAAS_API_KEY },
      });
      const clientes = clientesResp.data?.data || [];
      if (!clientes.length) {
        return res.status(404).json({ error: 'Cliente não encontrado no Asaas para este CPF.' });
      }
      const clienteId: string = clientes[0].id;

      // 2) Lista faturas (payments) do cliente
      const paymentsResp = await axios.get(`${ASAAS_API_URL}/payments`, {
        params: { customer: clienteId },
        headers: { access_token: ASAAS_API_KEY },
      });
      const payments: any[] = paymentsResp.data?.data || [];

      // 3) Mapeia campos relevantes
      const faturas = payments.map((p: any) => ({
        id: p.id,
        status: p.status,
        value: p.value,
        dueDate: p.dueDate,
        paymentDate: p.paymentDate || p.receivedDate || null,
        billingType: p.billingType,
        bankSlipUrl: p.bankSlipUrl || null,
        invoiceUrl: p.invoiceUrl || null,
        description: p.description || null,
      }));

      return res.status(200).json({ customerId: clienteId, total: faturas.length, faturas });
    } catch (error: any) {
      const status = error?.response?.status;
      const data = error?.response?.data;
      return res.status(500).json({ error: error?.message || 'Erro ao consultar faturas no Asaas.', status, detail: data });
    }
  }
}
