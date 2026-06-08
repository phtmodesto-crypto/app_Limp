import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;

  const candidatura = await prisma.candidatura.findUnique({ where: { id } });
  if (!candidatura) {
    return NextResponse.json({ error: "Candidatura não encontrada" }, { status: 404 });
  }

  return NextResponse.json(candidatura);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const { status, obs } = body;

  const statusValidos = ["NOVO", "EM_ANALISE", "ENTREVISTA", "APROVADO", "REPROVADO"];
  if (!statusValidos.includes(status)) {
    return NextResponse.json({ error: "Status inválido" }, { status: 400 });
  }

  const candidatura = await prisma.candidatura.findUnique({ where: { id } });
  if (!candidatura) {
    return NextResponse.json({ error: "Candidatura não encontrada" }, { status: 404 });
  }

  const historico = JSON.parse(candidatura.statusHistorico || "[]");
  historico.push({
    status,
    data: new Date().toISOString(),
    usuario: session.user.email || session.user.name,
    obs: obs || "",
  });

  const atualizada = await prisma.candidatura.update({
    where: { id },
    data: {
      status,
      statusHistorico: JSON.stringify(historico),
    },
  });

  return NextResponse.json(atualizada);
}
