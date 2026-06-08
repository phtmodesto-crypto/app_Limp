"use client";

import type { FormData } from "./MultiStepForm";
import { ChevronLeft, Send, AlertCircle, CheckCircle, Edit3 } from "lucide-react";

interface Props {
  formData: FormData;
  updateFormData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  submitting: boolean;
  submitError: string;
}

const competenciasLabel: Record<string, string> = {
  pontualidade: "Pontualidade",
  trabalhoEquipe: "Trabalho em Equipe",
  proatividade: "Proatividade",
  atencaoSeguranca: "Atenção a Normas de Segurança",
  comunicacao: "Comunicação",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-slate-100 rounded-xl p-4 space-y-1.5">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-slate-400 min-w-[120px] flex-shrink-0">{label}:</span>
      <span className="text-slate-700 font-medium">{value || "—"}</span>
    </div>
  );
}

export function StepRevisao({
  formData,
  onBack,
  onSubmit,
  submitting,
  submitError,
}: Props) {
  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <div className="step-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-sm">
          <CheckCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-600">Revisão e envio</h2>
          <p className="text-slate-500 text-sm">Confira seus dados antes de enviar</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        {/* Dados pessoais */}
        <Section title="Dados pessoais">
          <Row label="Nome" value={formData.nomeCompleto} />
          <Row label="Nascimento" value={formData.dataNasc} />
          <Row label="Telefone" value={formData.telefone} />
          {formData.whatsapp && <Row label="WhatsApp" value={formData.whatsapp} />}
          <Row label="E-mail" value={formData.email} />
          <Row label="Localização" value={`${formData.cidade} — ${formData.estado}`} />
        </Section>

        {/* Vaga */}
        <Section title="Vaga de interesse">
          <Row label="Cargo" value={formData.cargo} />
          <Row label="Turno(s)" value={formData.turno.join(", ") || "—"} />
          {formData.pretensaoSalarial && (
            <Row
              label="Pretensão"
              value={`R$ ${parseFloat(formData.pretensaoSalarial).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
            />
          )}
        </Section>

        {/* Experiência */}
        <Section title="Experiência profissional">
          {formData.experiencias.length === 0 ? (
            <p className="text-sm text-slate-400 italic">Nenhuma informada</p>
          ) : (
            formData.experiencias.map((exp, i) => (
              <div key={i} className="text-sm pb-2 mb-2 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
                <p className="font-semibold text-slate-700">
                  {exp.cargo} — {exp.empresa}
                </p>
                <p className="text-slate-400 text-xs">
                  {exp.dataInicio} até {exp.empregoAtual ? "Atual" : exp.dataFim || "—"}
                </p>
              </div>
            ))
          )}
        </Section>

        {/* Formação */}
        <Section title="Formação">
          <Row label="Escolaridade" value={formData.escolaridade} />
          {formData.cursos.length > 0 && (
            <div>
              <p className="text-xs text-slate-400 mt-1 mb-0.5">Cursos:</p>
              {formData.cursos.map((c, i) => (
                <p key={i} className="text-sm text-slate-700">
                  • {c.nome}{c.ano ? ` (${c.ano})` : ""}
                </p>
              ))}
            </div>
          )}
        </Section>

        {/* Autoavaliação */}
        <Section title="Autoavaliação">
          {Object.entries(formData.autoavaliacao).map(([key, val]) => (
            <div key={key} className="flex justify-between text-sm">
              <span className="text-slate-500">{competenciasLabel[key]}</span>
              <span className="text-yellow-500 tracking-wide">{stars(val)}</span>
            </div>
          ))}
        </Section>

        {/* Currículo */}
        <Section title="Currículo">
          {formData.curriculoUrl ? (
            <div className="flex items-center gap-2 text-sm text-emerald-600">
              <CheckCircle className="w-4 h-4" />
              <span>{formData.curriculoNome}</span>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">Não enviado (opcional)</p>
          )}
        </Section>

        {/* LGPD */}
        <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-sm text-emerald-700">
          <CheckCircle className="w-4 h-4 flex-shrink-0" />
          Termo LGPD aceito
        </div>
      </div>

      {/* Aviso */}
      <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-700 mb-4">
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <span>
          Ao clicar em <strong>&ldquo;Enviar candidatura&rdquo;</strong>, seus dados serão
          enviados ao setor de RH. Certifique-se de que todas as informações estão corretas.
        </span>
      </div>

      {submitError && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {submitError}
        </div>
      )}

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="btn-secondary flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Revisar</span>
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={submitting}
          className="btn-primary flex-1 flex items-center justify-center gap-2 text-base"
        >
          {submitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Enviando…
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Enviar candidatura
            </>
          )}
        </button>
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mt-3 w-full text-center text-sm text-navy-600 hover:underline flex items-center justify-center gap-1"
      >
        <Edit3 className="w-3.5 h-3.5" /> Editar informações
      </button>
    </div>
  );
}
