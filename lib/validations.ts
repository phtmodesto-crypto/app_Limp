import { z } from "zod";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const telefoneRegex = /^(\+55\s?)?(\(?\d{2}\)?\s?)(\d{4,5}-?\d{4})$/;

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
  dataNasc: z.string().min(1, "Data de nascimento obrigatória"),
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
  pretensaoSalarial: z.number().positive().optional().or(z.literal(0)),

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

export const stepDadosPessoaisSchema = candidaturaSchema.pick({
  nomeCompleto: true,
  dataNasc: true,
  telefone: true,
  whatsapp: true,
  email: true,
  cidade: true,
  estado: true,
});

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
