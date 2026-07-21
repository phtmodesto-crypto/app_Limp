import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const cargo = searchParams.get("cargo") || "";
  const status = searchParams.get("status") || "";
  const classificacao = searchParams.get("classificacao") || "";
  const cidade = searchParams.get("cidade") || "";
  const busca = searchParams.get("busca") || "";
  const dataInicio = searchParams.get("dataInicio") || "";
  const dataFim = searchParams.get("dataFim") || "";
  const pagina = parseInt(searchParams.get("pagina") || "1");
  const porPagina = parseInt(searchParams.get("porPagina") || "20");
  const ordenar = searchParams.get("ordenar") || "createdAt";
  const direcao = searchParams.get("direcao") === "asc" ? "asc" : "desc";

  // Filtros
  const where: Record<string, unknown> = { anonimizado: false };

  if (cargo) where.cargo = cargo;
  if (status) where.status = status;
  if (classificacao) where.classificacao = classificacao;
  if (cidade) where.cidade = { contains: cidade, mode: "insensitive" };
  if (busca) {
    where.OR = [
      { nomeCompleto: { contains: busca, mode: "insensitive" } },
      { email: { contains: busca, mode: "insensitive" } },
      { protocolo: { contains: busca, mode: "insensitive" } },
    ];
  }
  if (dataInicio || dataFim) {
    where.createdAt = {
      ...(dataInicio ? { gte: new Date(dataInicio) } : {}),
      ...(dataFim ? { lte: new Date(dataFim + "T23:59:59") } : {}),
    };
  }

  const [total, candidaturas] = await Promise.all([
    prisma.candidatura.count({ where }),
    prisma.candidatura.findMany({
      where,
      orderBy: { [ordenar]: direcao },
      skip: (pagina - 1) * porPagina,
      take: porPagina,
      select: {
        id: true,
        protocolo: true,
        nomeCompleto: true,
        email: true,
        telefone: true,
        cidade: true,
        estado: true,
        cargo: true,
        turno: true,
        pontuacaoTotal: true,
        classificacao: true,
        status: true,
        curriculoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    candidaturas,
    total,
    pagina,
    porPagina,
    totalPaginas: Math.ceil(total / porPagina),
  });
}
