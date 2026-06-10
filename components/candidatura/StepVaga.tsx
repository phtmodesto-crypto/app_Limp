"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { stepVagaSchema } from "@/lib/validations";
import type { FormData } from "./MultiStepForm";
import { ChevronRight, ChevronLeft, Briefcase } from "lucide-react";
import { z } from "zod";

type StepData = z.infer<typeof stepVagaSchema>;

const cargos = [
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

const turnos = [
  { value: "Noite (22h–06h)", label: "Noite", desc: "22h às 06h" },
  { value: "Comercial", label: "Comercial", desc: "08h às 18h" },
  { value: "12×36 diurno", label: "12×36 Diurno", desc: "Escala 12×36, dia" },
  { value: "12×36 noturno", label: "12×36 Noturno", desc: "Escala 12×36, noite" },
];

interface Props {
  formData: FormData;
  updateFormData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepVaga({ formData, updateFormData, onNext, onBack }: Props) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<StepData & { pretensaoSalarial?: string }>({
    resolver: zodResolver(stepVagaSchema),
    defaultValues: {
      cargo: formData.cargo,
      turno: formData.turno,
    },
  });

  const turnoWatch = watch("turno");

  const onSubmit = (data: StepData) => {
    updateFormData({
      cargo: data.cargo,
      turno: data.turno,
      pretensaoSalarial: formData.pretensaoSalarial,
    });
    onNext();
  };

  return (
    <div className="step-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-sm">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-600">Vaga de interesse</h2>
          <p className="text-slate-500 text-sm">Selecione o cargo e sua disponibilidade</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {/* Cargo */}
        <div>
          <label className="label-field" htmlFor="cargo">
            Cargo desejado <span className="text-red-500">*</span>
          </label>
          <select
            id="cargo"
            className={`input-field ${errors.cargo ? "input-error" : ""}`}
            {...register("cargo")}
          >
            <option value="">Selecione uma vaga…</option>
            {cargos.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.cargo && (
            <p className="error-msg">{errors.cargo.message}</p>
          )}
        </div>

        {/* Turno (múltipla escolha) */}
        <div>
          <label className="label-field">
            Disponibilidade de turno <span className="text-red-500">*</span>
          </label>
          <p className="text-xs text-slate-400 mb-3">
            Selecione todos os turnos em que você está disponível
          </p>
          <Controller
            name="turno"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-2 gap-2">
                {turnos.map((t) => {
                  const checked = (field.value || []).includes(t.value);
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => {
                        const current = field.value || [];
                        const next = checked
                          ? current.filter((v) => v !== t.value)
                          : [...current, t.value];
                        field.onChange(next);
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        checked
                          ? "border-navy-600 bg-brand-light text-navy-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <p className="font-semibold text-sm">{t.label}</p>
                      <p className="text-xs opacity-70">{t.desc}</p>
                    </button>
                  );
                })}
              </div>
            )}
          />
          {errors.turno && (
            <p className="error-msg mt-2">{errors.turno.message}</p>
          )}
        </div>

        {/* Pretensão salarial (opcional) */}
        <div>
          <label className="label-field" htmlFor="pretensao">
            Pretensão salarial{" "}
            <span className="text-slate-400 font-normal">(opcional)</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">
              R$
            </span>
            <input
              id="pretensao"
              type="number"
              min={0}
              step={0.01}
              placeholder="0,00"
              className="input-field pl-10"
              value={formData.pretensaoSalarial}
              onChange={(e) => updateFormData({ pretensaoSalarial: e.target.value })}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Deixe em branco se preferir não informar
          </p>
        </div>

        <div className="flex gap-3 pt-2">
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
