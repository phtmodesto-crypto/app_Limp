import Link from "next/link";
import {
  CheckCircle,
  Clock,
  Shield,
  Star,
  Users,
  Briefcase,
  ChevronRight,
} from "lucide-react";

const vagas = [
  { nome: "Auxiliar de Limpeza", icon: "🧹" },
  { nome: "Jardinagem", icon: "🌿" },
  { nome: "Portaria / Recepção", icon: "🏢" },
  { nome: "Serviços Gerais", icon: "🔧" },
  { nome: "Administrativo", icon: "💼" },
  { nome: "Serviços Hospitalares", icon: "🏥" },
];

const etapas = [
  { num: "1", titulo: "Dados pessoais", desc: "Nome, contato e localização" },
  { num: "2", titulo: "Vaga e disponibilidade", desc: "Cargo e turno de interesse" },
  { num: "3", titulo: "Experiência", desc: "Histórico profissional" },
  { num: "4", titulo: "Formação", desc: "Escolaridade e cursos" },
  { num: "5", titulo: "Autoavaliação", desc: "Suas competências profissionais" },
  { num: "6", titulo: "Currículo", desc: "Upload do seu CV (opcional)" },
  { num: "7", titulo: "Consentimento LGPD", desc: "Autorização de dados" },
  { num: "8", titulo: "Revisão e envio", desc: "Confirme suas informações" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-surface">
      {/* Header */}
      <header className="bg-gradient-brand shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Grupo Limpservice</p>
              <p className="text-cyan-200 text-xs">25 Anos de Excelência</p>
            </div>
          </div>
          <Link
            href="/candidatura"
            className="bg-white text-navy-600 font-semibold px-5 py-2 rounded-xl
                       hover:bg-cyan-50 transition-colors text-sm shadow-sm"
          >
            Candidatar-se
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-brand text-white pt-16 pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/15 rounded-full px-4 py-1.5 mb-6 text-sm font-medium">
            <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
            25 anos no mercado de terceirização
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5 leading-tight">
            Faça parte do time<br />
            <span className="text-cyan-300">Limpservice</span>
          </h1>
          <p className="text-white/85 text-lg mb-8 max-w-2xl mx-auto">
            Somos uma empresa sólida, com mais de 25 anos no mercado de terceirização de
            serviços. Buscamos profissionais comprometidos, responsáveis e com vontade de crescer.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/candidatura"
              className="bg-white text-navy-700 font-bold px-8 py-4 rounded-xl
                         hover:bg-cyan-50 transition-all shadow-lg hover:shadow-xl
                         flex items-center justify-center gap-2 text-lg"
            >
              Enviar meu currículo
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="#vagas"
              className="bg-white/15 hover:bg-white/25 text-white font-semibold px-8 py-4
                         rounded-xl transition-all flex items-center justify-center gap-2 text-lg"
            >
              Ver vagas disponíveis
            </a>
          </div>
          <div className="mt-10 flex flex-wrap gap-6 justify-center text-sm text-white/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              ~8 minutos para preencher
            </div>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Dados protegidos pela LGPD
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Processo 100% online
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center hover:shadow-card-hover transition-shadow">
            <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-7 h-7 text-navy-600" />
            </div>
            <h3 className="font-bold text-navy-600 mb-2 text-lg">Empresa sólida</h3>
            <p className="text-slate-500 text-sm">
              Mais de 25 anos atuando no mercado, com clientes em todo o Brasil.
            </p>
          </div>
          <div className="card text-center hover:shadow-card-hover transition-shadow">
            <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-7 h-7 text-navy-600" />
            </div>
            <h3 className="font-bold text-navy-600 mb-2 text-lg">Oportunidades reais</h3>
            <p className="text-slate-500 text-sm">
              Vagas em diversas áreas com possibilidade de crescimento interno.
            </p>
          </div>
          <div className="card text-center hover:shadow-card-hover transition-shadow">
            <div className="w-14 h-14 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-7 h-7 text-navy-600" />
            </div>
            <h3 className="font-bold text-navy-600 mb-2 text-lg">Privacidade garantida</h3>
            <p className="text-slate-500 text-sm">
              Seus dados são protegidos pela Lei Geral de Proteção de Dados (LGPD).
            </p>
          </div>
        </div>
      </section>

      {/* Vagas */}
      <section id="vagas" className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-navy-600 mb-3">Vagas disponíveis</h2>
            <p className="text-slate-500">Selecione sua área de interesse durante o cadastro</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {vagas.map((v) => (
              <Link
                key={v.nome}
                href="/candidatura"
                className="card hover:shadow-card-hover hover:border-navy-100 transition-all
                           flex items-center gap-3 cursor-pointer group"
              >
                <span className="text-2xl">{v.icon}</span>
                <span className="font-semibold text-slate-700 group-hover:text-navy-600 transition-colors text-sm">
                  {v.nome}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-navy-600 ml-auto transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-navy-600 mb-3">Como funciona?</h2>
          <p className="text-slate-500">
            Processo simples em {etapas.length} etapas. Leva apenas alguns minutos.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {etapas.map((e, i) => (
            <div key={i} className="flex items-start gap-4 card hover:shadow-card-hover transition-shadow">
              <div className="w-10 h-10 bg-gradient-brand rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white font-bold text-sm">{e.num}</span>
              </div>
              <div>
                <p className="font-semibold text-navy-600">{e.titulo}</p>
                <p className="text-slate-500 text-sm">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/candidatura"
            className="btn-primary inline-flex items-center gap-2 text-lg px-10 py-4"
          >
            Começar agora
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-10 px-4 mt-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-5 h-5 fill-cyan-400 text-cyan-400" />
              <span className="font-bold text-lg">Grupo Limpservice</span>
            </div>
            <p className="text-white/50 text-sm">25 anos de excelência em serviços</p>
          </div>
          <div className="flex gap-6 text-sm text-white/60">
            <Link href="/politica-de-privacidade" className="hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/candidatura" className="hover:text-white transition-colors">
              Candidatar-se
            </Link>
          </div>
        </div>
        <div className="max-w-5xl mx-auto mt-6 pt-6 border-t border-white/10 text-center text-white/40 text-xs">
          © {new Date().getFullYear()} Grupo Limpservice. Todos os direitos reservados.
          Seus dados são protegidos pela LGPD.
        </div>
      </footer>
    </div>
  );
}
