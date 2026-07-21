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

DROP POLICY IF EXISTS "candidatura_noaccess_anon" ON "Candidatura";
CREATE POLICY "candidatura_noaccess_anon"
  ON "Candidatura"
  FOR ALL
  TO anon
  USING (false);

DROP POLICY IF EXISTS "candidatura_noaccess_authenticated" ON "Candidatura";
CREATE POLICY "candidatura_noaccess_authenticated"
  ON "Candidatura"
  FOR ALL
  TO authenticated
  USING (false);


-- ─── Admin ────────────────────────────────────────────────────────────────────

ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_noaccess_anon" ON "Admin";
CREATE POLICY "admin_noaccess_anon"
  ON "Admin"
  FOR ALL
  TO anon
  USING (false);

DROP POLICY IF EXISTS "admin_noaccess_authenticated" ON "Admin";
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
