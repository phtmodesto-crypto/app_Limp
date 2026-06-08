-- ============================================================
-- Supabase Storage — Bucket de currículos
-- ============================================================
-- Execute APÓS criar o bucket "curriculos" no Dashboard do Supabase
-- ou via CLI: supabase storage create curriculos --private


-- Cria o bucket (caso não exista ainda via Dashboard/CLI)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'curriculos',
  'curriculos',
  false,                         -- bucket PRIVADO (acesso via signed URL)
  5242880,                       -- 5 MB em bytes
  ARRAY[
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
)
ON CONFLICT (id) DO UPDATE SET
  file_size_limit   = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;


-- ─── Políticas de Storage ────────────────────────────────────────────────────

-- UPLOAD: apenas o próprio sistema (service_role) pode fazer upload
-- Anon e authenticated não têm acesso de escrita
CREATE POLICY "curriculos_upload_service_only"
  ON storage.objects
  FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'curriculos');

-- LEITURA: apenas service_role pode ler (download, signed URL)
CREATE POLICY "curriculos_read_service_only"
  ON storage.objects
  FOR SELECT
  TO service_role
  USING (bucket_id = 'curriculos');

-- DELEÇÃO: apenas service_role pode deletar (anonimização LGPD)
CREATE POLICY "curriculos_delete_service_only"
  ON storage.objects
  FOR DELETE
  TO service_role
  USING (bucket_id = 'curriculos');

-- Bloqueia acesso anon ao bucket
CREATE POLICY "curriculos_deny_anon"
  ON storage.objects
  FOR ALL
  TO anon
  USING (false);

-- Bloqueia acesso authenticated direto ao bucket
CREATE POLICY "curriculos_deny_authenticated"
  ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id != 'curriculos');
