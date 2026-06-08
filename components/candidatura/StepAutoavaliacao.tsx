"use client";

import { useState } from "react";
import type { FormData } from "./MultiStepForm";
import { ChevronRight, ChevronLeft, Star } from "lucide-react";

interface Props {
  formData: FormData;
  updateFormData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface Competencia {
  key: keyof FormData["autoavaliacao"];
  label: string;
  desc: string;
  icon: string;
}

const competencias: Competencia[] = [
  {
    key: "pontualidade",
    label: "Pontualidade",
    desc: "Chega no horário, cumpre prazos e compromissos",
    icon: "⏰",
  },
  {
    key: "trabalhoEquipe",
    label: "Trabalho em Equipe",
    desc: "Colabora com colegas e contribui para um bom ambiente",
    icon: "🤝",
  },
  {
    key: "proatividade",
    label: "Proatividade",
    desc: "Identifica o que precisa ser feito sem precisar ser solicitado",
    icon: "🚀",
  },
  {
    key: "atencaoSeguranca",
    label: "Atenção a Normas de Segurança",
    desc: "Segue procedimentos e regras de segurança no trabalho",
    icon: "🦺",
  },
  {
    key: "comunicacao",
    label: "Comunicação",
    desc: "Expressa ideias com clareza e escuta os outros",
    icon: "💬",
  },
];

const labels = [
  "", // 0 não usado
  "Preciso melhorar",
  "Razoável",
  "Bom",
  "Muito bom",
  "Excelente",
];

function StarRating({
  value,
  onChange,
  name,
}: {
  value: number;
  onChange: (v: number) => void;
  name: string;
}) {
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          aria-label={`${star} de 5 estrelas`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            className={`w-8 h-8 transition-colors ${
              star <= display
                ? "fill-yellow-400 text-yellow-400"
                : "fill-slate-100 text-slate-300"
            }`}
          />
        </button>
      ))}
      {display > 0 && (
        <span className="ml-2 text-sm font-medium text-slate-600">
          {labels[display]}
        </span>
      )}
    </div>
  );
}

export function StepAutoavaliacao({ formData, updateFormData, onNext, onBack }: Props) {
  const [notas, setNotas] = useState(formData.autoavaliacao);
  const [erro, setErro] = useState("");

  const updateNota = (key: keyof typeof notas, value: number) => {
    setNotas((prev) => ({ ...prev, [key]: value }));
    if (erro) setErro("");
  };

  const handleNext = () => {
    const allFilled = Object.values(notas).every((v) => v >= 1 && v <= 5);
    if (!allFilled) {
      setErro("Por favor, avalie todas as competências antes de continuar.");
      return;
    }
    updateFormData({ autoavaliacao: notas });
    onNext();
  };

  // Pontuação parcial para feedback visual
  const somaAtual = Object.values(notas).reduce((a, b) => a + b, 0);
  const percentual = Math.round((somaAtual / 25) * 100);

  return (
    <div className="step-card">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-sm">
          <Star className="w-5 h-5 text-white fill-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-600">Autoavaliação profissional</h2>
          <p className="text-slate-500 text-sm">Avalie suas competências honestamente</p>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-5 text-sm text-blue-700">
        💡 <strong>Seja honesto(a)!</strong> Não há resposta certa ou errada. Esta avaliação
        nos ajuda a entender seu perfil e a encontrar a melhor oportunidade para você.
      </div>

      <div className="space-y-5">
        {competencias.map((comp) => (
          <div key={comp.key} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50">
            <div className="flex items-start gap-2 mb-3">
              <span className="text-xl">{comp.icon}</span>
              <div>
                <p className="font-semibold text-navy-600 text-sm">{comp.label}</p>
                <p className="text-xs text-slate-500">{comp.desc}</p>
              </div>
            </div>
            <StarRating
              name={comp.key}
              value={notas[comp.key]}
              onChange={(v) => updateNota(comp.key, v)}
            />
          </div>
        ))}
      </div>

      {/* Barra de progresso interna */}
      <div className="mt-5 p-4 bg-brand-light rounded-xl border border-navy-100">
        <div className="flex justify-between items-center mb-1 text-xs font-medium text-navy-600">
          <span>Sua pontuação parcial</span>
          <span>{somaAtual}/25 pontos</span>
        </div>
        <div className="w-full bg-white rounded-full h-2 overflow-hidden border border-navy-100">
          <div
            className="bg-gradient-brand h-2 rounded-full transition-all duration-300"
            style={{ width: `${percentual}%` }}
          />
        </div>
        <p className="text-xs text-navy-400 mt-1">
          Pontuação da autoavaliação contribui com até 60% da nota total
        </p>
      </div>

      {erro && (
        <p className="error-msg mt-3 text-center justify-center">{erro}</p>
      )}

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
