import { createSupabaseAdminClient } from "./server";

const BUCKET = "curriculos";
// Tempo de expiração do link assinado: 1 hora
const SIGNED_URL_EXPIRES = 60 * 60;

export interface UploadResult {
  url: string;       // URL assinada (temporária) ou pública
  path: string;      // Caminho no bucket
  nome: string;      // Nome original do arquivo
  tipo: string;
  tamanho: number;
}

/**
 * Faz upload de um currículo para o bucket privado do Supabase Storage.
 * Retorna um signed URL válido por 1 hora.
 */
export async function uploadCurriculo(
  file: File,
  candidaturaId: string
): Promise<UploadResult> {
  const supabase = createSupabaseAdminClient();

  const ext = file.name.split(".").pop()?.toLowerCase() || "pdf";
  const path = `${candidaturaId}/${Date.now()}.${ext}`;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erro ao fazer upload: ${uploadError.message}`);
  }

  const { data: signedData, error: signError } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRES);

  if (signError || !signedData) {
    throw new Error(`Erro ao gerar URL assinada: ${signError?.message}`);
  }

  return {
    url: signedData.signedUrl,
    path,
    nome: file.name,
    tipo: file.type,
    tamanho: file.size,
  };
}

/**
 * Gera uma nova URL assinada para download de um currículo já armazenado.
 * Use quando a URL original (de 1h) expirar — por exemplo, ao abrir o detalhe
 * de um candidato no painel admin.
 */
export async function gerarSignedUrl(path: string): Promise<string | null> {
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_EXPIRES);

  if (error || !data) return null;
  return data.signedUrl;
}

/**
 * Deleta o arquivo de currículo do storage (usado na anonimização LGPD).
 */
export async function deletarCurriculo(path: string): Promise<void> {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase.storage.from(BUCKET).remove([path]);

  if (error) {
    console.error(`Erro ao deletar currículo (${path}):`, error.message);
  }
}
