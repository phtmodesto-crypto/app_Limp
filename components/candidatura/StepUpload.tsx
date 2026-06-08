"use client";

import { useState, useCallback } from "react";
import type { FormData } from "./MultiStepForm";
import { ChevronRight, ChevronLeft, Upload, FileText, X, CheckCircle } from "lucide-react";

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ["application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
const ALLOWED_EXT = [".pdf", ".doc", ".docx"];

interface Props {
  formData: FormData;
  updateFormData: (partial: Partial<FormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepUpload({ formData, updateFormData, onNext, onBack }: Props) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState(formData.curriculoNome || "");
  const [uploaded, setUploaded] = useState(!!formData.curriculoUrl);

  const handleFile = useCallback(
    async (file: File) => {
      setUploadError("");

      if (!ALLOWED_TYPES.includes(file.type)) {
        setUploadError("Tipo de arquivo inválido. Use PDF, DOC ou DOCX.");
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`Arquivo muito grande. Tamanho máximo: ${MAX_SIZE_MB} MB.`);
        return;
      }

      setUploading(true);
      setFileName(file.name);

      try {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formDataUpload,
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Erro no upload");
        }

        const data = await res.json();
        updateFormData({
          curriculoUrl: data.url,
          curriculoNome: file.name,
          curriculoTipo: file.type,
          curriculoTamanho: file.size,
        });
        setUploaded(true);
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Erro no upload. Tente novamente.");
        setFileName("");
        setUploaded(false);
      } finally {
        setUploading(false);
      }
    },
    [updateFormData]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const removeFile = () => {
    updateFormData({ curriculoUrl: "", curriculoNome: "", curriculoTipo: "", curriculoTamanho: 0 });
    setFileName("");
    setUploaded(false);
    setUploadError("");
  };

  return (
    <div className="step-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center shadow-sm">
          <Upload className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-600">Upload do currículo</h2>
          <p className="text-slate-500 text-sm">Opcional — mas aumenta suas chances!</p>
        </div>
      </div>

      <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-3 mb-5 text-sm text-emerald-700">
        ✅ <strong>Esta etapa é opcional.</strong> Você pode prosseguir sem fazer upload,
        mas enviar seu currículo em PDF ou DOCX aumenta significativamente sua pontuação.
      </div>

      {/* Área de upload */}
      {!uploaded ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
            dragOver
              ? "border-navy-400 bg-brand-light"
              : "border-slate-200 bg-slate-50 hover:border-slate-300"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-navy-200 border-t-navy-600 rounded-full animate-spin" />
              <p className="text-sm text-slate-600 font-medium">Enviando arquivo…</p>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="font-semibold text-slate-600 mb-1">
                Arraste seu currículo aqui
              </p>
              <p className="text-sm text-slate-400 mb-4">
                ou clique para selecionar um arquivo
              </p>
              <label
                htmlFor="curriculo-input"
                className="btn-outline cursor-pointer text-sm px-6 py-2.5"
              >
                Selecionar arquivo
              </label>
              <input
                id="curriculo-input"
                type="file"
                accept={ALLOWED_EXT.join(",")}
                className="hidden"
                onChange={handleInputChange}
              />
              <p className="text-xs text-slate-400 mt-4">
                PDF, DOC ou DOCX · Máximo {MAX_SIZE_MB} MB
              </p>
            </>
          )}
        </div>
      ) : (
        <div className="border-2 border-emerald-200 bg-emerald-50 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-emerald-700 text-sm truncate">{fileName}</p>
            <div className="flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle className="w-3 h-3" />
              Arquivo enviado com sucesso
            </div>
          </div>
          <button
            type="button"
            onClick={removeFile}
            className="text-slate-400 hover:text-red-500 transition-colors"
            title="Remover arquivo"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {uploadError && (
        <p className="error-msg mt-3">{uploadError}</p>
      )}

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onBack} className="btn-secondary flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Voltar
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={uploading}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {uploaded ? "Continuar com currículo" : "Continuar sem currículo"}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
