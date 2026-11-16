import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { caminhoDoCurriculo, gerarSignedUrl } from "@/lib/supabase/storage";

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

  const storagePath = caminhoDoCurriculo(candidatura);

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
