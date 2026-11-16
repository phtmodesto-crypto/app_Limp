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
 * Caminho do arquivo no bucket a partir do que está salvo na candidatura.
 * Candidaturas antigas não têm curriculoStoragePath: o caminho vem da URL assinada.
 */
export function caminhoDoCurriculo(candidatura: {
  curriculoUrl?: string | null;
  curriculoStoragePath?: string | null;
}): string | null {
  if (candidatura.curriculoStoragePath) return candidatura.curriculoStoragePath;
  if (!candidatura.curriculoUrl) return null;
  try {
    // formato: /storage/v1/object/sign/curriculos/PATH
    const u = new URL(candidatura.curriculoUrl);
    const match = u.pathname.match(/\/storage\/v1\/object\/sign\/curriculos\/(.+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

/**
 * Apaga arquivos de currículo do storage. Retorna quantos foram apagados.
 */
export async function deletarCurriculos(paths: string[]): Promise<number> {
  if (paths.length === 0) return 0;
  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase.storage.from(BUCKET).remove(paths);

  if (error) {
    throw new Error(`Erro ao apagar currículos: ${error.message}`);
  }
  return data?.length ?? 0;
}
