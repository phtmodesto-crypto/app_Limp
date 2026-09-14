import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const vagas = await prisma.vaga.findMany({ orderBy: { ordem: "asc" } });
  return NextResponse.json(vagas);
}

export async function PATCH(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id, ativo } = await request.json();
  if (!id || typeof ativo !== "boolean") {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const vaga = await prisma.vaga.update({ where: { id }, data: { ativo } });
  return NextResponse.json(vaga);
}
