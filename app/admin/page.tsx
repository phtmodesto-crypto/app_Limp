import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Users, Briefcase, TrendingUp, Star, Clock, Download } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Admin" };

async function getStats() {
  const [
    total,
    novos,
    porStatus,
    porClassificacao,
    porCargo,
    recentes,
  ] = await Promise.all([
    prisma.candidatura.count({ where: { anonimizado: false } }),
    prisma.candidatura.count({
      where: { status: "NOVO", anonimizado: false },
    }),
    prisma.candidatura.groupBy({
      by: ["status"],
      where: { anonimizado: false },
      _count: true,
    }),
    prisma.candidatura.groupBy({
      by: ["classificacao"],
      where: { anonimizado: false },
      _count: true,
    }),
    prisma.candidatura.groupBy({
      by: ["cargo"],
      where: { anonimizado: false },
      _count: true,
      orderBy: { _count: { cargo: "desc" } },
      take: 5,
    }),
    prisma.candidatura.findMany({
      where: { anonimizado: false },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        protocolo: true,
        nomeCompleto: true,
        cargo: true,
        pontuacaoTotal: true,
        classificacao: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return { total, novos, porStatus, porClassificacao, porCargo, recentes };
}

const STATUS_LABEL: Record<string, string> = {
  NOVO: "Novo",
  EM_ANALISE: "Em Análise",
  ENTREVISTA: "Entrevista",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
};

const CLASSIF_COLOR: Record<string, string> = {
  "Perfil em Destaque": "badge badge-destaque",
  "Perfil Adequado": "badge badge-adequado",
  "Em Análise": "badge badge-analise",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const stats = await getStats();

  const statusMap = Object.fromEntries(
    stats.porStatus.map((s) => [s.status, s._count])
  );
  const classifMap = Object.fromEntries(
    stats.porClassificacao.map((c) => [c.classificacao, c._count])
  );

  return (
    <div className="p-4 md:p-8 lg:pl-8 pt-14 lg:pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-600">Dashboard</h1>
          <p className="text-slate-500 text-sm">
            Olá, {session.user?.name}! Aqui está o resumo das candidaturas.
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href="/api/admin/export"
            className="btn-secondary text-sm flex items-center gap-2 px-4 py-2"
          >
            <Download className="w-4 h-4" /> Exportar Excel
          </a>
          <Link
            href="/admin/candidatos"
            className="btn-primary text-sm flex items-center gap-2 px-4 py-2"
          >
            <Users className="w-4 h-4" /> Ver todos
          </Link>
        </div>
      </div>

      {/* Cards de stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Total</p>
              <p className="text-3xl font-extrabold text-navy-600">{stats.total}</p>
              <p className="text-xs text-slate-400 mt-1">candidaturas</p>
            </div>
            <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-navy-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Novos</p>
              <p className="text-3xl font-extrabold text-amber-500">{stats.novos}</p>
              <p className="text-xs text-slate-400 mt-1">aguardando análise</p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Destaques</p>
              <p className="text-3xl font-extrabold text-emerald-600">
                {classifMap["Perfil em Destaque"] || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">perfis em destaque</p>
            </div>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <Star className="w-5 h-5 text-emerald-600 fill-emerald-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs text-slate-500 font-medium mb-1">Entrevistas</p>
              <p className="text-3xl font-extrabold text-cyan-600">
                {statusMap["ENTREVISTA"] || 0}
              </p>
              <p className="text-xs text-slate-400 mt-1">agendadas</p>
            </div>
            <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Por status */}
        <div className="card">
          <h2 className="font-bold text-navy-600 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Por Status
          </h2>
          <div className="space-y-2">
            {Object.entries(STATUS_LABEL).map(([key, label]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span className="text-slate-600">{label}</span>
                <span className="font-bold text-navy-600">{statusMap[key] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Por classificação */}
        <div className="card">
          <h2 className="font-bold text-navy-600 mb-4 flex items-center gap-2">
            <Star className="w-4 h-4" /> Por Classificação
          </h2>
          <div className="space-y-3">
            {["Perfil em Destaque", "Perfil Adequado", "Em Análise"].map((c) => (
              <div key={c} className="flex items-center justify-between">
                <span className={CLASSIF_COLOR[c]}>{c}</span>
                <span className="font-bold text-navy-600 text-sm">{classifMap[c] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top cargos */}
        <div className="card">
          <h2 className="font-bold text-navy-600 mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Top Vagas
          </h2>
          <div className="space-y-2">
            {stats.porCargo.map((c) => (
              <div key={c.cargo} className="flex items-center justify-between text-sm">
                <span className="text-slate-600 truncate mr-2">{c.cargo}</span>
                <span className="font-bold text-navy-600 flex-shrink-0">{c._count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Candidaturas recentes */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-navy-600">Candidaturas recentes</h2>
          <Link href="/admin/candidatos" className="text-sm text-navy-600 hover:underline">
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left pb-2 text-xs text-slate-400 font-semibold uppercase tracking-wide">Nome</th>
                <th className="text-left pb-2 text-xs text-slate-400 font-semibold uppercase tracking-wide">Vaga</th>
                <th className="text-right pb-2 text-xs text-slate-400 font-semibold uppercase tracking-wide">Pontuação</th>
                <th className="text-center pb-2 text-xs text-slate-400 font-semibold uppercase tracking-wide hidden md:table-cell">Classificação</th>
                <th className="text-center pb-2 text-xs text-slate-400 font-semibold uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats.recentes.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 pr-3">
                    <Link href={`/admin/candidatos/${c.id}`} className="font-medium text-slate-700 hover:text-navy-600 transition-colors">
                      {c.nomeCompleto}
                    </Link>
                    <p className="text-xs text-slate-400 font-mono">{c.protocolo}</p>
                  </td>
                  <td className="py-2.5 text-slate-600 text-xs pr-3">{c.cargo}</td>
                  <td className="py-2.5 text-right font-bold text-navy-600 pr-3">
                    {c.pontuacaoTotal.toFixed(1)}
                  </td>
                  <td className="py-2.5 text-center hidden md:table-cell pr-3">
                    <span className={CLASSIF_COLOR[c.classificacao] || "badge"}>
                      {c.classificacao}
                    </span>
                  </td>
                  <td className="py-2.5 text-center">
                    <span className="text-xs text-slate-500">{STATUS_LABEL[c.status] || c.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
