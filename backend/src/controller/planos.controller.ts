import type { Request, Response } from 'express';
import { obterDetalhesPlanoRapidoc, atualizarPlanoRapidoc } from '../services/rapidoc.service.js';

export class PlanosController {
    static async listarPlanos(_req: Request, res: Response) {
        try {
            const { getFirestore } = await import('firebase-admin/firestore');
            const { firebaseApp } = await import('../config/firebase.js');
            const db = getFirestore(firebaseApp);
            const snapshot = await db.collection('planos').get();
            const planos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            return res.status(200).json(planos);
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Erro ao listar planos.' });
        }
    }

    // GET /api/planos/rapidoc - Lista planos Rapidoc (direto da API)
    static async listarPlanosRapidoc(_req: Request, res: Response) {
        try {
            const { listarRapidocPlanos } = await import('../services/rapidoc.service.js');
            const planos = await listarRapidocPlanos();
            return res.status(200).json(planos);
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Erro ao consultar planos Rapidoc.' });
        }
    }

    // PUT /api/planos/rapidoc/:uuid/especialidades - adiciona/atualiza specialties do plano Rapidoc
    static async atualizarEspecialidadesPlanoRapidoc(req: Request, res: Response) {
        try {
            const { uuid } = req.params;
            const { specialtyUuid, specialtyUuids } = req.body || {};
            if (!uuid) return res.status(400).json({ error: 'uuid do plano é obrigatório.' });

            let uuidsRaw: any = [];
            if (Array.isArray(specialtyUuids)) uuidsRaw = specialtyUuids;
            else if (Array.isArray(specialtyUuid)) uuidsRaw = specialtyUuid;
            else if (typeof specialtyUuid === 'string') uuidsRaw = [specialtyUuid];
            const uuids: string[] = uuidsRaw.filter((u: any) => typeof u === 'string' && u.trim()).map((u: string) => u.trim());
            if (!uuids.length) return res.status(400).json({ error: 'Informe specialtyUuid ou specialtyUuids.' });

            const detalhes = await obterDetalhesPlanoRapidoc(uuid);
            if (!detalhes || !detalhes.uuid) return res.status(404).json({ error: 'Plano Rapidoc não encontrado.' });

            const specialties = uuids.map(u => ({ uuid: u }));
            const payload = {
                name: detalhes.name,
                description: detalhes.description,
                serviceType: detalhes.serviceType,
                specialties
            };
            let resp: any;
            try {
                resp = await atualizarPlanoRapidoc(uuid, payload);
            } catch (e: any) {
                return res.status(400).json({
                    error: 'Falha ao atualizar specialties do plano.',
                    status: e?.response?.status,
                    detail: e?.response?.data,
                    sent: payload
                });
            }
            return res.status(200).json({ success: true, planUuid: uuid, applied: specialties, result: resp });
        } catch (error: any) {
            return res.status(500).json({ error: error.message || 'Erro interno ao atualizar plano Rapidoc.' });
        }
    }
}