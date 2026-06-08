"use client";

import { Star, Clock, Shield, CheckCircle, ChevronRight } from "lucide-react";

interface StepWelcomeProps {
  onNext: () => void;
}

export function StepWelcome({ onNext }: StepWelcomeProps) {
  return (
    <div className="step-card">
      {/* Logo / brand */}
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-gradient-brand rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-step">
          <Star className="w-10 h-10 text-white fill-white" />
        </div>
        <h1 className="text-2xl font-extrabold text-navy-600 mb-1">
          Grupo Limpservice
        </h1>
        <p className="text-cyan-500 font-semibold text-sm">25 Anos de Excelência em Serviços</p>
      </div>

      {/* Mensagem de boas-vindas */}
      <div className="bg-brand-light rounded-xl p-5 mb-6 border border-navy-100">
        <h2 className="text-xl font-bold text-navy-600 mb-2">
          Olá! Bem-vindo(a) ao nosso processo seletivo 👋
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          Ficamos felizes com o seu interesse em fazer parte do nosso time! Em apenas
          alguns minutos, você poderá enviar suas informações profissionais para nossa
          equipe de RH.
        </p>
      </div>

      {/* Informações do processo */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Clock className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-700 text-sm">Tempo estimado</p>
            <p className="text-slate-500 text-xs">Cerca de 8 minutos para preencher todas as etapas</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <CheckCircle className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-700 text-sm">Preenchimento parcial</p>
            <p className="text-slate-500 text-xs">Suas respostas são salvas automaticamente. Você pode pausar e continuar depois</p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <Shield className="w-5 h-5 text-cyan-500 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-slate-700 text-sm">Seus dados estão seguros</p>
            <p className="text-slate-500 text-xs">Protegidos pela Lei Geral de Proteção de Dados (LGPD). Usados exclusivamente para recrutamento</p>
          </div>
        </div>
      </div>

      {/* Etapas resumidas */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
          O que você vai preencher:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            "Dados pessoais",
            "Vaga de interesse",
            "Experiência",
            "Formação",
            "Autoavaliação",
            "Currículo (opcional)",
            "Consentimento LGPD",
          ].map((item) => (
            <span
              key={item}
              className="bg-brand-light text-navy-600 text-xs font-medium px-3 py-1 rounded-full border border-navy-100"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="btn-primary w-full flex items-center justify-center gap-2 text-lg"
      >
        Iniciar candidatura
        <ChevronRight className="w-5 h-5" />
      </button>

      <p className="text-center text-xs text-slate-400 mt-4">
        Ao iniciar, você concorda que seus dados serão tratados para fins de recrutamento.
      </p>
    </div>
  );
}
