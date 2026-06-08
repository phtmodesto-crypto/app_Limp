-- ============================================================
-- PASSO 2/4 — Row Level Security (RLS)
-- Grupo Limpservice — App Avaliação Curricular
-- ============================================================
-- EXECUTE APÓS o arquivo 01_tabelas.sql
-- ============================================================
-- Bloqueia acesso público às tabelas via API REST do Supabase.
-- O backend usa Prisma com service_role key, que ignora RLS.
-- ============================================================

-- ─── Tabela: Candidatura ─────────────────────────────────────────────────────

ALTER TABLE "Candidatura" ENABLE ROW LEVEL SECURITY;

-- Bloqueia acesso público (anon key — chamadas sem autenticação)
CREATE POLICY "candidatura_noaccess_anon"
  ON "Candidatura" FOR ALL TO anon
  USING (false);

-- Bloqueia acesso autenticado via JWT Supabase
-- (usamos NextAuth separado, não o Auth do Supabase)
CREATE POLICY "candidatura_noaccess_authenticated"
  ON "Candidatura" FOR ALL TO authenticated
  USING (false);


-- ─── Tabela: Admin ────────────────────────────────────────────────────────────

ALTER TABLE "Admin" ENABLE ROW LEVEL SECURITY;

-- Bloqueia acesso público (senhas bcrypt armazenadas aqui)
CREATE POLICY "admin_noaccess_anon"
  ON "Admin" FOR ALL TO anon
  USING (false);

CREATE POLICY "admin_noaccess_authenticated"
  ON "Admin" FOR ALL TO authenticated
  USING (false);


-- ─── Comentários de documentação ────────────────────────────────────────────

COMMENT ON TABLE "Candidatura" IS
  'Candidaturas do processo seletivo. Acesso exclusivo via service_role (Prisma). RLS ativo.';

COMMENT ON TABLE "Admin" IS
  'Usuários RH. Senhas hasheadas com bcrypt. RLS ativo — nunca expor via API pública.';


-- Confirmação
SELECT 'RLS ativado com sucesso!' AS resultado;
