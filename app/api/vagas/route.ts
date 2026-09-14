import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const vagas = await prisma.vaga.findMany({
    where: { ativo: true },
    orderBy: { ordem: "asc" },
  });
  return NextResponse.json(vagas);
}
