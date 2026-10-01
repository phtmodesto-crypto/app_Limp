import { Prisma } from "@prisma/client";

const CAMPOS_BUSCA = ["nomeCompleto", "email", "protocolo", "cargo"];
const CONECTIVOS = new Set(["de", "da", "do", "das", "dos", "e"]);

const COM_ACENTO = "áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ";
const SEM_ACENTO = normalizar(COM_ACENTO);

function normalizar(texto: string): string {
  return texto.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();
}

// translate() em vez de unaccent: não depende de extensão instalada no banco
function contem(coluna: string, termo: string): Prisma.Sql {
  const padrao = `%${normalizar(termo).replace(/[\\%_]/g, "\\$&")}%`;
  return Prisma.sql`lower(translate(${Prisma.raw(`"${coluna}"`)}, ${COM_ACENTO}, ${SEM_ACENTO})) LIKE ${padrao}`;
}

export function filtrosBusca(
  busca: string,
  local: string
): { exato: Prisma.Sql; aproximado: Prisma.Sql | null } | null {
  const palavras = normalizar(busca).split(/\s+/).filter(Boolean);
  const relevantes = palavras.filter((p) => !CONECTIVOS.has(p));
  const porPalavra = (relevantes.length ? relevantes : palavras).map(
    (palavra) => Prisma.sql`(${Prisma.join(CAMPOS_BUSCA.map((c) => contem(c, palavra)), " OR ")})`
  );

  const porLocal: Prisma.Sql[] = [];
  const partes = local.split("/").map((p) => p.trim()).filter(Boolean);
  if (partes.length >= 2) {
    porLocal.push(contem("cidade", partes[0]), contem("estado", partes[1]));
  } else if (partes.length === 1) {
    // 2 letras é tratado como UF ("ES"); senão, como cidade
    porLocal.push(contem(partes[0].length === 2 ? "estado" : "cidade", partes[0]));
  }

  if (!porPalavra.length && !porLocal.length) return null;

  return {
    // todas as palavras, em qualquer ordem: "maria santos" acha "Maria Silva Santos"
    exato: Prisma.join([...porPalavra, ...porLocal], " AND "),
    // basta uma palavra; usado só quando o exato não acha ninguém (ex.: nome digitado errado)
    aproximado:
      porPalavra.length > 1
        ? Prisma.join([Prisma.sql`(${Prisma.join(porPalavra, " OR ")})`, ...porLocal], " AND ")
        : null,
  };
}
