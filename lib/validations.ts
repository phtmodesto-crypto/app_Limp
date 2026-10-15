import { z } from "zod";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const telefoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)(\d{4,5}-?\d{4})$/;

// Abaixo de 14 anos não é permitido trabalhar nem como aprendiz (CF, art. 7º, XXXIII)
const IDADE_MINIMA = 14;
const IDADE_MAXIMA = 100;

export function brParaIso(valor: string): string | null {
  const m = valor.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  return m ? `${m[3]}-${m[2]}-${m[1]}` : null;
}

export function isoParaBr(valor: string): string {
  const m = valor.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? `${m[3]}/${m[2]}/${m[1]}` : valor;
}

function erroDataNasc(iso: string | null): string | null {
  const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return "Digite a data completa: dia/mês/ano (ex.: 25/03/1990)";
  const [ano, mes, dia] = [Number(m[1]), Number(m[2]), Number(m[3])];
  if (ano < 1900) return "Confira o ano de nascimento";
  const data = new Date(ano, mes - 1, dia);
  if (data.getFullYear() !== ano || data.getMonth() !== mes - 1 || data.getDate() !== dia) {
    return "Data inválida. Confira o dia e o mês";
  }
  const hoje = new Date();
  const fezAniversario =
    hoje.getMonth() > mes - 1 || (hoje.getMonth() === mes - 1 && hoje.getDate() >= dia);
  const idade = hoje.getFullYear() - ano - (fezAniversario ? 0 : 1);
  if (idade < IDADE_MINIMA) {
    return `Confira o ano de nascimento: é preciso ter pelo menos ${IDADE_MINIMA} anos`;
  }
  if (idade > IDADE_MAXIMA) return "Confira o ano de nascimento";
  return null;
}

// O formulário trabalha com dd/mm/aaaa; a API recebe e grava aaaa-mm-dd
const dataNascSchema = (paraIso: (valor: string) => string | null) =>
  z.string().superRefine((valor, ctx) => {
    const erro = erroDataNasc(paraIso(valor));
    if (erro) ctx.addIssue({ code: z.ZodIssueCode.custom, message: erro });
  });

// ─── Sub-schemas ─────────────────────────────────────────────────────────────

export const experienciaSchema = z.object({
  id: z.string(),
  empresa: z.string().min(2, "Nome da empresa obrigatório"),
  cargo: z.string().min(2, "Cargo obrigatório"),
  dataInicio: z.string().min(1, "Data de início obrigatória"),
  dataFim: z.string().optional(),
  empregoAtual: z.boolean().default(false),
  atividades: z.string().max(1000, "Máximo de 1000 caracteres").optional(),
});

export const cursoSchema = z.object({
  id: z.string(),
  nome: z.string().min(2, "Nome do curso obrigatório"),
  instituicao: z.string().optional(),
  ano: z.string().optional(),
});

export const autoavaliacaoSchema = z.object({
  pontualidade: z.number().min(1).max(5),
  trabalhoEquipe: z.number().min(1).max(5),
  proatividade: z.number().min(1).max(5),
  atencaoSeguranca: z.number().min(1).max(5),
  comunicacao: z.number().min(1).max(5),
});

// ─── Schema completo da candidatura ──────────────────────────────────────────

export const candidaturaSchema = z.object({
  // Dados pessoais
  nomeCompleto: z.string().min(3, "Nome completo obrigatório (mínimo 3 caracteres)"),
  dataNasc: dataNascSchema((valor) => valor),
  telefone: z
    .string()
    .min(10, "Telefone inválido")
    .regex(telefoneRegex, "Formato de telefone inválido"),
  whatsapp: z
    .string()
    .regex(telefoneRegex, "Formato inválido")
    .optional()
    .or(z.literal("")),
  email: z.string().email("E-mail inválido"),
  cidade: z.string().min(2, "Cidade obrigatória"),
  estado: z.string().length(2, "Selecione o estado"),

  // Vaga
  cargo: z.string().min(1, "Selecione a vaga de interesse"),
  turno: z.array(z.string()).min(1, "Selecione ao menos um turno"),
  pretensaoSalarial: z.number().positive().optional().nullable().or(z.literal(0)),

  // Experiência
  experiencias: z.array(experienciaSchema),

  // Formação
  escolaridade: z.string().min(1, "Escolaridade obrigatória"),
  cursos: z.array(cursoSchema),

  // Autoavaliação
  autoavaliacao: autoavaliacaoSchema,

  // Upload (opcional — url gerada pela API)
  curriculoUrl: z.string().optional(),
  curriculoNome: z.string().optional(),
  curriculoTipo: z.string().optional(),
  curriculoTamanho: z.number().optional(),

  // LGPD
  lgpdAceite: z.literal(true, {
    errorMap: () => ({ message: "Você precisa aceitar o termo para continuar." }),
  }),

  // Anti-spam (honeypot — deve estar vazio)
  _hp: z.string().max(0).optional(),
});

export type CandidaturaInput = z.infer<typeof candidaturaSchema>;

// ─── Schemas de formulário por etapa ─────────────────────────────────────────

export const stepDadosPessoaisSchema = candidaturaSchema
  .pick({
    nomeCompleto: true,
    telefone: true,
    whatsapp: true,
    email: true,
    cidade: true,
    estado: true,
  })
  .extend({ dataNasc: dataNascSchema(brParaIso) });

export const stepVagaSchema = candidaturaSchema.pick({
  cargo: true,
  turno: true,
});

export const stepAutoavaliacaoSchema = candidaturaSchema.pick({
  autoavaliacao: true,
});

export const stepLGPDSchema = candidaturaSchema.pick({
  lgpdAceite: true,
});
