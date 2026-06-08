"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "./ProgressBar";
import { StepWelcome } from "./StepWelcome";
import { StepDadosPessoais } from "./StepDadosPessoais";
import { StepVaga } from "./StepVaga";
import { StepExperiencia } from "./StepExperiencia";
import { StepFormacao } from "./StepFormacao";
import { StepAutoavaliacao } from "./StepAutoavaliacao";
import { StepUpload } from "./StepUpload";
import { StepLGPD } from "./StepLGPD";
import { StepRevisao } from "./StepRevisao";

const STORAGE_KEY = "limpservice_form_data";

export interface FormData {
  // Pessoais
  nomeCompleto: string;
  dataNasc: string;
  telefone: string;
  whatsapp: string;
  email: string;
  cidade: string;
  estado: string;
  // Vaga
  cargo: string;
  turno: string[];
  pretensaoSalarial: string;
  // Experiência
  experiencias: Experiencia[];
  // Formação
  escolaridade: string;
  cursos: Curso[];
  // Autoavaliação
  autoavaliacao: {
    pontualidade: number;
    trabalhoEquipe: number;
    proatividade: number;
    atencaoSeguranca: number;
    comunicacao: number;
  };
  // Upload
  curriculoUrl: string;
  curriculoNome: string;
  curriculoTipo: string;
  curriculoTamanho: number;
  // LGPD
  lgpdAceite: boolean;
  lgpdDataHora: string;
}

export interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  dataInicio: string;
  dataFim: string;
  empregoAtual: boolean;
  atividades: string;
}

export interface Curso {
  id: string;
  nome: string;
  instituicao: string;
  ano: string;
}

const defaultFormData: FormData = {
  nomeCompleto: "",
  dataNasc: "",
  telefone: "",
  whatsapp: "",
  email: "",
  cidade: "",
  estado: "",
  cargo: "",
  turno: [],
  pretensaoSalarial: "",
  experiencias: [],
  escolaridade: "",
  cursos: [],
  autoavaliacao: {
    pontualidade: 3,
    trabalhoEquipe: 3,
    proatividade: 3,
    atencaoSeguranca: 3,
    comunicacao: 3,
  },
  curriculoUrl: "",
  curriculoNome: "",
  curriculoTipo: "",
  curriculoTamanho: 0,
  lgpdAceite: false,
  lgpdDataHora: "",
};

const STEP_LABELS = [
  "Boas-vindas",
  "Dados pessoais",
  "Vaga de interesse",
  "Experiência profissional",
  "Formação e cursos",
  "Autoavaliação profissional",
  "Upload do currículo",
  "Autorização LGPD",
  "Revisão e envio",
];

const TOTAL_STEPS = STEP_LABELS.length; // 9 (0–8)

export function MultiStepForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Recupera dados do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      // ignora erro de parse
    }
  }, []);

  // Salva dados no localStorage ao alterar
  const updateFormData = useCallback((partial: Partial<FormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignora quota error
      }
      return next;
    });
  }, []);

  const goNext = useCallback(() => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const payload = {
        ...formData,
        pretensaoSalarial: formData.pretensaoSalarial
          ? parseFloat(formData.pretensaoSalarial)
          : null,
        turno: formData.turno,
        lgpdDataHora: formData.lgpdDataHora || new Date().toISOString(),
        _hp: "", // honeypot — vazio
      };

      const res = await fetch("/api/candidaturas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Erro ao enviar candidatura. Tente novamente.");
      }

      const data = await res.json();
      // Limpa dados do localStorage após envio
      localStorage.removeItem(STORAGE_KEY);
      router.push(`/confirmacao/${data.protocolo}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setSubmitting(false);
    }
  };

  const commonProps = {
    formData,
    updateFormData,
    onNext: goNext,
    onBack: goBack,
  };

  return (
    <div>
      {/* Barra de progresso — oculta na tela de boas-vindas */}
      {step > 0 && (
        <ProgressBar
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          stepLabels={STEP_LABELS}
        />
      )}

      {/* Steps */}
      {step === 0 && <StepWelcome onNext={goNext} />}
      {step === 1 && <StepDadosPessoais {...commonProps} />}
      {step === 2 && <StepVaga {...commonProps} />}
      {step === 3 && <StepExperiencia {...commonProps} />}
      {step === 4 && <StepFormacao {...commonProps} />}
      {step === 5 && <StepAutoavaliacao {...commonProps} />}
      {step === 6 && <StepUpload {...commonProps} />}
      {step === 7 && <StepLGPD {...commonProps} />}
      {step === 8 && (
        <StepRevisao
          {...commonProps}
          onSubmit={handleSubmit}
          submitting={submitting}
          submitError={submitError}
        />
      )}
    </div>
  );
}
