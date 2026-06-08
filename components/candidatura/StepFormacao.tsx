"use client";

import { useState } from "react";
import type { FormData, Curso } from "./MultiStepForm";
import { ChevronRight, ChevronLeft, GraduationCap, Plus, Trash2 } from "lucide-react";
import { v4 as uuid } from "uuid";

const escolaridades = [
  "Ensino Fundamental Incompleto",
  "Ensino Fundamental Completo",
  "Ensino Médio Incompleto",
  "Ensino Médio Completo",
  "Ensino Técnico / Profissionalizante",
  "Ensino Superior Incompleto",
  "Ensino Superior Completo",
  "Pós-Graduação / MBA",
  "Mestrado",
  "Doutorado",
];

interface Props {
  formData: FormData;
  updateFormData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepFormacao({ formData, updateFormData, onNext, onBack }: Props) {
  const [escolaridade, setEscolaridade] = useState(formData.escolaridade);
  const [cursos, setCursos] = useState<Curso[]>(formData.cursos);
  const [erros, setErros] = useState<Record<string, string>>({});

  const addCurso = () => {
    setCursos((prev) => [...prev, { id: uuid(), nome: "", instituicao: "", ano: "" }]);
  };

  const removeCurso = (id: string) => {
    setCursos((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCurso = (id: string, field: keyof Curso, value: string) => {
    setCursos((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const validate = () => {
    const novosErros: Record<string, string> = {};
    if (!escolaridade) novosErros.escolaridade = "Escolaridade obrigatória";
    cursos.forEach((c) => {
      if (!c.nome.trim()) novosErros[c.id + "_nome"] = "Nome do curso obrigatório";
    });
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      updateFormData({ escolaridade, cursos });
      onNext();
    }
  };

  const anoAtual = new Date().getFullYear();
  const anos = Array.from({ length: 30 }, (_, i) => String(anoAtual - i));

  return (
    <div className="step-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-sm">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-600">Formação e cursos</h2>
          <p className="text-slate-500 text-sm">Escolaridade e cursos complementares</p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Escolaridade */}
        <div>
          <label className="label-field" htmlFor="escolaridade">
            Escolaridade <span className="text-red-500">*</span>
          </label>
          <select
            id="escolaridade"
            className={`input-field ${erros.escolaridade ? "input-error" : ""}`}
            value={escolaridade}
            onChange={(e) => {
              setEscolaridade(e.target.value);
              if (erros.escolaridade) setErros((p) => ({ ...p, escolaridade: "" }));
            }}
          >
            <option value="">Selecione seu nível de escolaridade…</option>
            {escolaridades.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
          {erros.escolaridade && (
            <p className="error-msg">{erros.escolaridade}</p>
          )}
        </div>

        {/* Cursos */}
        <div>
          <label className="label-field">
            Cursos complementares{" "}
            <span className="text-slate-400 font-normal">(opcional)</span>
          </label>
          <p className="text-xs text-slate-400 mb-3">
            Cursos técnicos, idiomas, informática, segurança do trabalho, etc.
          </p>

          <div className="space-y-3">
            {cursos.map((curso, idx) => (
              <div key={curso.id} className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-slate-500">Curso #{idx + 1}</p>
                  <button
                    type="button"
                    onClick={() => removeCurso(curso.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Nome do curso *"
                      className={`input-field py-2 text-sm ${erros[curso.id + "_nome"] ? "input-error" : ""}`}
                      value={curso.nome}
                      onChange={(e) => updateCurso(curso.id, "nome", e.target.value)}
                    />
                    {erros[curso.id + "_nome"] && (
                      <p className="error-msg text-xs">{erros[curso.id + "_nome"]}</p>
                    )}
                  </div>
                  <div>
                    <select
                      className="input-field py-2 text-sm"
                      value={curso.ano}
                      onChange={(e) => updateCurso(curso.id, "ano", e.target.value)}
                    >
                      <option value="">Ano</option>
                      {anos.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="sm:col-span-3">
                    <input
                      type="text"
                      placeholder="Instituição (opcional)"
                      className="input-field py-2 text-sm"
                      value={curso.instituicao}
                      onChange={(e) => updateCurso(curso.id, "instituicao", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addCurso}
            className="w-full mt-2 border-2 border-dashed border-slate-200 text-slate-500
                       hover:border-navy-300 hover:text-navy-600 rounded-xl py-2.5
                       flex items-center justify-center gap-2 transition-all text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Adicionar curso
          </button>
        </div>
      </div>

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
