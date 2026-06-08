-- ============================================================
-- PASSO 4/4 — Criação do primeiro usuário administrador
-- Grupo Limpservice — App Avaliação Curricular
-- ============================================================
-- EXECUTE APÓS o arquivo 03_storage_bucket.sql
-- ============================================================
-- IMPORTANTE: Troque o e-mail e a senha antes de executar!
--
-- Para gerar o hash bcrypt da sua senha, use um dos métodos:
--   • Node.js: node -e "const b=require('bcrypt');b.hash('suasenha',10).then(console.log)"
--   • Online:  https://bcrypt-generator.com  (rounds: 10)
--
-- O hash abaixo corresponde à senha:  Admin@2024
-- Troque OBRIGATORIAMENTE antes de usar em produção!
-- ============================================================

INSERT INTO "Admin" ("id", "email", "nome", "senha", "ativo")
VALUES (
  gen_random_uuid()::text,
  'admin@limpservice.com.br',           -- << TROQUE pelo seu e-mail
  'Administrador RH',                   -- << TROQUE pelo nome
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'  -- senha: Admin@2024
)
ON CONFLICT DO NOTHING;


-- Confirma o usuário criado (sem mostrar a senha)
SELECT "id", "email", "nome", "ativo", "createdAt"
FROM "Admin";


-- ============================================================
-- PRÓXIMOS PASSOS após executar todos os SQLs:
-- ============================================================
-- 1. Abra o arquivo .env.local no projeto
-- 2. Preencha NEXT_PUBLIC_SUPABASE_URL
-- 3. Preencha NEXT_PUBLIC_SUPABASE_ANON_KEY  (aba Legacy do painel)
-- 4. Preencha SUPABASE_SERVICE_ROLE_KEY      (aba Legacy do painel)
-- 5. Preencha DATABASE_URL com a connection string do banco
-- 6. No terminal do projeto, rode:
--      npx prisma generate
--      npx prisma db push
-- 7. Rode o projeto:
--      npm run dev
-- ============================================================
