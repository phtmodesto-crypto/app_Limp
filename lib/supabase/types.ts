// Tipos TypeScript gerados manualmente a partir do schema Prisma/Supabase
// Em produção, use: npx supabase gen types typescript --project-id <ID> > lib/supabase/types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      Candidatura: {
        Row: CandidaturaRow;
        Insert: CandidaturaInsert;
        Update: CandidaturaUpdate;
      };
      Admin: {
        Row: AdminRow;
        Insert: AdminInsert;
        Update: AdminUpdate;
      };
    };
    Views: {
      candidaturas_resumo: {
        Row: CandidaturaResumo;
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// ─── Candidatura ──────────────────────────────────────────────────────────────

export interface CandidaturaRow {
  id: string;
  protocolo: string;
  nomeCompleto: string;
  dataNasc: string;
  telefone: string;
  whatsapp: string | null;
  email: string;
  cidade: string;
  estado: string;
  cargo: string;
  turno: string;           // JSON: string[]
  pretensaoSalarial: number | null;
  experiencias: string;   // JSON: Experiencia[]
  escolaridade: string;
  cursos: string;          // JSON: Curso[]
  autoavaliacao: string;   // JSON: Record<string, number>
  pontuacaoAuto: number;
  pontuacaoCompl: number;
  pontuacaoTotal: number;
  classificacao: string;
  curriculoUrl: string | null;
  curriculoNome: string | null;
  curriculoTipo: string | null;
  curriculoTamanho: number | null;
  lgpdAceite: boolean;
  lgpdDataHora: string;    // ISO timestamp
  status: CandidaturaStatus;
  statusHistorico: string; // JSON: StatusEntry[]
  ipOrigem: string | null;
  userAgent: string | null;
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
  anonimizado: boolean;
  anonimizadoEm: string | null;
  anonimizadoPor: string | null;
}

export type CandidaturaInsert = Omit<CandidaturaRow,
  "createdAt" | "updatedAt"
> & {
  createdAt?: string;
  updatedAt?: string;
};

export type CandidaturaUpdate = Partial<CandidaturaRow>;

export type CandidaturaStatus =
  | "NOVO"
  | "EM_ANALISE"
  | "ENTREVISTA"
  | "APROVADO"
  | "REPROVADO";

export type Classificacao =
  | "Perfil em Destaque"
  | "Perfil Adequado"
  | "Em Análise";

export interface StatusEntry {
  status: CandidaturaStatus;
  data: string; // ISO timestamp
  usuario?: string;
  obs?: string;
}

export interface CandidaturaResumo {
  id: string;
  protocolo: string;
  nomeCompleto: string;
  cargo: string;
  cidade: string;
  estado: string;
  pontuacaoTotal: number;
  classificacao: string;
  status: CandidaturaStatus;
  temCurriculo: boolean;
  createdAt: string;
}

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminRow {
  id: string;
  email: string;
  nome: string;
  senha: string;  // bcrypt hash — nunca retorne ao cliente
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}

export type AdminInsert = Omit<AdminRow, "createdAt" | "updatedAt"> & {
  createdAt?: string;
  updatedAt?: string;
};

export type AdminUpdate = Partial<AdminRow>;

// ─── Tipos auxiliares de domínio ─────────────────────────────────────────────

export interface Experiencia {
  id: string;
  empresa: string;
  cargo: string;
  dataInicio: string;
  dataFim?: string;
  empregoAtual: boolean;
  atividades?: string;
}

export interface Curso {
  id: string;
  nome: string;
  instituicao?: string;
  ano?: string;
}

export interface Autoavaliacao {
  pontualidade: number;
  trabalhoEquipe: number;
  proatividade: number;
  atencaoSeguranca: number;
  comunicacao: number;
}
