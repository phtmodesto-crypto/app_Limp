-- ============================================================
-- PASSO 1/4 — Tabelas, índices, triggers e view
-- Grupo Limpservice — App Avaliação Curricular
-- ============================================================
-- Cole este conteúdo no SQL Editor do Supabase e clique em Run
-- ============================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "unaccent";


-- ─── Tabela: Candidatura ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Candidatura" (
  "id"               TEXT         NOT NULL DEFAULT gen_random_uuid()::text,
  "protocolo"        TEXT         NOT NULL,

  -- Dados pessoais
  "nomeCompleto"     TEXT         NOT NULL,
  "dataNasc"         TEXT         NOT NULL,
  "telefone"         TEXT         NOT NULL,
  "whatsapp"         TEXT,
  "email"            TEXT         NOT NULL,
  "cidade"           TEXT         NOT NULL,
  "estado"           TEXT         NOT NULL,

  -- Vaga pretendida
  "cargo"            TEXT         NOT NULL,
  "turno"            TEXT         NOT NULL,          -- JSON serializado: string[]
  "pretensaoSalarial" DOUBLE PRECISION,

  -- Experiência e formação (JSON serializado)
  "experiencias"     TEXT         NOT NULL DEFAULT '[]',
  "escolaridade"     TEXT         NOT NULL,
  "cursos"           TEXT         NOT NULL DEFAULT '[]',

  -- Autoavaliação de competências
  "autoavaliacao"    TEXT         NOT NULL DEFAULT '{}',
  "pontuacaoAuto"    DOUBLE PRECISION NOT NULL DEFAULT 0,
  "pontuacaoCompl"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "pontuacaoTotal"   DOUBLE PRECISION NOT NULL DEFAULT 0,
  "classificacao"    TEXT         NOT NULL DEFAULT 'Em Análise',

  -- Arquivo de currículo
  "curriculoUrl"     TEXT,
  "curriculoNome"    TEXT,
  "curriculoTipo"    TEXT,
  "curriculoTamanho" INTEGER,
  "curriculoStoragePath" TEXT,     -- caminho no Supabase Storage

  -- LGPD — consentimento obrigatório
  "lgpdAceite"       BOOLEAN      NOT NULL DEFAULT false,
  "lgpdDataHora"     TIMESTAMPTZ  NOT NULL,

  -- Status do processo seletivo
  "status"           TEXT         NOT NULL DEFAULT 'NOVO',
  "statusHistorico"  TEXT         NOT NULL DEFAULT '[]',

  -- Dados técnicos
  "ipOrigem"         TEXT,
  "userAgent"        TEXT,

  -- Timestamps
  "createdAt"        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  "updatedAt"        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

  -- LGPD — anonimização
  "anonimizado"      BOOLEAN      NOT NULL DEFAULT false,
  "anonimizadoEm"    TIMESTAMPTZ,
  "anonimizadoPor"   TEXT,

  CONSTRAINT "Candidatura_pkey" PRIMARY KEY ("id")
);

-- Protocolo único por candidatura
CREATE UNIQUE INDEX IF NOT EXISTS "Candidatura_protocolo_key"
  ON "Candidatura"("protocolo");

-- Índices para filtros do painel admin
CREATE INDEX IF NOT EXISTS "Candidatura_cargo_idx"          ON "Candidatura"("cargo");
CREATE INDEX IF NOT EXISTS "Candidatura_status_idx"         ON "Candidatura"("status");
CREATE INDEX IF NOT EXISTS "Candidatura_classificacao_idx"  ON "Candidatura"("classificacao");
CREATE INDEX IF NOT EXISTS "Candidatura_pontuacaoTotal_idx" ON "Candidatura"("pontuacaoTotal" DESC);
CREATE INDEX IF NOT EXISTS "Candidatura_createdAt_idx"      ON "Candidatura"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Candidatura_anonimizado_idx"    ON "Candidatura"("anonimizado");

-- Índice full-text para busca por nome
CREATE INDEX IF NOT EXISTS "Candidatura_nomeCompleto_idx"
  ON "Candidatura" USING gin(to_tsvector('portuguese', "nomeCompleto"));


-- ─── Tabela: Admin ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS "Admin" (
  "id"           TEXT        NOT NULL DEFAULT gen_random_uuid()::text,
  "email"        TEXT        NOT NULL,
  "nome"         TEXT        NOT NULL,
  "senha"        TEXT        NOT NULL,   -- hash bcrypt
  "ativo"        BOOLEAN     NOT NULL DEFAULT true,
  "createdAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Admin_email_key" ON "Admin"("email");


-- ─── Trigger: atualiza "updatedAt" automaticamente ───────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER "Candidatura_updatedAt"
  BEFORE UPDATE ON "Candidatura"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE TRIGGER "Admin_updatedAt"
  BEFORE UPDATE ON "Admin"
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ─── View: resumo para o painel admin ────────────────────────────────────────

CREATE OR REPLACE VIEW candidaturas_resumo AS
SELECT
  "id",
  "protocolo",
  "nomeCompleto",
  "cargo",
  "cidade",
  "estado",
  "pontuacaoTotal",
  "classificacao",
  "status",
  ("curriculoUrl" IS NOT NULL) AS "temCurriculo",
  "createdAt"
FROM "Candidatura"
WHERE "anonimizado" = false
ORDER BY "pontuacaoTotal" DESC;


-- Confirmação
SELECT 'Tabelas criadas com sucesso!' AS resultado;
