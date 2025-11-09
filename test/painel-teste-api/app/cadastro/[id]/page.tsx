"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Plano = {
  id: string;
  tipo: string;
  periodicidade: string;
  descricao: string;
  especialidades: string[];
  preco: number;
  criadoEm?: string;
};

export default function CadastroPage() {
  const params = useParams();
  const router = useRouter();
  const planoId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const [plano, setPlano] = useState<Plano | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState({
    nome: "",
    email: "",
    cpf: "",
    birthday: "",
    zipCode: "",
    endereco: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
    country: "BR",
    telefone: "",
  });
  const [enviando, setEnviando] = useState(false);
  const [mensagem, setMensagem] = useState("");

  useEffect(() => {
    if (!planoId) return;
    fetch(`http://localhost:3000/api/planos`)
      .then((res) => res.json())
      .then((planos) => {
        const p = planos.find((pl: Plano) => pl.id === planoId);
        if (p) setPlano(p);
        else setErro("Plano não encontrado.");
      })
      .catch(() => setErro("Erro ao buscar plano."))
      .finally(() => setLoading(false));
  }, [planoId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setMensagem("");
    try {
      const body = {
        ...form,
        valor: plano?.preco,
      };
      const resp = await fetch("http://localhost:3000/api/subscription/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await resp.json();
      if (resp.ok) {
        setMensagem("Assinatura criada com sucesso! Verifique seu e-mail.");
      } else {
        setMensagem(data.error || "Erro ao criar assinatura.");
      }
    } catch {
      setMensagem("Erro de conexão com o servidor.");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Carregando plano...</div>;
  if (erro) return <div className="p-8 text-center text-red-500">{erro}</div>;
  if (!plano) return null;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black py-8">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-2">Cadastro - {plano.tipo}</h2>
        <p className="mb-4 text-zinc-700 dark:text-zinc-200">{plano.descricao}</p>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <input name="nome" placeholder="Nome completo" value={form.nome} onChange={handleChange} required className="border rounded px-4 py-2" />
          <input name="email" placeholder="E-mail" value={form.email} onChange={handleChange} required className="border rounded px-4 py-2" type="email" />
          <input name="cpf" placeholder="CPF" value={form.cpf} onChange={handleChange} required className="border rounded px-4 py-2" maxLength={14} />
          <input name="birthday" placeholder="Data de nascimento (YYYY-MM-DD)" value={form.birthday} onChange={handleChange} required className="border rounded px-4 py-2" type="date" />
          <input name="telefone" placeholder="Telefone" value={form.telefone} onChange={handleChange} required className="border rounded px-4 py-2" />
          <input name="zipCode" placeholder="CEP" value={form.zipCode} onChange={handleChange} required className="border rounded px-4 py-2" />
          <input name="endereco" placeholder="Endereço" value={form.endereco} onChange={handleChange} required className="border rounded px-4 py-2" />
          <input name="numero" placeholder="Número" value={form.numero} onChange={handleChange} required className="border rounded px-4 py-2" />
          <input name="bairro" placeholder="Bairro" value={form.bairro} onChange={handleChange} required className="border rounded px-4 py-2" />
          <input name="cidade" placeholder="Cidade" value={form.cidade} onChange={handleChange} required className="border rounded px-4 py-2" />
          <input name="estado" placeholder="Estado" value={form.estado} onChange={handleChange} required className="border rounded px-4 py-2" />
          <input name="country" placeholder="País" value={form.country} onChange={handleChange} required className="border rounded px-4 py-2" />
          <div className="font-bold text-blue-600 dark:text-blue-400 mt-2">Valor: R$ {plano.preco.toFixed(2)}</div>
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded py-2 font-semibold mt-2" disabled={enviando}>
            {enviando ? "Enviando..." : "Finalizar Cadastro"}
          </button>
          {mensagem && <div className="mt-2 text-center text-sm text-zinc-700 dark:text-zinc-200">{mensagem}</div>}
        </form>
      </div>
    </div>
  );
}
