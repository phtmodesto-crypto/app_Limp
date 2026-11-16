import { prisma } from "@/lib/prisma";
import { caminhoDoCurriculo, deletarCurriculos } from "@/lib/supabase/storage";

// O arquivo é enviado antes da candidatura. Há candidatos que voltam ao formulário
// salvo no navegador dias depois (já houve casos de 14 dias), por isso um arquivo
// sem candidatura só é considerado abandonado depois desse prazo.
const DIAS_ATE_ABANDONADO = 30;

// Trava de segurança: se a limpeza fosse apagar mais do que essa fração do bucket,
// algo está errado (ex.: falha ao ler as candidaturas) e nada é apagado.
const FRACAO_MAXIMA = 0.3;

const LOTE = 100;

// Cada envio fica numa pasta própria: tmp-<timestamp>/<timestamp>.<ext>
function pastaDo(caminho: string): string {
  return caminho.split("/")[0];
}

/**
 * Apaga o arquivo de currículo se nenhuma outra candidatura usa a mesma pasta.
 * Chamar depois de excluir ou anonimizar a candidatura. Nunca lança erro: se falhar,
 * o arquivo fica sem uso e a limpeza mensal o remove.
 */
export async function apagarCurriculoSeSemUso(caminho: string | null): Promise<void> {
  if (!caminho) return;
  const pasta = pastaDo(caminho);
  try {
    // A mesma candidatura pode ter sido enviada duas vezes com o mesmo arquivo
    const emUso = await prisma.candidatura.count({
      where: {
        OR: [
          { curriculoStoragePath: { startsWith: `${pasta}/` } },
          { curriculoUrl: { contains: `/curriculos/${pasta}/` } },
        ],
      },
    });
    if (emUso === 0) await deletarCurriculos([caminho]);
  } catch (error) {
    console.error(`Erro ao apagar currículo (${caminho}):`, error);
  }
}

/**
 * Apaga arquivos de currículo que não pertencem a nenhuma candidatura e foram
 * enviados há mais de DIAS_ATE_ABANDONADO dias. Com `simular`, só conta.
 */
export async function limparCurriculosOrfaos({ simular = false } = {}) {
  const limite = new Date(Date.now() - DIAS_ATE_ABANDONADO * 24 * 60 * 60 * 1000);
  const arquivos = await prisma.$queryRaw<{ name: string; size: bigint | null }[]>`
    SELECT name, (metadata->>'size')::bigint AS size
    FROM storage.objects
    WHERE bucket_id = 'curriculos' AND created_at < ${limite}`;

  const candidaturas = await prisma.candidatura.findMany({
    where: { OR: [{ curriculoUrl: { not: null } }, { curriculoStoragePath: { not: null } }] },
    select: { curriculoUrl: true, curriculoStoragePath: true },
  });
  if (candidaturas.length === 0) {
    throw new Error("Nenhuma candidatura com currículo encontrada; limpeza cancelada por segurança");
  }

  const pastasEmUso = new Set<string>();
  for (const c of candidaturas) {
    const caminho = caminhoDoCurriculo(c);
    if (caminho) pastasEmUso.add(pastaDo(caminho));
  }
  // Conferência extra: a pasta não pode aparecer em nenhum link salvo
  const referencias = candidaturas
    .map((c) => `${c.curriculoUrl ?? ""} ${c.curriculoStoragePath ?? ""}`)
    .join("\n");

  const abandonados = arquivos.filter((a) => {
    const pasta = pastaDo(a.name);
    return pasta.startsWith("tmp-") && !pastasEmUso.has(pasta) && !referencias.includes(`${pasta}/`);
  });
  const bytes = abandonados.reduce((soma, a) => soma + Number(a.size ?? 0), 0);

  const [{ total }] = await prisma.$queryRaw<{ total: number }[]>`
    SELECT count(*)::int AS total FROM storage.objects WHERE bucket_id = 'curriculos'`;
  if (abandonados.length > total * FRACAO_MAXIMA) {
    throw new Error(
      `Limpeza cancelada por segurança: ${abandonados.length} de ${total} arquivos seriam apagados`
    );
  }

  let apagados = 0;
  if (!simular) {
    for (let i = 0; i < abandonados.length; i += LOTE) {
      apagados += await deletarCurriculos(abandonados.slice(i, i + LOTE).map((a) => a.name));
    }
  }

  return { encontrados: abandonados.length, apagados, bytes, totalNoBucket: total };
}
