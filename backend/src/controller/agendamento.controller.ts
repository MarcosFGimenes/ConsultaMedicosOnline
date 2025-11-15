import type { Request, Response } from 'express';
import { buscarBeneficiarioRapidocPorCpf, agendarConsultaRapidoc, lerAgendamentoRapidoc, cancelarAgendamentoRapidoc, listarRapidocEspecialidades, obterDetalhesPlanoRapidoc, atualizarBeneficiarioRapidoc, atualizarPlanoRapidoc } from '../services/rapidoc.service.js';

export class AgendamentoController {
  static async criar(req: Request, res: Response) {
    try {
      const { cpf, date, from, to, specialtyUuid, notes, durationMinutes } = req.body || {};
            // Validar specialtyUuid contra lista disponível
            let especialidades: any[] = [];
            try {
              especialidades = await listarRapidocEspecialidades();
            } catch {}
            if (especialidades.length) {
              const exists = especialidades.some((s: any) => s?.uuid === specialtyUuid || s?.id === specialtyUuid);
              if (!exists) {
                return res.status(422).json({
                  error: 'Especialidade não disponível para o cliente.',
                  specialtyUuid,
                  availableSpecialties: especialidades.map((s: any) => ({ uuid: s.uuid, name: s.name }))
                });
              }
            }
      if (!cpf || !date || (!from && !to && !req.body.time)) {
        return res.status(400).json({ error: 'Campos obrigatórios: cpf, date (yyyy-MM-dd), from(HH:mm) e to(HH:mm) ou time + durationMinutes.' });
      }

      // Derivar from/to se vier time + durationMinutes
      let finalFrom = from;
      let finalTo = to;
      if (!finalFrom && req.body.time) finalFrom = req.body.time;
      if (!finalTo && finalFrom && durationMinutes && Number(durationMinutes) > 0) {
        const [h, m] = finalFrom.split(':');
        const startDate = new Date(0, 0, 0, Number(h), Number(m));
        const endDate = new Date(startDate.getTime() + Number(durationMinutes) * 60000);
        const eh = String(endDate.getHours()).padStart(2, '0');
        const em = String(endDate.getMinutes()).padStart(2, '0');
        finalTo = `${eh}:${em}`;
      }
      if (!finalFrom || !finalTo) {
        return res.status(400).json({ error: 'Informe from e to ou time + durationMinutes.' });
      }

      // Converter data para dd/MM/yyyy
      let dateFormatted = date;
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        const [Y, M, D] = date.split('-');
        dateFormatted = `${D}/${M}/${Y}`;
      }

      const beneficiarioResp = await buscarBeneficiarioRapidocPorCpf(cpf);
      const beneficiario = beneficiarioResp?.beneficiary;
      if (!beneficiario || !beneficiario.uuid) {
        return res.status(404).json({ error: 'Beneficiário não encontrado no Rapidoc para o CPF informado.' });
      }

      // Verificar especialidades do beneficiário (arrays possíveis)
      const benefSpecialtiesRaw: any[] = Array.isArray(beneficiario.specialties) ? beneficiario.specialties : [];
      const availableSpecialtiesRaw: any[] = Array.isArray(beneficiario.availableSpecialties) ? beneficiario.availableSpecialties : [];
      let planSpecialtiesRaw: any[] = [];
      if (Array.isArray(beneficiario.plans) && beneficiario.plans.length) {
        for (const p of beneficiario.plans) {
          if (Array.isArray(p?.specialties) && p.specialties.length) {
            planSpecialtiesRaw.push(...p.specialties);
          } else if (p?.uuid) {
            try {
              const detalhesPlano = await obterDetalhesPlanoRapidoc(p.uuid);
              if (Array.isArray(detalhesPlano?.specialties)) {
                planSpecialtiesRaw.push(...detalhesPlano.specialties);
              }
            } catch {}
          }
        }
      }
      const allBenefSpecialties = [...benefSpecialtiesRaw, ...availableSpecialtiesRaw, ...planSpecialtiesRaw];
      const normalizedBenefSpecialties = allBenefSpecialties.map(s => ({
        uuid: s?.uuid || s?.id,
        name: s?.name || s?.description || s?.title
      })).filter(s => s.uuid);
      if (normalizedBenefSpecialties.length) {
        if (!specialtyUuid) {
          return res.status(400).json({
            error: 'specialtyUuid é obrigatório para beneficiário que possui especialidades associadas.',
            beneficiaryUuid: beneficiario.uuid,
            availableBeneficiarySpecialties: normalizedBenefSpecialties
          });
        }
        const hasSpecialty = normalizedBenefSpecialties.some(s => s.uuid === specialtyUuid);
        if (!hasSpecialty) {
          return res.status(422).json({
            error: 'Especialidade não associada ao beneficiário/plano.',
            specialtyUuid,
            beneficiaryUuid: beneficiario.uuid,
            availableBeneficiarySpecialties: normalizedBenefSpecialties
          });
        }
      }
      // Fallback desativado: não associamos especialidade automaticamente via código
      const semEspecialidadesAssociadas = normalizedBenefSpecialties.length === 0;
      if (semEspecialidadesAssociadas) {
        if (!specialtyUuid) {
          let globais: any[] = [];
          try { globais = await listarRapidocEspecialidades(); } catch {}
          const suggestions = (globais || [])
            .map((s: any) => ({ uuid: s?.uuid || s?.id, name: (s?.name || s?.description || s?.title || '').toString() }))
            .filter((s: any) => s.uuid);
          return res.status(422).json({
            error: 'Beneficiário não possui especialidades associadas e o fallback de generalista está desativado. Informe specialtyUuid ou associe via Rapidoc.',
            beneficiaryUuid: beneficiario.uuid,
            suggestions
          });
        }
        // Se specialtyUuid foi informado, seguimos adiante e deixamos a API validar.
      }

      const bodyRapidoc: Record<string, any> = {
        beneficiary: { uuid: beneficiario.uuid, cpf },
        specialty: { uuid: specialtyUuid },
        detail: { date: dateFormatted, from: finalFrom, to: finalTo }
      };
      // Incluir plano se houver
      if (Array.isArray(beneficiario.plans) && beneficiario.plans.length && beneficiario.plans[0]?.uuid) {
        bodyRapidoc.plan = { uuid: beneficiario.plans[0].uuid };
      }
      // Incluir paymentType / serviceType se presentes
      if (beneficiario.paymentType) bodyRapidoc.paymentType = beneficiario.paymentType;
      if (beneficiario.serviceType) bodyRapidoc.serviceType = beneficiario.serviceType;
      if (notes) bodyRapidoc.notes = notes;

      try {
        const resp = await agendarConsultaRapidoc(bodyRapidoc);
        if (!resp || resp.success === false) {
          return res.status(400).json({ error: resp?.message || 'Falha ao agendar no Rapidoc.', detail: resp });
        }
        return res.status(201).json(resp);
      } catch (e: any) {
        return res.status(400).json({
          error: 'Erro ao agendar no Rapidoc.',
          status: e?.response?.status,
          detail: e?.response?.data,
          sent: bodyRapidoc,
          beneficiarioDebug: beneficiarioResp
        });
      }
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Erro ao agendar consulta.' });
    }
  }

  static async ler(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      if (!uuid) return res.status(400).json({ error: 'uuid é obrigatório.' });
      const data = await lerAgendamentoRapidoc(uuid);
      return res.status(200).json(data);
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Erro ao ler agendamento.' });
    }
  }

  static async cancelar(req: Request, res: Response) {
    try {
      const { uuid } = req.params;
      if (!uuid) return res.status(400).json({ error: 'uuid é obrigatório.' });
      const resp = await cancelarAgendamentoRapidoc(uuid);
      if (resp.status === 204) return res.status(204).send();
      return res.status(200).json({ cancelled: true, status: resp.status });
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 404) return res.status(404).json({ error: 'Agendamento não encontrado.' });
      return res.status(500).json({ error: error?.message || 'Erro ao cancelar agendamento.' });
    }
  }
}
