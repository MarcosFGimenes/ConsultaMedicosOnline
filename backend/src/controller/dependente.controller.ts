import { cadastrarBeneficiarioRapidoc, atualizarBeneficiarioRapidoc } from '../services/rapidoc.service.js';
import admin from 'firebase-admin';
import type { Request, Response } from 'express';
import axios from 'axios';

export class DependenteController {
  static async adicionar(req: Request, res: Response) {
    try {
      const { nome, cpf, birthDate, parentesco, holder, email, phone, zipCode, paymentType, serviceType } = req.body;
      console.log('[DependenteController.adicionar] Início', { hasNome: !!nome, hasCpf: !!cpf, hasBirthDate: !!birthDate, hasHolder: !!holder });
      if (!nome || !cpf || !birthDate || !holder) {
        return res.status(400).json({ error: 'Campos obrigatórios não informados.' });
      }

      // 1. Cria no Rapidoc
      console.log('[DependenteController.adicionar] Chamando Rapidoc cadastrarBeneficiario');
      const rapidocResp = await cadastrarBeneficiarioRapidoc({
        nome,
        cpf,
        birthday: birthDate,
        email,
        phone,
        zipCode,
        paymentType,
        serviceType,
        holder
      });
      console.log('[DependenteController.adicionar] Resposta Rapidoc', { success: rapidocResp?.success, uuid: rapidocResp?.uuid });
      if (!rapidocResp || rapidocResp.success === false) {
        return res.status(400).json({ error: rapidocResp?.message || 'Erro ao criar dependente no Rapidoc.' });
      }

      // 2. Salva no Firestore
      const docData: any = {
        nome,
        cpf,
        birthDate,
        parentesco,
        holder,
        email,
        phone,
        zipCode,
        paymentType,
        serviceType,
        createdAt: new Date(),
      };
      if (rapidocResp.uuid) {
        docData.rapidocUuid = rapidocResp.uuid;
      }
      const createdRef = await admin.firestore().collection('beneficiarios').add(docData);
      console.log('[DependenteController.adicionar] Documento criado', { docId: createdRef.id, hasRapidocUuid: !!docData.rapidocUuid });

      // 3. Retorna lista atualizada
      const snapshot = await admin.firestore().collection('beneficiarios').where('holder', '==', holder).get();
      const dependentes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(201).json({ dependentes });
    } catch (error: any) {
      console.error('[DependenteController.adicionar] Erro inesperado', { message: error?.message });
      return res.status(500).json({ error: error.message || 'Erro ao adicionar dependente.' });
    }
  }

  static async editar(req: Request, res: Response) {
    try {
      const cpfParam = (req.params as any).cpf || (req.params as any).id;
      console.log('[DependenteController.editar] Início', { cpfParam, params: req.params });
      if (!cpfParam) {
        return res.status(400).json({ error: 'CPF do dependente não informado.' });
      }

      const { nome, birthDate, parentesco, holder, email, phone, zipCode, address, city, state, paymentType, serviceType, cpf } = req.body;
      console.log('[DependenteController.editar] Body recebido (presença de campos)', {
        nome: !!nome,
        birthDate: !!birthDate,
        parentesco: !!parentesco,
        holder: !!holder,
        email: !!email,
        phone: !!phone,
        zipCode: !!zipCode,
        address: !!address,
        city: !!city,
        state: !!state,
        paymentType: !!paymentType,
        serviceType: !!serviceType,
        cpf: !!cpf,
      });
      if (!nome && !birthDate && !email && !phone && !zipCode && !address && !city && !state && !paymentType && !serviceType && !cpf) {
        return res.status(400).json({ error: 'Nenhum campo para atualizar informado.' });
      }

      // 1. Busca o dependente no Firestore pelo CPF
      console.log('[DependenteController.editar] Buscando dependente no Firestore por CPF');
      const snapshot = await admin.firestore().collection('beneficiarios').where('cpf', '==', cpfParam).limit(1).get();
      console.log('[DependenteController.editar] Firestore resultado', { count: snapshot.size });
      if (snapshot.empty) {
        return res.status(404).json({ error: 'Dependente não encontrado.' });
      }
      const doc = snapshot.docs[0];
      if (!doc) {
        return res.status(404).json({ error: 'Dependente não encontrado.' });
      }
      const docRef = doc.ref;
      const dependente = doc.data();
      console.log('[DependenteController.editar] Documento encontrado', { docId: docRef.id, hasRapidocUuid: !!dependente?.rapidocUuid });

      // 2. Obter rapidocUuid se estiver ausente
      let rapidocUuid: string | undefined = dependente?.rapidocUuid as string | undefined;
      if (!rapidocUuid) {
        console.log('[DependenteController.editar] Buscando UUID no Rapidoc por CPF');
        try {
          const { RAPIDOC_BASE_URL, RAPIDOC_TOKEN, RAPIDOC_CLIENT_ID } = process.env as Record<string, string | undefined>;
          const urlCpf = `${RAPIDOC_BASE_URL}/tema/api/beneficiaries/${cpfParam}`;
          const resp = await axios.get(urlCpf, {
            headers: {
              Authorization: `Bearer ${RAPIDOC_TOKEN}`,
              clientId: RAPIDOC_CLIENT_ID as string,
              'Content-Type': 'application/vnd.rapidoc.tema-v2+json'
            }
          });
          if (resp.data && resp.data.success && resp.data.beneficiary && resp.data.beneficiary.uuid) {
            rapidocUuid = resp.data.beneficiary.uuid;
            await docRef.update({ rapidocUuid });
            console.log('[DependenteController.editar] UUID do Rapidoc obtido por CPF', { rapidocUuid });
          } else {
            console.warn('[DependenteController.editar] Falha ao obter UUID por CPF no Rapidoc', { data: resp.data });
            return res.status(400).json({ error: 'Dependente não possui rapidocUuid e não foi possível obter do Rapidoc.' });
          }
        } catch (err: any) {
          console.error('[DependenteController.editar] Erro na chamada Rapidoc por CPF', { status: err?.response?.status, data: err?.response?.data });
          return res.status(400).json({ error: 'Dependente não possui rapidocUuid e não foi possível obter do Rapidoc.' });
        }
      }

      // 3. Busca os dados atuais do beneficiário no Rapidoc
      const { RAPIDOC_BASE_URL, RAPIDOC_TOKEN, RAPIDOC_CLIENT_ID } = process.env as Record<string, string | undefined>;
      let atualRapidoc: any;
      try {
        const urlUuid = `${RAPIDOC_BASE_URL}/tema/api/beneficiaries/${rapidocUuid}`;
        console.log('[DependenteController.editar] Buscando beneficiário atual no Rapidoc por UUID', { rapidocUuid });
        const respUuid = await axios.get(urlUuid, {
          headers: {
            Authorization: `Bearer ${RAPIDOC_TOKEN}`,
            clientId: RAPIDOC_CLIENT_ID as string,
            'Content-Type': 'application/vnd.rapidoc.tema-v2+json'
          }
        });
        if (respUuid.data && respUuid.data.success && respUuid.data.beneficiary) {
          atualRapidoc = respUuid.data.beneficiary;
          console.log('[DependenteController.editar] Beneficiário atual (via UUID) obtido');
        }
      } catch (e: any) {
        console.warn('[DependenteController.editar] Falha no GET por UUID, tentando fallback CPF', { status: e?.response?.status });
      }

      // Fallback: tentar por CPF se não veio
      if (!atualRapidoc) {
        try {
          console.log('[DependenteController.editar] Buscando beneficiário atual no Rapidoc por CPF (fallback)');
          const urlCpf = `${RAPIDOC_BASE_URL}/tema/api/beneficiaries/${cpfParam}`;
          const respCpf = await axios.get(urlCpf, {
            headers: {
              Authorization: `Bearer ${RAPIDOC_TOKEN}`,
              clientId: RAPIDOC_CLIENT_ID as string,
              'Content-Type': 'application/vnd.rapidoc.tema-v2+json'
            }
          });
          if (respCpf.data && respCpf.data.success && respCpf.data.beneficiary) {
            atualRapidoc = respCpf.data.beneficiary;
            console.log('[DependenteController.editar] Beneficiário atual (via CPF) obtido');
            // Se uuid diferente, atualiza
            if (!rapidocUuid && atualRapidoc.uuid) {
              rapidocUuid = atualRapidoc.uuid;
              await docRef.update({ rapidocUuid });
            }
          }
        } catch (e: any) {
          console.error('[DependenteController.editar] Erro no GET por CPF (fallback)', { status: e?.response?.status, data: e?.response?.data });
          return res.status(400).json({ error: 'Não foi possível obter dados atuais do Rapidoc (fallback CPF).', detail: e?.response?.data || null });
        }
      }
      if (!atualRapidoc) {
        console.error('[DependenteController.editar] Beneficiário atual não encontrado no Rapidoc após tentativas');
        return res.status(400).json({ error: 'Não foi possível obter dados atuais do Rapidoc.' });
      }

      // 4. Monta o body do Rapidoc somente com campos enviados (evita erros de campos imutáveis/duplicados)
      const bodyRapidoc: any = { uuid: rapidocUuid };
      if (typeof nome === 'string' && nome.trim()) bodyRapidoc.name = nome.trim();
      if (typeof birthDate === 'string' && birthDate.trim()) bodyRapidoc.birthday = birthDate.trim();
      if (typeof email === 'string' && email.trim() && email.trim() !== (atualRapidoc.email || '').trim()) bodyRapidoc.email = email.trim();
      if (typeof phone === 'string' && phone.trim()) bodyRapidoc.phone = phone.trim();
      if (typeof zipCode === 'string' && zipCode.trim()) bodyRapidoc.zipCode = zipCode.trim();
      if (typeof address === 'string' && address.trim()) bodyRapidoc.address = address.trim();
      if (typeof city === 'string' && city.trim()) bodyRapidoc.city = city.trim();
      if (typeof state === 'string' && state.trim()) bodyRapidoc.state = state.trim();
      if (typeof paymentType === 'string' && paymentType.trim()) bodyRapidoc.paymentType = paymentType.trim();
      if (typeof serviceType === 'string' && serviceType.trim()) bodyRapidoc.serviceType = serviceType.trim();
      if (typeof cpf === 'string' && cpf.trim()) bodyRapidoc.cpf = cpf.trim();
      console.log('[DependenteController.editar] Body preparado para Rapidoc (campos presentes)', Object.fromEntries(Object.entries(bodyRapidoc).map(([k, v]) => [k, v !== undefined && v !== null])));

      // 5. Atualiza no Rapidoc
      console.log('[DependenteController.editar] Enviando atualização ao Rapidoc', { rapidocUuid });
      try {
        const rapidocResp = await atualizarBeneficiarioRapidoc(rapidocUuid as string, bodyRapidoc);
        if (!rapidocResp || rapidocResp.success === false) {
          console.error('[DependenteController.editar] Resposta de erro do Rapidoc', { response: rapidocResp });
          return res.status(400).json({ error: rapidocResp?.message || 'Erro ao atualizar dependente no Rapidoc.', detail: rapidocResp });
        }
      } catch (e: any) {
        const status = e?.response?.status;
        const data = e?.response?.data;
        console.error('[DependenteController.editar] Erro na atualização do Rapidoc', { status, data });
        // Retry sem email se o erro for de email já em uso
        const emailInUse = Array.isArray(data?.errors) && data.errors.some((er: any) => typeof er?.description === 'string' && /email address already in use/i.test(er.description));
        if (emailInUse && bodyRapidoc.email) {
          console.warn('[DependenteController.editar] Tentando novamente sem email por conflito');
          const retryBody = { ...bodyRapidoc };
          delete (retryBody as any).email;
          try {
            const rapidocResp2 = await atualizarBeneficiarioRapidoc(rapidocUuid as string, retryBody);
            if (!rapidocResp2 || rapidocResp2.success === false) {
              console.error('[DependenteController.editar] Resposta de erro do Rapidoc (retry)', { response: rapidocResp2 });
              return res.status(400).json({ error: rapidocResp2?.message || 'Erro ao atualizar dependente no Rapidoc.', detail: rapidocResp2, status });
            }
          } catch (e2: any) {
            const status2 = e2?.response?.status;
            const data2 = e2?.response?.data;
            console.error('[DependenteController.editar] Erro na atualização do Rapidoc (retry)', { status: status2, data: data2 });
            return res.status(400).json({ error: 'Erro ao atualizar dependente no Rapidoc.', detail: data2 || data, status: status2 || status });
          }
        } else {
          return res.status(400).json({ error: 'Erro ao atualizar dependente no Rapidoc.', detail: data, status });
        }
      }
      console.log('[DependenteController.editar] Rapidoc atualizado com sucesso');

      // 6. Atualiza no Firestore
      const holderFinal = holder || dependente.holder;
      console.log('[DependenteController.editar] Atualizando Firestore', { docId: docRef.id });
      const updatedFirestore: any = {
        nome: nome ?? dependente.nome,
        cpf: (typeof cpf === 'string' && cpf.trim()) ? cpf.trim() : (dependente.cpf ?? cpfParam),
        birthDate: birthDate ?? dependente.birthDate,
        parentesco: parentesco ?? dependente.parentesco,
        holder: holderFinal,
        email: email ?? dependente.email,
        phone: phone ?? dependente.phone,
        zipCode: zipCode ?? dependente.zipCode,
        address: address ?? dependente.address,
        city: city ?? dependente.city,
        state: state ?? dependente.state,
        paymentType: paymentType ?? dependente.paymentType,
        serviceType: serviceType ?? dependente.serviceType,
        rapidocUuid,
        updatedAt: new Date(),
      };
      await docRef.update(updatedFirestore);

      // 7. Retorna lista atualizada
      console.log('[DependenteController.editar] Buscando lista de dependentes por holder', { holder: holderFinal });
      const dependentesSnapshot = await admin.firestore().collection('beneficiarios').where('holder', '==', holderFinal).get();
      const dependentes = dependentesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('[DependenteController.editar] Lista de dependentes retornada', { count: dependentes.length });
      return res.status(200).json({ dependentes });
    } catch (error: any) {
      console.error('[DependenteController.editar] Erro inesperado', { message: error?.message, status: error?.response?.status, data: error?.response?.data });
      return res.status(500).json({ error: error.message || 'Erro ao editar dependente.' });
    }
  }

  static async listarPorTitular(req: Request, res: Response) {
    try {
      const { cpf } = req.params;
      const snapshot = await admin.firestore().collection('beneficiarios').where('holder', '==', cpf).get();
      const dependentes = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ dependentes });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Erro ao listar dependentes.' });
    }
  }
}