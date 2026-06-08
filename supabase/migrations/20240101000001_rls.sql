-- ============================================================
-- Row Level Security (RLS) — Grupo Limpservice
-- Garante que nenhum dado seja exposto via API pública do Supabase
-- ============================================================

-- IMPORTANTE: O acesso ao banco é feito exclusivamente via Prisma
-- no servidor (service_role key), que ignora RLS por design.
-- As políticas abaixo bloqueiam qualquer acesso direto via API REST
-- pública do Supabase (anon key), protegendo dados sensíveis.


-- ─── Candidatura ─────────────────────────────────────────────────────────────

ALTER TABLE "Candidatura" ENABLE ROW LEVEL SECURITY;

-- Bloqueia todo acesso público (anon key)
-- Apenas service_role (usado pelo Prisma no servidor) acessa esta tabela
CREATE POLICY "candidatura_noaccess_anon"
  ON "Candidatura"
  FOR ALL
  TO anon
  USING (false);

-- Nenhum acesso autenticado via JWT Supabase (usamos NextAuth separado)
CREATE POLICY "candidatura_noaccess_authenticated"
  ON "Candidatura"
  FOR ALL
  TO authenticated
  USING (false);


-- ─── Admin ────────────────────────────────────────────────────────────────────

ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;

-- Bloqueia completamente — senhas bcrypt armazenadas aqui
CREATE POLICY "admin_noaccess_anon"
  ON "Admin"
  FOR ALL
  TO anon
  USING (false);

CREATE POLICY "admin_noaccess_authenticated"
  ON "Admin"
  FOR ALL
  TO authenticated
  USING (false);


-- ─── Comentário de segurança ─────────────────────────────────────────────────

COMMENT ON TABLE "Candidatura" IS
  'Candidaturas do processo seletivo. Acesso exclusivo via service_role (Prisma). RLS ativo.';

COMMENT ON TABLE "Admin" IS
  'Usuários administradores do RH. Senhas hasheadas com bcrypt. RLS ativo.';
