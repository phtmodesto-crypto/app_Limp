import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const [
    total,
    porStatus,
    porClassificacao,
    porCargo,
    novosMes,
  ] = await Promise.all([
    prisma.candidatura.count({ where: { anonimizado: false } }),
    prisma.candidatura.groupBy({
      by: ["status"],
      where: { anonimizado: false },
      _count: true,
    }),
    prisma.candidatura.groupBy({
      by: ["classificacao"],
      where: { anonimizado: false },
      _count: true,
    }),
    prisma.candidatura.groupBy({
      by: ["cargo"],
      where: { anonimizado: false },
      _count: true,
      orderBy: { _count: { cargo: "desc" } },
      take: 10,
    }),
    prisma.candidatura.count({
      where: {
        anonimizado: false,
        createdAt: { gte: new Date(new Date().setDate(1)) }, // primeiro dia do mês
      },
    }),
  ]);

  return NextResponse.json({
    total,
    novosMes,
    porStatus: Object.fromEntries(porStatus.map((s) => [s.status, s._count])),
    porClassificacao: Object.fromEntries(
      porClassificacao.map((c) => [c.classificacao, c._count])
    ),
    porCargo: porCargo.map((c) => ({ cargo: c.cargo, total: c._count })),
  });
}
