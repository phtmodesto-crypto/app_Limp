import { CheckCircle, Home, Clock, Mail, Search, AlertTriangle } from "lucide-react";
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
        <div className="card bg-brand-light border border-navy-100 mb-4 text-left">
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1 font-semibold">
            Número do Protocolo
          </p>
          <p className="text-2xl font-bold text-navy-600 font-mono tracking-wider">
            {protocolo}
          </p>
          <p className="text-xs text-red-600 font-semibold mt-2 flex items-start gap-1">
            ⚠️ Anote ou tire um print deste número agora. Após fechar esta página não será possível recuperá-lo.
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Em caso de dúvidas, entre em contato com o RH citando este protocolo.
          </p>
        </div>

        {/* Aviso importante — acompanhamento */}
        <div className="border-2 border-amber-300 bg-amber-50 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <p className="text-sm font-bold text-amber-800 uppercase tracking-wide">Importante</p>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed mb-3">
            Com este número de protocolo você pode acompanhar em qual fase sua candidatura
            se encontra — <strong>Recebida, Em Análise, Entrevista ou Aprovado</strong> —
            sem precisar de login ou cadastro.
          </p>
          <Link
            href={`/acompanhar?protocolo=${protocolo}`}
            className="inline-flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white
                       font-semibold text-sm px-4 py-2 rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            Acompanhar minha candidatura
          </Link>
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
