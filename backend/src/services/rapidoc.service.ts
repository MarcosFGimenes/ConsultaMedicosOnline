import axios from 'axios';

const RAPIDOC_BASE_URL = process.env.RAPIDOC_BASE_URL;
const RAPIDOC_TOKEN = process.env.RAPIDOC_TOKEN;
const RAPIDOC_CLIENT_ID = process.env.RAPIDOC_CLIENT_ID;

export async function cadastrarBeneficiarioRapidoc({ nome, email, cpf, birthday, phone, zipCode, paymentType, serviceType, holder, general }: {
  nome: string,
  email: string,
  cpf: string,
  birthday: string,
  phone?: string,
  zipCode?: string,
  paymentType?: string,
  serviceType?: string,
  holder?: string,
  general?: string
}) {
  if (!RAPIDOC_BASE_URL || !RAPIDOC_TOKEN || !RAPIDOC_CLIENT_ID) throw new Error('Configuração Rapidoc ausente');
  const body = [{
    name: nome,
    email,
    cpf,
    birthday,
    phone,
    zipCode,
    paymentType,
    serviceType,
    holder,
    general
  }];
  const resp = await axios.post(RAPIDOC_BASE_URL, body, {
    headers: {
      Authorization: `Bearer ${RAPIDOC_TOKEN}`,
      clientId: RAPIDOC_CLIENT_ID,
      'Content-Type': 'application/vnd.rapidoc.tema-v2+json'
    }
  });
  return resp.data;
}
