import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
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
  if (candidatura.anonimizado) {
    return NextResponse.json({ error: "Candidatura já anonimizada" }, { status: 409 });
  }

  // Anonimiza: substitui dados pessoais por placeholders
  await prisma.candidatura.update({
    where: { id },
    data: {
      nomeCompleto: "[DADOS REMOVIDOS]",
      dataNasc: "1900-01-01",
      telefone: "[REMOVIDO]",
      whatsapp: null,
      email: `anonimizado-${id}@removido.invalid`,
      cidade: "[REMOVIDO]",
      estado: "XX",
      experiencias: "[]",
      cursos: "[]",
      autoavaliacao: "{}",
      curriculoUrl: null,
      curriculoNome: null,
      curriculoTipo: null,
      anonimizado: true,
      anonimizadoEm: new Date(),
      anonimizadoPor: session.user.email || session.user.name || "admin",
    },
  });

  return NextResponse.json({ ok: true, mensagem: "Dados anonimizados com sucesso" });
}
