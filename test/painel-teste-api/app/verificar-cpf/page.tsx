"use client";

import { useState } from "react";

export default function VerificarCpfPage() {
  const [cpf, setCpf] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerificar = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:3000/api/first-access/validate-cpf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf: cpf.replace(/\D/g, "") }),
      });
      const data = await response.json();
      if (response.ok) {
        setMensagem(data.message || "CPF verificado com sucesso!");
      } else {
        setMensagem(data.error || "Erro ao verificar CPF.");
      }
    } catch {
      setMensagem("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 dark:bg-black">
      <form onSubmit={handleVerificar} className="bg-white dark:bg-zinc-900 p-8 rounded-xl shadow-md flex flex-col gap-4 w-full max-w-sm">
        <h2 className="text-xl font-bold mb-2">Verificar CPF</h2>
        <input
          type="text"
          placeholder="Digite seu CPF"
          value={cpf}
          onChange={e => setCpf(e.target.value)}
          className="border rounded px-4 py-2"
          maxLength={14}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded py-2 font-semibold"
          disabled={loading}
        >
          {loading ? "Verificando..." : "Verificar"}
        </button>
        {mensagem && (
          <div className="mt-2 text-center text-sm text-zinc-700 dark:text-zinc-200">{mensagem}</div>
        )}
      </form>
    </div>
  );
}
