-- ============================================================
-- PASSO 3/4 — Storage bucket para currículos
-- Grupo Limpservice — App Avaliação Curricular
-- ============================================================
-- EXECUTE APÓS o arquivo 02_seguranca_rls.sql
-- ============================================================
-- Cria bucket privado "curriculos" e bloqueia acesso público.
-- Os arquivos são acessados via signed URL gerada pelo servidor.
-- ============================================================

-- Cria o bucket privado (ou atualiza se já existir)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'curriculos',
  'curriculos',
  false,       -- PRIVADO — acesso apenas via signed URL
  5242880,     -- 5 MB máximo por arquivo
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;


-- ─── Políticas de acesso ao Storage ──────────────────────────────────────────

-- Upload: apenas o servidor (service_role) pode enviar arquivos
CREATE POLICY "curriculos_upload_service_only"
  ON storage.objects FOR INSERT TO service_role
  WITH CHECK (bucket_id = 'curriculos');

-- Download / signed URL: apenas service_role pode ler
CREATE POLICY "curriculos_read_service_only"
  ON storage.objects FOR SELECT TO service_role
  USING (bucket_id = 'curriculos');

-- Deleção: apenas service_role pode deletar (fluxo de anonimização LGPD)
CREATE POLICY "curriculos_delete_service_only"
  ON storage.objects FOR DELETE TO service_role
  USING (bucket_id = 'curriculos');

-- Bloqueia qualquer acesso público (anon)
CREATE POLICY "curriculos_deny_anon"
  ON storage.objects FOR ALL TO anon
  USING (false);

-- Bloqueia acesso autenticado direto
CREATE POLICY "curriculos_deny_authenticated"
  ON storage.objects FOR ALL TO authenticated
  USING (bucket_id != 'curriculos');


-- Confirmação
SELECT 'Bucket curriculos criado com sucesso!' AS resultado;
