import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Download, Search, Filter } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Candidatos — Admin" };

const CLASSIF_BADGE: Record<string, string> = {
  "Perfil em Destaque": "badge badge-destaque",
  "Perfil Adequado": "badge badge-adequado",
  "Em Análise": "badge badge-analise",
};

const STATUS_BADGE: Record<string, string> = {
  NOVO: "bg-slate-100 text-slate-600",
  EM_ANALISE: "bg-blue-100 text-blue-600",
  ENTREVISTA: "bg-purple-100 text-purple-600",
  APROVADO: "bg-emerald-100 text-emerald-600",
  REPROVADO: "bg-red-100 text-red-600",
};

const STATUS_LABEL: Record<string, string> = {
  NOVO: "Novo",
  EM_ANALISE: "Em Análise",
  ENTREVISTA: "Entrevista",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
};

const CARGOS = [
  "Auxiliar de Limpeza",
  "Auxiliar de Serviços Gerais",
  "Jardineiro(a)",
  "Porteiro(a) / Recepcionista",
  "Serviços Hospitalares",
  "Auxiliar Administrativo",
  "Copeiro(a)",
  "Motorista",
  "Vigilante / Segurança",
  "Outro",
];

async function getCandidatos(searchParams: Record<string, string>) {
  const {
    busca = "",
    cargo = "",
    status = "",
    classificacao = "",
    cidade = "",
    pagina = "1",
    ordenar = "pontuacaoTotal",
    direcao = "desc",
  } = searchParams;

  const pg = parseInt(pagina);
  const porPagina = 20;

  const where: Record<string, unknown> = { anonimizado: false };
  if (cargo) where.cargo = cargo;
  if (status) where.status = status;
  if (classificacao) where.classificacao = classificacao;
  if (cidade) where.cidade = { contains: cidade };
  if (busca) {
    where.OR = [
      { nomeCompleto: { contains: busca } },
      { email: { contains: busca } },
      { protocolo: { contains: busca } },
    ];
  }

  const [total, candidatos] = await Promise.all([
    prisma.candidatura.count({ where }),
    prisma.candidatura.findMany({
      where,
      orderBy: { [ordenar]: direcao as "asc" | "desc" },
      skip: (pg - 1) * porPagina,
      take: porPagina,
      select: {
        id: true,
        protocolo: true,
        nomeCompleto: true,
        email: true,
        telefone: true,
        cidade: true,
        estado: true,
        cargo: true,
        pontuacaoTotal: true,
        classificacao: true,
        status: true,
        curriculoUrl: true,
        createdAt: true,
      },
    }),
  ]);

  return { candidatos, total, pg, porPagina, totalPaginas: Math.ceil(total / porPagina) };
}

export default async function CandidatosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const params = await searchParams;
  const { candidatos, total, pg, totalPaginas } = await getCandidatos(params);

  const buildUrl = (extra: Record<string, string>) => {
    const p = { ...params, ...extra };
    return "/admin/candidatos?" + new URLSearchParams(p).toString();
  };

  return (
    <div className="p-4 md:p-8 lg:pl-8 pt-14 lg:pt-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-navy-600">Candidatos</h1>
          <p className="text-slate-500 text-sm">{total} candidatura{total !== 1 ? "s" : ""}</p>
        </div>
        <a
          href={`/api/admin/export?${new URLSearchParams({
            cargo: params.cargo || "",
            status: params.status || "",
            classificacao: params.classificacao || "",
          }).toString()}`}
          className="btn-secondary text-sm flex items-center gap-2 px-4 py-2"
        >
          <Download className="w-4 h-4" /> Exportar Excel
        </a>
      </div>

      {/* Filtros */}
      <div className="card mb-5">
        <form method="get" className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="label-field text-xs">Busca</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                name="busca"
                type="text"
                placeholder="Nome, e-mail ou protocolo"
                defaultValue={params.busca || ""}
                className="input-field pl-9 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="label-field text-xs">Vaga</label>
            <select name="cargo" defaultValue={params.cargo || ""} className="input-field py-2 text-sm">
              <option value="">Todas as vagas</option>
              {CARGOS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="label-field text-xs">Status</label>
            <select name="status" defaultValue={params.status || ""} className="input-field py-2 text-sm">
              <option value="">Todos</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-field text-xs">Classificação</label>
            <select name="classificacao" defaultValue={params.classificacao || ""} className="input-field py-2 text-sm">
              <option value="">Todas</option>
              <option value="Perfil em Destaque">Perfil em Destaque</option>
              <option value="Perfil Adequado">Perfil Adequado</option>
              <option value="Em Análise">Em Análise</option>
            </select>
          </div>

          <div>
            <label className="label-field text-xs">Ordenar</label>
            <select name="ordenar" defaultValue={params.ordenar || "pontuacaoTotal"} className="input-field py-2 text-sm">
              <option value="pontuacaoTotal">Pontuação</option>
              <option value="createdAt">Data</option>
              <option value="nomeCompleto">Nome</option>
            </select>
          </div>

          <button type="submit" className="btn-primary py-2 px-4 text-sm flex items-center gap-1">
            <Filter className="w-4 h-4" /> Filtrar
          </button>

          <a href="/admin/candidatos" className="btn-secondary py-2 px-4 text-sm">
            Limpar
          </a>
        </form>
      </div>

      {/* Tabela */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-wide">
                  <Link href={buildUrl({ ordenar: "nomeCompleto", direcao: params.direcao === "asc" ? "desc" : "asc" })}>
                    Candidato
                  </Link>
                </th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-wide hidden sm:table-cell">Vaga</th>
                <th className="text-left px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-wide hidden md:table-cell">Local</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-wide">
                  <Link href={buildUrl({ ordenar: "pontuacaoTotal", direcao: params.direcao === "asc" ? "desc" : "asc" })}>
                    Pontuação
                  </Link>
                </th>
                <th className="text-center px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-wide hidden lg:table-cell">Classificação</th>
                <th className="text-center px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-wide">Status</th>
                <th className="text-right px-4 py-3 text-xs text-slate-400 font-bold uppercase tracking-wide hidden md:table-cell">
                  <Link href={buildUrl({ ordenar: "createdAt", direcao: params.direcao === "asc" ? "desc" : "asc" })}>
                    Data
                  </Link>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {candidatos.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    Nenhuma candidatura encontrada
                  </td>
                </tr>
              ) : (
                candidatos.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <Link href={`/admin/candidatos/${c.id}`} className="block">
                        <p className="font-semibold text-slate-800 hover:text-navy-600 transition-colors">
                          {c.nomeCompleto}
                        </p>
                        <p className="text-xs text-slate-400 font-mono">{c.protocolo}</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-slate-600 text-xs hidden sm:table-cell">{c.cargo}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs hidden md:table-cell">
                      {c.cidade}/{c.estado}
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-navy-600">
                      {c.pontuacaoTotal.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-center hidden lg:table-cell">
                      <span className={CLASSIF_BADGE[c.classificacao] || "badge"}>
                        {c.classificacao}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_BADGE[c.status] || ""}`}>
                        {STATUS_LABEL[c.status] || c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-xs text-slate-400 hidden md:table-cell">
                      {new Date(c.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {totalPaginas > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Página {pg} de {totalPaginas}
            </p>
            <div className="flex gap-2">
              {pg > 1 && (
                <Link
                  href={buildUrl({ pagina: String(pg - 1) })}
                  className="btn-secondary py-1.5 px-3 text-sm"
                >
                  ← Anterior
                </Link>
              )}
              {pg < totalPaginas && (
                <Link
                  href={buildUrl({ pagina: String(pg + 1) })}
                  className="btn-primary py-1.5 px-3 text-sm"
                >
                  Próxima →
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
