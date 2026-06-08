import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const [total, porStatus, porClassificacao, porCargo, novosMes] = await Promise.all([
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
        createdAt: { gte: new Date(new Date().setDate(1)) },
      },
    }),
  ]);

  // Prisma groupBy retorna array tipado; cast explícito para satisfazer o strict mode
  type GbStatus = { status: string; _count: number };
  type GbClassif = { classificacao: string; _count: number };
  type GbCargo  = { cargo: string;  _count: number };

  return NextResponse.json({
    total,
    novosMes,
    porStatus: Object.fromEntries(
      (porStatus as GbStatus[]).map((s) => [s.status, s._count])
    ),
    porClassificacao: Object.fromEntries(
      (porClassificacao as GbClassif[]).map((c) => [c.classificacao, c._count])
    ),
    porCargo: (porCargo as GbCargo[]).map((c) => ({ cargo: c.cargo, total: c._count })),
  });
}
