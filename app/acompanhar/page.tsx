export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { Search, ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Acompanhar Candidatura — Limpservice",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; desc: string; color: string; bg: string; icon: string }
> = {
  NOVO: {
    label: "Recebido",
    desc: "Sua candidatura foi recebida e está na fila de análise.",
    color: "text-slate-600",
    bg: "bg-slate-100 border-slate-200",
    icon: "📥",
  },
  EM_ANALISE: {
    label: "Em Análise",
    desc: "Seu currículo está sendo avaliado pela equipe de RH.",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: "🔍",
  },
  ENTREVISTA: {
    label: "Entrevista",
    desc: "Parabéns! Você avançou para a etapa de entrevista. Aguarde o contato do RH.",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    icon: "🤝",
  },
  APROVADO: {
    label: "Aprovado",
    desc: "Parabéns! Você foi aprovado no processo seletivo. O RH entrará em contato.",
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
    icon: "✅",
  },
  REPROVADO: {
    label: "Não selecionado",
    desc: "Agradecemos sua participação. No momento, não avançaremos com sua candidatura. Boa sorte!",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: "❌",
  },
};

const ETAPAS = ["NOVO", "EM_ANALISE", "ENTREVISTA", "APROVADO"];

interface StatusEntry {
  status: string;
  data: string;
  obs?: string;
}

async function buscarCandidatura(protocolo: string) {
  return prisma.candidatura.findUnique({
    where: { protocolo },
    select: {
      protocolo: true,
      status: true,
      cargo: true,
      createdAt: true,
      statusHistorico: true,
    },
  });
}

export default async function AcompanharPage({
  searchParams,
}: {
  searchParams: Promise<{ protocolo?: string }>;
}) {
  const { protocolo: protocoloRaw } = await searchParams;
  const protocolo = protocoloRaw?.trim().toUpperCase() || "";

  const candidatura = protocolo ? await buscarCandidatura(protocolo) : null;
  const notFound = protocolo && !candidatura;

  const statusCfg = candidatura ? STATUS_CONFIG[candidatura.status] ?? STATUS_CONFIG.NOVO : null;
  const historico: StatusEntry[] = candidatura
    ? JSON.parse(candidatura.statusHistorico || "[]")
    : [];

  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <header className="bg-gradient-brand shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="bg-white rounded-xl px-3 py-1.5">
              <Image src="/logo.png" alt="Grupo Limpservice" width={140} height={50} className="h-9 w-auto" />
            </div>
          </Link>
          <Link
            href="/candidatura"
            className="bg-white text-navy-600 font-semibold px-4 py-2 rounded-xl
                       hover:bg-cyan-50 transition-colors text-sm shadow-sm"
          >
            Candidatar-se
          </Link>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Voltar */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-navy-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-navy-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-navy-600 mb-2">
            Acompanhar candidatura
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            Digite o número de protocolo gerado ao final do seu cadastro
            para consultar o status da sua candidatura.
          </p>
        </div>

        {/* Formulário de busca */}
        <form method="GET" className="card mb-6">
          <label className="label-field">Número do Protocolo</label>
          <input
            type="text"
            name="protocolo"
            defaultValue={protocolo}
            placeholder="Ex.: LS-202608-0E1780FB"
            className="input-field font-mono tracking-wider uppercase mb-3"
            autoComplete="off"
          />
          <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
            <Search className="w-4 h-4" />
            Consultar status
          </button>
        </form>

        {/* Protocolo não encontrado */}
        {notFound && (
          <div className="card border-red-200 bg-red-50 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-700 text-sm">Protocolo não encontrado</p>
              <p className="text-red-600 text-xs mt-0.5">
                Verifique se digitou o número corretamente. O protocolo está na página de
                confirmação enviada após o cadastro.
              </p>
            </div>
          </div>
        )}

        {/* Resultado */}
        {candidatura && statusCfg && (
          <div className="space-y-4">
            {/* Card de status */}
            <div className={`card border-2 ${statusCfg.bg}`}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{statusCfg.icon}</span>
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">
                    Status atual
                  </p>
                  <p className={`text-xl font-extrabold ${statusCfg.color}`}>
                    {statusCfg.label}
                  </p>
                </div>
              </div>
              <p className={`text-sm ${statusCfg.color} leading-relaxed`}>
                {statusCfg.desc}
              </p>
            </div>

            {/* Info da candidatura */}
            <div className="card">
              <div className="flex justify-between items-start text-sm">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Protocolo</p>
                  <p className="font-mono font-bold text-navy-600">{candidatura.protocolo}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Enviado em</p>
                  <p className="text-slate-600 font-medium">
                    {new Date(candidatura.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400 uppercase tracking-wide mb-0.5">Vaga de interesse</p>
                <p className="text-slate-700 font-semibold">{candidatura.cargo}</p>
              </div>
            </div>

            {/* Linha do tempo de progresso */}
            {candidatura.status !== "REPROVADO" && (
              <div className="card">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-4">
                  Progresso do processo seletivo
                </p>
                <div className="flex items-center gap-0">
                  {ETAPAS.map((etapa, i) => {
                    const cfg = STATUS_CONFIG[etapa];
                    const isActive = etapa === candidatura.status;
                    const isPast =
                      ETAPAS.indexOf(etapa) < ETAPAS.indexOf(candidatura.status);
                    return (
                      <div key={etapa} className="flex items-center flex-1">
                        <div className="flex flex-col items-center flex-1">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all
                              ${isActive
                                ? "bg-navy-600 border-navy-600 text-white shadow-md"
                                : isPast
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "bg-white border-slate-200 text-slate-300"
                              }`}
                          >
                            {isPast ? <CheckCircle className="w-4 h-4" /> : i + 1}
                          </div>
                          <p
                            className={`text-xs mt-1 text-center leading-tight
                              ${isActive ? "font-bold text-navy-600" : isPast ? "text-emerald-600" : "text-slate-300"}`}
                          >
                            {cfg.label}
                          </p>
                        </div>
                        {i < ETAPAS.length - 1 && (
                          <div
                            className={`h-0.5 flex-1 mx-1 mb-5 rounded
                              ${isPast ? "bg-emerald-400" : "bg-slate-100"}`}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Histórico */}
            {historico.length > 0 && (
              <div className="card">
                <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold mb-3">
                  Histórico de atualizações
                </p>
                <div className="space-y-3">
                  {[...historico].reverse().map((h, i) => {
                    const hCfg = STATUS_CONFIG[h.status] ?? STATUS_CONFIG.NOVO;
                    return (
                      <div key={i} className="flex items-start gap-3 text-sm">
                        <Clock className="w-4 h-4 text-slate-300 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className={`font-semibold ${hCfg.color}`}>{hCfg.label}</p>
                          <p className="text-xs text-slate-400">
                            {new Date(h.data).toLocaleString("pt-BR")}
                          </p>
                          {h.obs && (
                            <p className="text-xs text-slate-500 mt-0.5 italic">{h.obs}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Dica inicial (sem busca) */}
        {!protocolo && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Onde encontrar o protocolo?</strong> Após enviar sua candidatura, você
              recebeu uma página de confirmação com o número de protocolo. Ele começa com{" "}
              <span className="font-mono font-bold">LS-</span> seguido de data e código único.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center text-xs text-slate-400 py-8">
        © {new Date().getFullYear()} Grupo Limpservice — Todos os direitos reservados.
      </footer>
    </div>
  );
}
