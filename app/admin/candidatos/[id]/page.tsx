import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft, Download, Star, FileText, Shield, Clock } from "lucide-react";
import type { Metadata } from "next";
import { StatusUpdater } from "@/components/admin/StatusUpdater";
import { AnonimizarButton } from "@/components/admin/AnonimizarButton";
import { DeleteButton } from "@/components/admin/DeleteButton";

export const metadata: Metadata = { title: "Detalhe do Candidato — Admin" };

const competenciasLabel: Record<string, string> = {
  pontualidade: "Pontualidade",
  trabalhoEquipe: "Trabalho em Equipe",
  proatividade: "Proatividade",
  atencaoSeguranca: "Atenção a Normas de Segurança",
  comunicacao: "Comunicação",
};

const CLASSIF_BADGE: Record<string, string> = {
  "Perfil em Destaque": "badge badge-destaque",
  "Perfil Adequado": "badge badge-adequado",
  "Em Análise": "badge badge-analise",
};

const STATUS_LABEL: Record<string, string> = {
  NOVO: "Novo",
  EM_ANALISE: "Em Análise",
  ENTREVISTA: "Entrevista",
  APROVADO: "Aprovado",
  REPROVADO: "Reprovado",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card mb-4">
      <h2 className="font-bold text-navy-600 mb-4 pb-2 border-b border-slate-100">{title}</h2>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="flex gap-2 py-1 text-sm border-b border-slate-50 last:border-0">
      <span className="text-slate-400 min-w-[140px] flex-shrink-0">{label}</span>
      <span className="text-slate-700 font-medium">{value ?? "—"}</span>
    </div>
  );
}

export default async function CandidatoDetalhe({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  const { id } = await params;
  const candidatura = await prisma.candidatura.findUnique({ where: { id } });
  if (!candidatura) notFound();

  const experiencias = JSON.parse(candidatura.experiencias || "[]");
  const cursos = JSON.parse(candidatura.cursos || "[]");
  const autoavaliacao = JSON.parse(candidatura.autoavaliacao || "{}");
  const statusHistorico = JSON.parse(candidatura.statusHistorico || "[]");
  const turno = JSON.parse(candidatura.turno || "[]");

  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className="p-4 md:p-8 lg:pl-8 pt-14 lg:pt-6 max-w-4xl">
      {/* Cabeçalho */}
      <div className="flex items-start gap-3 mb-5">
        <Link href="/admin/candidatos" className="btn-secondary py-2 px-3 mt-0.5 flex-shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-navy-600">{candidatura.nomeCompleto}</h1>
          <p className="text-slate-500 text-sm">
            Protocolo:{" "}
            <span className="font-mono font-bold text-navy-600">{candidatura.protocolo}</span>
            {" · "}
            {new Date(candidatura.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
      </div>

      {/* Pontuação e classificação */}
      <div className={`p-4 rounded-2xl border-2 mb-4 flex items-center justify-between
        ${candidatura.classificacao === "Perfil em Destaque"
          ? "border-emerald-200 bg-emerald-50"
          : candidatura.classificacao === "Perfil Adequado"
          ? "border-navy-100 bg-brand-light"
          : "border-amber-200 bg-amber-50"
        }`}>
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Classificação</p>
          <span className={CLASSIF_BADGE[candidatura.classificacao] || "badge"}>
            {candidatura.classificacao}
          </span>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-0.5">Pontuação Total</p>
          <p className="text-3xl font-extrabold text-navy-600">
            {candidatura.pontuacaoTotal.toFixed(1)}<span className="text-base font-normal text-slate-400">/100</span>
          </p>
          <p className="text-xs text-slate-400">
            Auto: {candidatura.pontuacaoAuto.toFixed(1)} · Perfil: {candidatura.pontuacaoCompl.toFixed(1)}
          </p>
        </div>
      </div>

      {/* Status + atualização */}
      <StatusUpdater
        candidaturaId={candidatura.id}
        statusAtual={candidatura.status}
        statusLabel={STATUS_LABEL}
      />

      {/* Dados pessoais */}
      <Section title="👤 Dados pessoais">
        <Row label="Nome completo" value={candidatura.nomeCompleto} />
        <Row label="Data de nascimento" value={candidatura.dataNasc} />
        <Row label="Telefone" value={candidatura.telefone} />
        <Row label="WhatsApp" value={candidatura.whatsapp} />
        <Row label="E-mail" value={candidatura.email} />
        <Row label="Cidade" value={candidatura.cidade} />
        <Row label="Estado" value={candidatura.estado} />
      </Section>

      {/* Vaga */}
      <Section title="💼 Vaga de interesse">
        <Row label="Cargo" value={candidatura.cargo} />
        <Row label="Turno(s)" value={turno.join(", ")} />
        <Row
          label="Pretensão salarial"
          value={
            candidatura.pretensaoSalarial
              ? `R$ ${candidatura.pretensaoSalarial.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
              : "Não informado"
          }
        />
      </Section>

      {/* Experiência */}
      <Section title="🏢 Experiência profissional">
        {experiencias.length === 0 ? (
          <p className="text-sm text-slate-400 italic">Não informada</p>
        ) : (
          <div className="space-y-4">
            {experiencias.map((exp: {
              empresa: string; cargo: string; dataInicio: string;
              dataFim?: string; empregoAtual: boolean; atividades?: string;
            }, i: number) => (
              <div key={i} className={i < experiencias.length - 1 ? "pb-4 border-b border-slate-100" : ""}>
                <p className="font-semibold text-navy-600">{exp.cargo}</p>
                <p className="text-slate-600 text-sm">{exp.empresa}</p>
                <p className="text-slate-400 text-xs mt-0.5">
                  {exp.dataInicio} → {exp.empregoAtual ? "Atual" : exp.dataFim || "—"}
                </p>
                {exp.atividades && (
                  <p className="text-slate-500 text-sm mt-1">{exp.atividades}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      {/* Formação */}
      <Section title="🎓 Formação">
        <Row label="Escolaridade" value={candidatura.escolaridade} />
        {cursos.length > 0 && (
          <div className="pt-2">
            <p className="text-xs text-slate-400 mb-2">Cursos complementares:</p>
            {cursos.map((c: { nome: string; instituicao?: string; ano?: string }, i: number) => (
              <p key={i} className="text-sm text-slate-700">
                • {c.nome}{c.instituicao ? ` — ${c.instituicao}` : ""}{c.ano ? ` (${c.ano})` : ""}
              </p>
            ))}
          </div>
        )}
      </Section>

      {/* Autoavaliação */}
      <Section title="⭐ Autoavaliação profissional">
        <div className="space-y-3">
          {Object.entries(autoavaliacao).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{competenciasLabel[key] || key}</span>
              <div className="flex items-center gap-2">
                <span className="text-yellow-500 text-lg tracking-wide">{stars(Number(val))}</span>
                <span className="text-sm font-bold text-navy-600 w-4">{String(val)}</span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Currículo */}
      {candidatura.curriculoUrl && (
        <div className="card mb-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-brand-light rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-navy-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-700 text-sm">{candidatura.curriculoNome}</p>
            <p className="text-xs text-slate-400">
              {candidatura.curriculoTipo} ·{" "}
              {candidatura.curriculoTamanho
                ? `${(candidatura.curriculoTamanho / 1024).toFixed(0)} KB`
                : ""}
            </p>
          </div>
          <a
            href={candidatura.curriculoUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary text-sm flex items-center gap-2 px-3 py-2"
          >
            <Download className="w-4 h-4" /> Baixar
          </a>
        </div>
      )}

      {/* LGPD */}
      <div className="card mb-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-navy-600 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-semibold text-navy-600 text-sm">Termo LGPD aceito</p>
          <p className="text-xs text-slate-400">
            {new Date(candidatura.lgpdDataHora).toLocaleString("pt-BR")}
          </p>
        </div>
      </div>

      {/* Histórico de status */}
      {statusHistorico.length > 0 && (
        <Section title="🕐 Histórico de status">
          <div className="space-y-2">
            {statusHistorico.map((h: {
              status: string; data: string; usuario?: string; obs?: string;
            }, i: number) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <Clock className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-700">
                    {STATUS_LABEL[h.status] || h.status}
                  </p>
                  <p className="text-xs text-slate-400">
                    {new Date(h.data).toLocaleString("pt-BR")}
                    {h.usuario ? ` · ${h.usuario}` : ""}
                  </p>
                  {h.obs && <p className="text-xs text-slate-500 mt-0.5">{h.obs}</p>}
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Anonimizar */}
      {!candidatura.anonimizado && (
        <AnonimizarButton candidaturaId={candidatura.id} />
      )}

      {/* Excluir permanentemente */}
      <div className="card mb-4 flex items-center justify-between">
        <div>
          <p className="font-bold text-slate-700 text-sm">Excluir candidatura</p>
          <p className="text-xs text-slate-400 mt-0.5">Remove permanentemente todos os dados do banco.</p>
        </div>
        <DeleteButton candidaturaId={candidatura.id} nomeCompleto={candidatura.nomeCompleto} />
      </div>
      {candidatura.anonimizado && (
        <div className="card text-center text-sm text-slate-400 bg-slate-50">
          Dados anonimizados em{" "}
          {candidatura.anonimizadoEm
            ? new Date(candidatura.anonimizadoEm).toLocaleString("pt-BR")
            : "—"}
          {candidatura.anonimizadoPor ? ` por ${candidatura.anonimizadoPor}` : ""}
        </div>
      )}

      <div className="h-8" />
    </div>
  );
}
