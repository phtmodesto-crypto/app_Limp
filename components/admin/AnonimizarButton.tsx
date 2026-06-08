"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";

interface Props {
  candidaturaId: string;
}

export function AnonimizarButton({ candidaturaId }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleAnonimizar = async () => {
    setLoading(true);
    setErro("");
    try {
      const res = await fetch(
        `/api/admin/candidaturas/${candidaturaId}/anonimizar`,
        { method: "POST" }
      );
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro");
      }
      router.refresh();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao anonimizar");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <div className="card mb-4 border-red-100 bg-red-50">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-red-700 text-sm">Confirmar exclusão dos dados</p>
            <p className="text-xs text-red-600 mt-1">
              Esta ação é <strong>irreversível</strong>. Todos os dados pessoais do candidato
              serão substituídos por placeholders, em atendimento ao direito de exclusão da LGPD.
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="btn-secondary flex-1 text-sm py-2"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleAnonimizar}
            disabled={loading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4
                       rounded-xl transition-all text-sm flex items-center justify-center gap-2"
          >
            {loading ? "Removendo…" : "Confirmar exclusão"}
          </button>
        </div>
        {erro && <p className="text-red-500 text-xs mt-2">{erro}</p>}
      </div>
    );
  }

  return (
    <div className="card mb-4">
      <h2 className="font-bold text-navy-600 mb-2 text-sm">🛡️ Direito de Exclusão — LGPD</h2>
      <p className="text-xs text-slate-500 mb-3">
        Caso o candidato solicite a exclusão dos seus dados, clique abaixo para anonimizar
        todas as informações pessoais desta candidatura.
      </p>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600
                   rounded-xl hover:bg-red-50 transition-all text-sm font-medium"
      >
        <Trash2 className="w-4 h-4" />
        Anonimizar dados do candidato
      </button>
    </div>
  );
}
