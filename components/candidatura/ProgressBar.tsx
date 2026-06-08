"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function ProgressBar({ currentStep, totalSteps, stepLabels }: ProgressBarProps) {
  const progress = Math.round((currentStep / (totalSteps - 1)) * 100);

  return (
    <div className="mb-6">
      {/* Rótulo da etapa atual */}
      <div className="flex justify-between items-center mb-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          Etapa {currentStep} de {totalSteps - 1}
        </p>
        <p className="text-xs font-bold text-navy-600">{progress}% concluído</p>
      </div>

      {/* Barra de progresso */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-brand h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Nome da etapa atual */}
      {stepLabels[currentStep] && (
        <p className="text-sm font-medium text-navy-600 mt-2">
          {stepLabels[currentStep]}
        </p>
      )}
    </div>
  );
}
