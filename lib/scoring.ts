export interface AutoavaliacaoData {
  pontualidade: number;
  trabalhoEquipe: number;
  proatividade: number;
  atencaoSeguranca: number;
  comunicacao: number;
}

export interface PerfilData {
  nomeCompleto: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  cargo: string;
  turno: string[];
  experiencias: unknown[];
  escolaridade: string;
  cursos: unknown[];
  curriculoUrl?: string | null;
  autoavaliacao: AutoavaliacaoData;
}

export type Classificacao = "Perfil em Destaque" | "Perfil Adequado" | "Em Análise";

export function calcularPontuacaoAutoavaliacao(auto: AutoavaliacaoData): number {
  const competencias = [
    auto.pontualidade,
    auto.trabalhoEquipe,
    auto.proatividade,
    auto.atencaoSeguranca,
    auto.comunicacao,
  ];
  // Cada competência vai de 1 a 5 → soma máxima = 25
  // Peso = 60% da nota total
  const soma = competencias.reduce((acc, v) => acc + v, 0);
  return Math.round((soma / 25) * 60 * 10) / 10;
}

export function calcularPontuacaoCompletude(perfil: PerfilData): number {
  let pontos = 0;

  // Dados pessoais completos (10 pontos)
  if (perfil.nomeCompleto && perfil.email && perfil.telefone) pontos += 5;
  if (perfil.cidade && perfil.estado) pontos += 5;

  // Vaga preenchida (5 pontos)
  if (perfil.cargo && perfil.turno.length > 0) pontos += 5;

  // Experiência profissional (15 pontos)
  if (perfil.experiencias.length >= 1) pontos += 10;
  if (perfil.experiencias.length >= 2) pontos += 5;

  // Formação (10 pontos)
  if (perfil.escolaridade) pontos += 5;
  if (perfil.cursos.length >= 1) pontos += 5;

  // Currículo uploadado (5 pontos)
  if (perfil.curriculoUrl) pontos += 5;

  // máximo = 40
  return Math.min(pontos, 40);
}

export function calcularPontuacaoTotal(
  pontuacaoAuto: number,
  pontuacaoCompl: number
): number {
  return Math.round((pontuacaoAuto + pontuacaoCompl) * 10) / 10;
}

export function classificarCandidato(total: number): Classificacao {
  if (total >= 80) return "Perfil em Destaque";
  if (total >= 60) return "Perfil Adequado";
  return "Em Análise";
}

export function calcularTudo(perfil: PerfilData): {
  pontuacaoAuto: number;
  pontuacaoCompl: number;
  pontuacaoTotal: number;
  classificacao: Classificacao;
} {
  const pontuacaoAuto = calcularPontuacaoAutoavaliacao(perfil.autoavaliacao);
  const pontuacaoCompl = calcularPontuacaoCompletude(perfil);
  const pontuacaoTotal = calcularPontuacaoTotal(pontuacaoAuto, pontuacaoCompl);
  const classificacao = classificarCandidato(pontuacaoTotal);
  return { pontuacaoAuto, pontuacaoCompl, pontuacaoTotal, classificacao };
}

export function corClassificacao(classificacao: Classificacao): string {
  switch (classificacao) {
    case "Perfil em Destaque":
      return "text-emerald-700 bg-emerald-100 border-emerald-200";
    case "Perfil Adequado":
      return "text-blue-700 bg-blue-100 border-blue-200";
    case "Em Análise":
      return "text-amber-700 bg-amber-100 border-amber-200";
  }
}
