import { CheckCircle, Home, Clock, Mail } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Candidatura Enviada!",
};

export default async function ConfirmacaoPage({
  params,
}: {
  params: Promise<{ protocolo: string }>;
}) {
  const { protocolo } = await params;

  return (
    <div className="min-h-screen bg-brand-surface flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-md w-full text-center">
        {/* Ícone de sucesso */}
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <CheckCircle className="w-14 h-14 text-emerald-500" />
        </div>

        <h1 className="text-3xl font-extrabold text-navy-600 mb-3">
          Candidatura enviada! 🎉
        </h1>
        <p className="text-slate-600 mb-6 leading-relaxed">
          Recebemos seu currículo com sucesso. Nossa equipe de RH irá analisar seu
          perfil e entraremos em contato em breve.
        </p>

        {/* Protocolo */}
        <div className="card bg-brand-light border border-navy-100 mb-6 text-left">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-semibold">
            Número do Protocolo
          </p>
          <p className="text-2xl font-bold text-navy-600 font-mono tracking-wider">
            {protocolo}
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Guarde este número para acompanhamento. Em caso de dúvidas, entre em contato
            citando este protocolo.
          </p>
        </div>

        {/* O que acontece agora */}
        <div className="card text-left mb-6">
          <h2 className="font-bold text-navy-600 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> O que acontece agora?
          </h2>
          <ol className="space-y-3">
            {[
              { emoji: "📧", texto: "Você receberá um e-mail de confirmação" },
              { emoji: "🔍", texto: "Nossa equipe de RH irá analisar seu perfil" },
              { emoji: "📞", texto: "Se houver compatibilidade, entraremos em contato" },
              { emoji: "🤝", texto: "Candidatos selecionados serão convocados para entrevista" },
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                <span className="text-lg leading-tight">{item.emoji}</span>
                <span>{item.texto}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Info LGPD */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 mb-6 text-left">
          <p className="text-xs text-slate-500 flex items-start gap-2">
            <Mail className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
            Para solicitar acesso, correção ou exclusão dos seus dados, entre em contato
            com nosso setor de RH e informe o protocolo acima.
          </p>
        </div>

        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 w-full justify-center text-base"
        >
          <Home className="w-5 h-5" />
          Voltar para o início
        </Link>
      </div>
    </div>
  );
}
