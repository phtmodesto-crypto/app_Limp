"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepDadosPessoaisSchema } from "@/lib/validations";
import type { FormData } from "./MultiStepForm";
import { ChevronRight, ChevronLeft, User } from "lucide-react";
import { z } from "zod";

type StepData = z.infer<typeof stepDadosPessoaisSchema>;

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

interface Props {
  formData: FormData;
  updateFormData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepDadosPessoais({ formData, updateFormData, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepData>({
    resolver: zodResolver(stepDadosPessoaisSchema),
    defaultValues: {
      nomeCompleto: formData.nomeCompleto,
      dataNasc: formData.dataNasc,
      telefone: formData.telefone,
      whatsapp: formData.whatsapp,
      email: formData.email,
      cidade: formData.cidade,
      estado: formData.estado,
    },
  });

  const onSubmit = (data: StepData) => {
    updateFormData(data);
    onNext();
  };

  return (
    <div className="step-card">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-sm">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-600">Dados pessoais</h2>
          <p className="text-slate-500 text-sm">Preencha seus dados de contato</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
        {/* Nome */}
        <div>
          <label className="label-field" htmlFor="nomeCompleto">
            Nome completo <span className="text-red-500">*</span>
          </label>
          <input
            id="nomeCompleto"
            type="text"
            autoComplete="name"
            placeholder="Ex.: Maria Silva Santos"
            className={`input-field ${errors.nomeCompleto ? "input-error" : ""}`}
            {...register("nomeCompleto")}
          />
          {errors.nomeCompleto && (
            <p className="error-msg">{errors.nomeCompleto.message}</p>
          )}
        </div>

        {/* Data de nascimento */}
        <div>
          <label className="label-field" htmlFor="dataNasc">
            Data de nascimento <span className="text-red-500">*</span>
          </label>
          <input
            id="dataNasc"
            type="date"
            autoComplete="bday"
            max={new Date().toISOString().split("T")[0]}
            className={`input-field ${errors.dataNasc ? "input-error" : ""}`}
            {...register("dataNasc")}
          />
          {errors.dataNasc && (
            <p className="error-msg">{errors.dataNasc.message}</p>
          )}
        </div>

        {/* Telefone + WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="label-field" htmlFor="telefone">
              Telefone / WhatsApp <span className="text-red-500">*</span>
            </label>
            <input
              id="telefone"
              type="tel"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              className={`input-field ${errors.telefone ? "input-error" : ""}`}
              {...register("telefone")}
            />
            {errors.telefone && (
              <p className="error-msg">{errors.telefone.message}</p>
            )}
          </div>
          <div>
            <label className="label-field" htmlFor="whatsapp">
              WhatsApp (se diferente)
            </label>
            <input
              id="whatsapp"
              type="tel"
              autoComplete="tel"
              placeholder="(11) 99999-9999"
              className={`input-field ${errors.whatsapp ? "input-error" : ""}`}
              {...register("whatsapp")}
            />
            {errors.whatsapp && (
              <p className="error-msg">{errors.whatsapp.message}</p>
            )}
          </div>
        </div>

        {/* E-mail */}
        <div>
          <label className="label-field" htmlFor="email">
            E-mail <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="seu@email.com"
            className={`input-field ${errors.email ? "input-error" : ""}`}
            {...register("email")}
          />
          {errors.email && (
            <p className="error-msg">{errors.email.message}</p>
          )}
          <p className="text-xs text-slate-400 mt-1">
            Usaremos este e-mail somente para comunicações sobre sua candidatura
          </p>
        </div>

        {/* Cidade + Estado */}
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <label className="label-field" htmlFor="cidade">
              Cidade <span className="text-red-500">*</span>
            </label>
            <input
              id="cidade"
              type="text"
              placeholder="São Paulo"
              className={`input-field ${errors.cidade ? "input-error" : ""}`}
              {...register("cidade")}
            />
            {errors.cidade && (
              <p className="error-msg">{errors.cidade.message}</p>
            )}
          </div>
          <div>
            <label className="label-field" htmlFor="estado">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              id="estado"
              className={`input-field ${errors.estado ? "input-error" : ""}`}
              {...register("estado")}
            >
              <option value="">UF</option>
              {estados.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            {errors.estado && (
              <p className="error-msg">{errors.estado.message}</p>
            )}
          </div>
        </div>

        {/* Navegação */}
        <div className="flex gap-3 pt-4">
          <button type="button" onClick={onBack} className="btn-secondary flex items-center gap-2">
            <ChevronLeft className="w-4 h-4" /> Voltar
          </button>
          <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2">
            Continuar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
