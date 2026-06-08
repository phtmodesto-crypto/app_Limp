"use client";

import { useState } from "react";
import type { FormData } from "./MultiStepForm";
import { ChevronRight, ChevronLeft, Shield, ExternalLink } from "lucide-react";

interface Props {
  formData: FormData;
  updateFormData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepLGPD({ formData, updateFormData, onNext, onBack }: Props) {
  const [aceito, setAceito] = useState(formData.lgpdAceite);
  const [erro, setErro] = useState("");

  const handleNext = () => {
    if (!aceito) {
      setErro("Você precisa aceitar o termo para continuar com sua candidatura.");
      return;
    }
    updateFormData({
      lgpdAceite: true,
      lgpdDataHora: new Date().toISOString(),
    });
    onNext();
  };

  return (
    <div className="step-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-sm">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-600">Autorização LGPD</h2>
          <p className="text-slate-500 text-sm">Leia e aceite o termo de consentimento</p>
        </div>
      </div>

      {/* Termo */}
      <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 mb-5 max-h-80 overflow-y-auto text-sm text-slate-700 leading-relaxed space-y-3">
        <h3 className="font-bold text-navy-600 text-base">
          TERMO DE CONSENTIMENTO PARA TRATAMENTO DE DADOS PESSOAIS
        </h3>
        <p>
          Em conformidade com a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados Pessoais – LGPD),
          declaro que autorizo, de forma livre, informada e inequívoca, o <strong>Grupo Limpservice</strong> a
          coletar, armazenar e tratar os meus dados pessoais e informações curriculares fornecidos neste formulário.
        </p>
        <p>
          <strong>Finalidade:</strong> os dados serão utilizados exclusivamente para fins de recrutamento, seleção
          e avaliação profissional, podendo ser armazenados durante o processo seletivo e por período razoável
          para futuras oportunidades.
        </p>
        <p>
          <strong>Compartilhamento:</strong> os dados poderão ser acessados apenas pelos setores responsáveis
          pelo processo seletivo, não sendo compartilhados com terceiros sem nova autorização, salvo obrigação
          legal.
        </p>
        <p>
          <strong>Direitos do titular:</strong> estou ciente de que posso, a qualquer momento, solicitar a
          confirmação, o acesso, a correção, a portabilidade ou a exclusão dos meus dados, bem como revogar
          este consentimento, mediante solicitação aos canais de contato do Grupo Limpservice.
        </p>
        <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
          Para exercer seus direitos, entre em contato com nosso RH informando o número de protocolo
          gerado ao final do cadastro.
        </p>
      </div>

      {/* Checkbox de aceite */}
      <label
        htmlFor="lgpd-aceite"
        className={`flex items-start gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
          aceito
            ? "border-navy-400 bg-brand-light"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <input
          type="checkbox"
          id="lgpd-aceite"
          checked={aceito}
          onChange={(e) => {
            setAceito(e.target.checked);
            if (erro) setErro("");
          }}
          className="w-5 h-5 accent-navy-600 mt-0.5 flex-shrink-0 cursor-pointer"
        />
        <span className="text-sm text-slate-700 leading-relaxed">
          Li e concordo com o tratamento dos meus dados pessoais conforme descrito acima,
          para fins exclusivos de recrutamento e seleção no <strong>Grupo Limpservice</strong>.
        </span>
      </label>

      {erro && <p className="error-msg mt-2">{erro}</p>}

      <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
        <ExternalLink className="w-3.5 h-3.5" />
        <a
          href="/politica-de-privacidade"
          target="_blank"
          rel="noopener noreferrer"
          className="text-navy-600 hover:underline"
        >
          Ver Política de Privacidade completa
        </a>
      </div>

      <div className="flex gap-3 mt-5">
        <button type="button" onClick={onBack} className="btn-secondary flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          Continuar <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
