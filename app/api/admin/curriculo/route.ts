import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gerarSignedUrl } from "@/lib/supabase/storage";

function extrairPathDoStorage(url: string): string | null {
  try {
    const u = new URL(url);
    // formato: /storage/v1/object/sign/curriculos/PATH
    const match = u.pathname.match(/\/storage\/v1\/object\/sign\/curriculos\/(.+)/);
    return match?.[1] ?? null;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID não informado" }, { status: 400 });

  const candidatura = await prisma.candidatura.findUnique({
    where: { id },
    select: { curriculoUrl: true, curriculoStoragePath: true },
  });

  if (!candidatura?.curriculoUrl) {
    return NextResponse.json({ error: "Currículo não encontrado" }, { status: 404 });
  }

  // Usa o path salvo no banco; se não houver, extrai da URL antiga
  const storagePath =
    candidatura.curriculoStoragePath || extrairPathDoStorage(candidatura.curriculoUrl);

  if (!storagePath) {
    // Fallback: redireciona para a URL original (pode estar expirada)
    return NextResponse.redirect(candidatura.curriculoUrl);
  }

  const novaUrl = await gerarSignedUrl(storagePath);
  if (!novaUrl) {
    return NextResponse.json({ error: "Não foi possível gerar o link de download" }, { status: 500 });
  }

  return NextResponse.redirect(novaUrl);
}
