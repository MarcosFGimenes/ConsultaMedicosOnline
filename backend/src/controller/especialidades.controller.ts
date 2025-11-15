import type { Request, Response } from 'express';
import { listarRapidocEspecialidades } from '../services/rapidoc.service.js';

export class EspecialidadesController {
  static async listarGlobais(_req: Request, res: Response) {
    try {
      const data = await listarRapidocEspecialidades();
      const items = Array.isArray(data) ? data : [];
      return res.status(200).json({ count: items.length, specialties: items.map((s: any) => ({ uuid: s.uuid || s.id, name: s.name || s.description || s.title })) });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Erro ao listar especialidades globais.' });
    }
  }
}
