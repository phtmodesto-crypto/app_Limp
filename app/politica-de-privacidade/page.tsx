import Link from "next/link";
import { Star, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade — Grupo Limpservice",
};

export default function PoliticaPrivacidade() {
  return (
    <div className="min-h-screen bg-brand-surface">
      <header className="bg-gradient-brand shadow-md">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/" className="text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Star className="w-6 h-6 text-white fill-white" />
            <span className="text-white font-bold">Grupo Limpservice</span>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-10">
        <div className="card">
          <h1 className="text-2xl font-bold text-navy-600 mb-2">Política de Privacidade</h1>
          <p className="text-slate-500 text-sm mb-6">
            Última atualização: {new Date().toLocaleDateString("pt-BR")}
          </p>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-5">
            <section>
              <h2 className="text-lg font-bold text-navy-600 mb-2">1. Quem somos</h2>
              <p className="text-slate-600">
                O <strong>Grupo Limpservice</strong> é uma empresa de terceirização de serviços com
                mais de 25 anos de atuação no mercado nacional. Neste documento, descrevemos como
                tratamos os dados pessoais coletados por meio do nosso sistema de recrutamento online.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-600 mb-2">2. Dados coletados</h2>
              <p className="text-slate-600 mb-2">Coletamos os seguintes dados no formulário de candidatura:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Dados de identificação: nome completo, data de nascimento</li>
                <li>Dados de contato: telefone, WhatsApp, e-mail</li>
                <li>Dados de localização: cidade e estado</li>
                <li>Dados profissionais: cargo desejado, histórico de experiências, formação</li>
                <li>Autoavaliação de competências profissionais</li>
                <li>Currículo (PDF/DOCX), quando enviado voluntariamente</li>
                <li>Data e hora do consentimento LGPD</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-600 mb-2">3. Finalidade do tratamento</h2>
              <p className="text-slate-600">
                Os dados coletados são utilizados <strong>exclusivamente para fins de recrutamento
                e seleção de pessoal</strong>, incluindo avaliação de perfil profissional, contato
                com candidatos selecionados e arquivamento para futuras oportunidades compatíveis.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-600 mb-2">4. Base legal</h2>
              <p className="text-slate-600">
                O tratamento é realizado com base no <strong>consentimento do titular</strong>
                (art. 7º, I da LGPD), manifestado por meio do checkbox de aceite no formulário
                de candidatura. O consentimento pode ser revogado a qualquer momento.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-600 mb-2">5. Compartilhamento</h2>
              <p className="text-slate-600">
                Os dados são acessados apenas pelos profissionais de RH do Grupo Limpservice
                responsáveis pelo processo seletivo. <strong>Não compartilhamos seus dados com
                terceiros</strong> sem nova autorização, salvo obrigação legal.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-600 mb-2">6. Retenção dos dados</h2>
              <p className="text-slate-600">
                Os dados são mantidos durante o processo seletivo e por um período razoável
                após seu encerramento, para fins de recrutamento em oportunidades futuras.
                Após esse período, ou mediante solicitação, os dados são eliminados ou anonimizados.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-600 mb-2">7. Seus direitos</h2>
              <p className="text-slate-600 mb-2">Em conformidade com a LGPD, você tem direito a:</p>
              <ul className="list-disc list-inside text-slate-600 space-y-1">
                <li>Confirmar a existência de tratamento de seus dados</li>
                <li>Acessar seus dados</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a portabilidade dos dados</li>
                <li>Solicitar a exclusão (anonimização) dos seus dados</li>
                <li>Revogar o consentimento</li>
              </ul>
              <p className="text-slate-600 mt-2">
                Para exercer qualquer desses direitos, entre em contato com nosso setor de RH,
                informando o protocolo de sua candidatura.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-600 mb-2">8. Segurança</h2>
              <p className="text-slate-600">
                Adotamos medidas técnicas e organizacionais para proteger seus dados contra
                acesso não autorizado, perda ou alteração, incluindo controle de acesso ao
                painel administrativo e armazenamento seguro dos arquivos.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-navy-600 mb-2">9. Contato</h2>
              <p className="text-slate-600">
                Dúvidas sobre esta política ou sobre o tratamento dos seus dados podem ser
                enviadas ao nosso setor de RH pelos canais oficiais do Grupo Limpservice.
              </p>
            </section>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar para o início
          </Link>
        </div>
      </main>
    </div>
  );
}
