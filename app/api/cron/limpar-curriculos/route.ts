import { NextRequest, NextResponse } from "next/server";
import { limparCurriculosOrfaos } from "@/lib/curriculos";

export const dynamic = "force-dynamic";

// Chamado pela Vercel uma vez por mês (vercel.json), que envia o CRON_SECRET no cabeçalho.
// ?simular=1 só conta os arquivos, sem apagar.
export async function GET(request: NextRequest) {
  const segredo = process.env.CRON_SECRET;
  if (!segredo || request.headers.get("authorization") !== `Bearer ${segredo}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const simular = request.nextUrl.searchParams.get("simular") === "1";
  try {
    const resultado = await limparCurriculosOrfaos({ simular });
    console.log(
      `Limpeza de currículos${simular ? " (simulação)" : ""}: ` +
        `${resultado.encontrados} sem uso, ${resultado.apagados} apagados, ` +
        `${(resultado.bytes / 1048576).toFixed(1)} MB`
    );
    return NextResponse.json({ ok: true, simular, ...resultado });
  } catch (error) {
    console.error("Erro na limpeza de currículos:", error);
    return NextResponse.json({ error: "Falha na limpeza de currículos" }, { status: 500 });
  }
}
