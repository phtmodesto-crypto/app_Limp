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

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { nome, icon, ordem } = await request.json();
  if (!nome?.trim()) {
    return NextResponse.json({ error: "Nome é obrigatório" }, { status: 400 });
  }

  const existe = await prisma.vaga.findUnique({ where: { nome: nome.trim() } });
  if (existe) return NextResponse.json({ error: "Já existe uma vaga com esse nome" }, { status: 409 });

  const vaga = await prisma.vaga.create({
    data: { nome: nome.trim(), icon: icon.trim(), ordem: Number(ordem) || 0, ativo: true },
  });
  return NextResponse.json(vaga, { status: 201 });
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
