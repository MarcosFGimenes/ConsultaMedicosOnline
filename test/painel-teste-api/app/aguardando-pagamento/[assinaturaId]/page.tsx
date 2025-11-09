"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type BillingType = "BOLETO" | "PIX" | "CREDIT_CARD";

type Dados = {
  billingType?: BillingType;
  ciclo?: string;
  [key: string]: unknown;
};

type Draft = {
  createdAt: number;
  assinaturaId: string;
  clienteId?: string;
  plano?: { id?: string; tipo?: string; preco?: number; periodicidade?: string };
  dados?: Dados;
};

export default function AguardandoPagamentoPage() {
  const params = useParams();
  const router = useRouter();
  const assinaturaId = Array.isArray(params?.assinaturaId) ? params.assinaturaId[0] : params?.assinaturaId;
  const [status, setStatus] = useState<{ pago: boolean; pagamento?: unknown } | null>(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [polling, setPolling] = useState(true);

  // Carrega draft salvo
  useEffect(() => {
    try {
      const raw = localStorage.getItem("assinaturaDraft");
      if (raw) setDraft(JSON.parse(raw));
    } catch {}
  }, []);

  // Polling do status de pagamento
  useEffect(() => {
    if (!assinaturaId || !polling) return;
    const fetchStatus = async () => {
      try {
        const resp = await fetch(`http://localhost:3000/api/subscription/check-payment/${assinaturaId}`);
        const data = await resp.json();
        if (resp.ok) {
          setStatus(data);
          if (data.pago) {
            setPolling(false);
          }
        } else {
          setErro(data.error || "Erro ao verificar pagamento.");
        }
      } catch {
        setErro("Falha de conexão ao verificar pagamento.");
      } finally {
        setLoading(false);
      }
    };
    const interval = setInterval(fetchStatus, 7000); // a cada 7s
    fetchStatus(); // chamada inicial
    return () => clearInterval(interval);
  }, [assinaturaId, polling]);

  const billingType = draft?.dados?.billingType;

  const instrucoes = () => {
    if (!billingType) return null;
    if (billingType === "BOLETO") {
      return "Seu boleto está sendo gerado. Assim que o pagamento for confirmado, sua conta será ativada automaticamente.";
    }
    if (billingType === "PIX") {
      return "Use o QR Code ou copia e cola gerado para pagar via PIX. A confirmação costuma ser imediata.";
    }
    if (billingType === "CREDIT_CARD") {
      return "Transação em processamento no cartão. Pode levar alguns instantes para confirmar.";
    }
    return null;
  };

  const finalizar = () => {
    // Limpa draft e segue para próxima etapa (ex: dashboard placeholder)
    try { localStorage.removeItem("assinaturaDraft"); } catch {}
    router.push("/dashboard"); // futura rota protegida
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black py-10 px-4">
      <div className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-md w-full max-w-xl">
        <h1 className="text-2xl font-bold mb-2">Aguardando Pagamento</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 mb-4">Assinatura ID: {assinaturaId}</p>
        {draft?.plano && (
          <div className="mb-6 p-4 border rounded bg-zinc-50 dark:bg-zinc-800">
            <div className="font-semibold">Plano: {draft.plano.tipo}</div>
            <div className="text-xs text-zinc-600 dark:text-zinc-400">{draft.plano.periodicidade}</div>
            <div className="mt-1 text-blue-600 dark:text-blue-400 font-bold">R$ {draft.plano.preco?.toFixed(2)}</div>
            <div className="text-xs mt-2">Forma de Pagamento: {billingType}</div>
            <div className="text-xs">Ciclo: {draft.dados?.ciclo}</div>
          </div>
        )}
        {loading && <div className="text-sm">Verificando status do pagamento...</div>}
        {erro && <div className="text-sm text-red-600 dark:text-red-400 mb-4">{erro}</div>}
        {status && !status.pago && (
          <div className="text-sm mb-4">
            <div className="font-medium mb-2">Status: pagamento pendente</div>
            <p className="text-zinc-700 dark:text-zinc-200">{instrucoes()}</p>
          </div>
        )}
        {status?.pago && (
          <div className="text-sm mb-6">
            <div className="font-medium text-green-600 dark:text-green-400 mb-2">Pagamento confirmado!</div>
            <p className="text-zinc-700 dark:text-zinc-200">Estamos ativando sua conta. Você já pode prosseguir.</p>
          </div>
        )}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 rounded border text-sm"
          >
            Voltar
          </button>
          {status?.pago ? (
            <button
              type="button"
              onClick={finalizar}
              className="px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white text-sm"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="px-4 py-2 rounded bg-zinc-400 text-white text-sm opacity-70 cursor-not-allowed"
            >
              Aguardando...
            </button>
          )}
        </div>
        <div className="mt-6 text-xs text-center text-zinc-500 dark:text-zinc-400">
          A página atualiza automaticamente. Última verificação não exibida explicitamente.
        </div>
      </div>
    </div>
  );
}
