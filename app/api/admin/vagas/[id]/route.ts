import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  const { nome, icon, ordem, ativo } = await request.json();

  if (!nome?.trim() || !icon?.trim()) {
    return NextResponse.json({ error: "Nome e ícone são obrigatórios" }, { status: 400 });
  }

  const existe = await prisma.vaga.findFirst({
    where: { nome: nome.trim(), NOT: { id } },
  });
  if (existe) return NextResponse.json({ error: "Já existe uma vaga com esse nome" }, { status: 409 });

  const vaga = await prisma.vaga.update({
    where: { id },
    data: {
      nome: nome.trim(),
      icon: icon.trim(),
      ordem: Number(ordem) || 0,
      ...(typeof ativo === "boolean" ? { ativo } : {}),
    },
  });
  return NextResponse.json(vaga);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { id } = await params;
  await prisma.vaga.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
