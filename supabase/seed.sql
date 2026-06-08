-- ============================================================
-- Seed: Admin inicial — Grupo Limpservice
-- ============================================================
-- ATENÇÃO: Este seed usa uma senha hasheada de EXEMPLO.
-- Em produção, execute o seed via Node.js (npm run db:seed)
-- para que o bcrypt gere o hash correto com salt automático.
-- Senha padrão abaixo: Limpservice@2025
-- Hash bcrypt (rounds=12) gerado para "Limpservice@2025":
-- ============================================================

INSERT INTO "Admin" ("id", "email", "nome", "senha", "ativo")
VALUES (
  gen_random_uuid()::text,
  'admin@grupollimpservice.com.br',
  'RH Limpservice',
  -- bcrypt hash de "Limpservice@2025" com 12 rounds
  '$2b$12$K7nqGxBzHvLwPhOvGbQ5ueYe6dMwUnrJZ5Vk9M5Q1Kzfzrb0SNCAK',
  true
)
ON CONFLICT ("email") DO NOTHING;

-- ─── Dados de exemplo para desenvolvimento ────────────────────────────────────
-- Descomente abaixo para inserir candidaturas fictícias de teste

/*
INSERT INTO "Candidatura" (
  "id", "protocolo", "nomeCompleto", "dataNasc", "telefone", "email",
  "cidade", "estado", "cargo", "turno", "experiencias", "escolaridade",
  "cursos", "autoavaliacao", "pontuacaoAuto", "pontuacaoCompl", "pontuacaoTotal",
  "classificacao", "lgpdAceite", "lgpdDataHora", "status", "statusHistorico"
) VALUES
(
  gen_random_uuid()::text,
  'LS-202401-DEMO01',
  'Maria Silva Santos',
  '1990-05-15',
  '(11) 98765-4321',
  'maria.silva@email.com',
  'São Paulo', 'SP',
  'Auxiliar de Limpeza',
  '["Manhã (06h–14h)", "Tarde (14h–22h)"]',
  '[{"empresa":"Empresa ABC","cargo":"Aux. Limpeza","dataInicio":"2021-01","dataFim":"2023-06","empregoAtual":false,"atividades":"Limpeza geral de escritórios"}]',
  'Ensino Médio Completo',
  '[{"nome":"NR-32 Segurança","instituicao":"SENAC","ano":"2022"}]',
  '{"pontualidade":5,"trabalhoEquipe":4,"proatividade":4,"atencaoSeguranca":5,"comunicacao":3}',
  50.4, 35.0, 85.4,
  'Perfil em Destaque',
  true, NOW(),
  'NOVO',
  '[{"status":"NOVO","data":"2024-01-15T10:00:00Z","obs":"Candidatura recebida"}]'
),
(
  gen_random_uuid()::text,
  'LS-202401-DEMO02',
  'João Carlos Oliveira',
  '1985-11-22',
  '(21) 97654-3210',
  'joao.carlos@email.com',
  'Rio de Janeiro', 'RJ',
  'Porteiro(a) / Recepcionista',
  '["12×36 diurno"]',
  '[]',
  'Ensino Médio Completo',
  '[]',
  '{"pontualidade":3,"trabalhoEquipe":3,"proatividade":3,"atencaoSeguranca":3,"comunicacao":3}',
  36.0, 20.0, 56.0,
  'Em Análise',
  true, NOW(),
  'NOVO',
  '[{"status":"NOVO","data":"2024-01-16T14:30:00Z","obs":"Candidatura recebida"}]'
);
*/
