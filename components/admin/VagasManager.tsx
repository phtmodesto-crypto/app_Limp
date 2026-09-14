"use client";

import { useState } from "react";

interface Vaga {
  id: string;
  nome: string;
  icon: string;
  ativo: boolean;
  ordem: number;
}

export function VagasManager({ vagasIniciais }: { vagasIniciais: Vaga[] }) {
  const [vagas, setVagas] = useState<Vaga[]>(vagasIniciais);
  const [loading, setLoading] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  const toggle = async (id: string, ativo: boolean) => {
    setLoading(id);
    setErro("");
    try {
      const res = await fetch("/api/admin/vagas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ativo }),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      setVagas((prev) => prev.map((v) => (v.id === id ? { ...v, ativo } : v)));
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  const ativas = vagas.filter((v) => v.ativo).length;

  return (
    <div>
      <p className="text-sm text-slate-500 mb-6">
        {ativas} de {vagas.length} vagas visíveis no site público.
        As alterações entram em vigor imediatamente.
      </p>

      {erro && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          {erro}
        </div>
      )}

      <div className="space-y-3">
        {vagas.map((vaga) => (
          <div
            key={vaga.id}
            className={`flex items-center justify-between p-4 rounded-xl border transition-all
              ${vaga.ativo
                ? "border-emerald-200 bg-emerald-50"
                : "border-slate-100 bg-slate-50 opacity-60"
              }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{vaga.icon}</span>
              <span className="font-semibold text-slate-700">{vaga.nome}</span>
              {vaga.ativo && (
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">
                  Visível
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggle(vaga.id, !vaga.ativo)}
              disabled={loading === vaga.id}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                ${vaga.ativo ? "bg-emerald-500" : "bg-slate-300"}
                ${loading === vaga.id ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
              aria-label={vaga.ativo ? "Desativar vaga" : "Ativar vaga"}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                  ${vaga.ativo ? "translate-x-6" : "translate-x-1"}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
