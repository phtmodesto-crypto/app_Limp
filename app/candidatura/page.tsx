import type { Metadata } from "next";
import { MultiStepForm } from "@/components/candidatura/MultiStepForm";
import { Star } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Envie seu Currículo",
  description: "Candidate-se a uma vaga no Grupo Limpservice. Processo simples e rápido.",
};

export default function CandidaturaPage() {
  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header compacto */}
      <header className="bg-gradient-brand shadow-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Grupo Limpservice</p>
              <p className="text-cyan-200 text-xs hidden sm:block">25 Anos de Excelência</p>
            </div>
          </Link>
          <p className="text-white/70 text-xs sm:text-sm">
            Envie seu currículo • ~8 min
          </p>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        <MultiStepForm />
      </main>

      <footer className="text-center py-6 text-xs text-slate-400">
        <p>Seus dados são protegidos pela LGPD · © {new Date().getFullYear()} Grupo Limpservice</p>
      </footer>
    </div>
  );
}
