"use client";

import { useState } from "react";
import type { FormData, Experiencia } from "./MultiStepForm";
import { ChevronRight, ChevronLeft, Briefcase, Plus, Trash2 } from "lucide-react";
import { v4 as uuid } from "uuid";

interface Props {
  formData: FormData;
  updateFormData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

const emptyExp = (): Experiencia => ({
  id: uuid(),
  empresa: "",
  cargo: "",
  dataInicio: "",
  dataFim: "",
  empregoAtual: false,
  atividades: "",
});

export function StepExperiencia({ formData, updateFormData, onNext, onBack }: Props) {
  const [exps, setExps] = useState<Experiencia[]>(
    formData.experiencias.length > 0 ? formData.experiencias : []
  );
  const [erros, setErros] = useState<Record<string, string>>({});

  const addExp = () => {
    setExps((prev) => [...prev, emptyExp()]);
  };

  const removeExp = (id: string) => {
    setExps((prev) => prev.filter((e) => e.id !== id));
    setErros((prev) => {
      const next = { ...prev };
      delete next[id + "_empresa"];
      delete next[id + "_cargo"];
      delete next[id + "_dataInicio"];
      return next;
    });
  };

  const updateExp = (id: string, field: keyof Experiencia, value: string | boolean) => {
    setExps((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const validate = () => {
    const novosErros: Record<string, string> = {};
    exps.forEach((e) => {
      if (!e.empresa.trim()) novosErros[e.id + "_empresa"] = "Empresa obrigatória";
      if (!e.cargo.trim()) novosErros[e.id + "_cargo"] = "Cargo obrigatório";
      if (!e.dataInicio) novosErros[e.id + "_dataInicio"] = "Data de início obrigatória";
    });
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      updateFormData({ experiencias: exps });
      onNext();
    }
  };

  return (
    <div className="step-card">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-sm">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-600">Experiência profissional</h2>
          <p className="text-slate-500 text-sm">Informe seus empregos anteriores</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-5 text-sm text-amber-700">
        💡 <strong>Dica:</strong> Se você não tem experiência formal, pode informar trabalhos
        informais, voluntariados ou serviços prestados. Esta seção é opcional.
      </div>

      {/* Lista de experiências */}
      <div className="space-y-4">
        {exps.map((exp, idx) => (
          <div key={exp.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 relative">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-navy-600 text-sm">
                Experiência #{idx + 1}
              </p>
              <button
                type="button"
                onClick={() => removeExp(exp.id)}
                className="text-red-400 hover:text-red-600 transition-colors p-1"
                title="Remover experiência"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="label-field text-xs" htmlFor={`empresa_${exp.id}`}>Empresa *</label>
                <input
                  id={`empresa_${exp.id}`}
                  type="text"
                  placeholder="Nome da empresa"
                  className={`input-field py-2 text-sm ${erros[exp.id + "_empresa"] ? "input-error" : ""}`}
                  value={exp.empresa}
                  onChange={(e) => updateExp(exp.id, "empresa", e.target.value)}
                />
                {erros[exp.id + "_empresa"] && (
                  <p className="error-msg text-xs">{erros[exp.id + "_empresa"]}</p>
                )}
              </div>

              <div>
                <label className="label-field text-xs" htmlFor={`cargo_${exp.id}`}>Cargo / Função *</label>
                <input
                  id={`cargo_${exp.id}`}
                  type="text"
                  placeholder="Ex.: Auxiliar de Limpeza"
                  className={`input-field py-2 text-sm ${erros[exp.id + "_cargo"] ? "input-error" : ""}`}
                  value={exp.cargo}
                  onChange={(e) => updateExp(exp.id, "cargo", e.target.value)}
                />
                {erros[exp.id + "_cargo"] && (
                  <p className="error-msg text-xs">{erros[exp.id + "_cargo"]}</p>
                )}
              </div>

              <div>
                <label className="label-field text-xs" htmlFor={`ini_${exp.id}`}>Data de início *</label>
                <input
                  id={`ini_${exp.id}`}
                  type="month"
                  className={`input-field py-2 text-sm ${erros[exp.id + "_dataInicio"] ? "input-error" : ""}`}
                  value={exp.dataInicio}
                  onChange={(e) => updateExp(exp.id, "dataInicio", e.target.value)}
                />
                {erros[exp.id + "_dataInicio"] && (
                  <p className="error-msg text-xs">{erros[exp.id + "_dataInicio"]}</p>
                )}
              </div>

              <div>
                <label className="label-field text-xs" htmlFor={`fim_${exp.id}`}>
                  Data de saída {exp.empregoAtual && <span className="text-slate-400">(atual)</span>}
                </label>
                <input
                  id={`fim_${exp.id}`}
                  type="month"
                  disabled={exp.empregoAtual}
                  className={`input-field py-2 text-sm ${exp.empregoAtual ? "opacity-50" : ""}`}
                  value={exp.dataFim}
                  onChange={(e) => updateExp(exp.id, "dataFim", e.target.value)}
                />
              </div>
            </div>

            <div className="mt-2 flex items-center gap-2">
              <input
                type="checkbox"
                id={`atual_${exp.id}`}
                checked={exp.empregoAtual}
                onChange={(e) => {
                  updateExp(exp.id, "empregoAtual", e.target.checked);
                  if (e.target.checked) updateExp(exp.id, "dataFim", "");
                }}
                className="w-4 h-4 accent-navy-600 rounded"
              />
              <label htmlFor={`atual_${exp.id}`} className="text-sm text-slate-600 cursor-pointer">
                Ainda trabalho aqui
              </label>
            </div>

            <div className="mt-3">
              <label className="label-field text-xs" htmlFor={`ativ_${exp.id}`}>
                Principais atividades{" "}
                <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <textarea
                id={`ativ_${exp.id}`}
                rows={2}
                maxLength={500}
                placeholder="Descreva brevemente as atividades realizadas…"
                className="input-field py-2 text-sm resize-none"
                value={exp.atividades}
                onChange={(e) => updateExp(exp.id, "atividades", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Botão adicionar */}
      <button
        type="button"
        onClick={addExp}
        className="w-full mt-3 border-2 border-dashed border-slate-200 text-slate-500 hover:border-navy-300
                   hover:text-navy-600 rounded-xl py-3 flex items-center justify-center gap-2 transition-all text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        Adicionar experiência
      </button>

      {/* Navegação */}
      <div className="flex gap-3 mt-6">
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
