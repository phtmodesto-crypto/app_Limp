"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "NOVO", label: "Novo", color: "bg-slate-100 text-slate-600 border-slate-200" },
  { value: "EM_ANALISE", label: "Em Análise", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "ENTREVISTA", label: "Entrevista", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "APROVADO", label: "Aprovado", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  { value: "REPROVADO", label: "Reprovado", color: "bg-red-100 text-red-700 border-red-200" },
];

interface Props {
  candidaturaId: string;
  statusAtual: string;
  statusLabel: Record<string, string>;
}

export function StatusUpdater({ candidaturaId, statusAtual }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(statusAtual);
  const [obs, setObs] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSave = async () => {
    if (status === statusAtual && !obs) return;
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch(`/api/admin/candidaturas/${candidaturaId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, obs }),
      });
      if (!res.ok) throw new Error();
      setMsg("Status atualizado!");
      setObs("");
      router.refresh();
    } catch {
      setMsg("Erro ao atualizar status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <h2 className="font-bold text-navy-600 mb-3 pb-2 border-b border-slate-100">
        📋 Gestão de Status
      </h2>
      <div className="flex flex-wrap gap-2 mb-3">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setStatus(opt.value)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border-2 transition-all
              ${status === opt.value ? opt.color + " ring-2 ring-offset-1 ring-navy-300" : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"}`}
          >
            {status === opt.value && <Check className="w-3 h-3 inline mr-1" />}
            {opt.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <label className="label-field text-xs">Observação (opcional)</label>
          <input
            type="text"
            placeholder="Ex.: Candidato contatado por telefone"
            className="input-field py-2 text-sm"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
          />
        </div>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading || (status === statusAtual && !obs)}
          className="btn-primary py-2 px-4 text-sm"
        >
          {loading ? "…" : "Salvar"}
        </button>
      </div>
      {msg && (
        <p className={`text-xs mt-2 ${msg.includes("Erro") ? "text-red-500" : "text-emerald-600"}`}>
          {msg}
        </p>
      )}
    </div>
  );
}
