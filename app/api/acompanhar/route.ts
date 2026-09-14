import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const protocolo = request.nextUrl.searchParams.get("protocolo")?.trim().toUpperCase();

  if (!protocolo) {
    return NextResponse.json({ error: "Protocolo não informado" }, { status: 400 });
  }

  const candidatura = await prisma.candidatura.findUnique({
    where: { protocolo },
    select: {
      protocolo: true,
      status: true,
      cargo: true,
      createdAt: true,
      statusHistorico: true,
    },
  });

  if (!candidatura) {
    return NextResponse.json({ error: "Protocolo não encontrado" }, { status: 404 });
  }

  return NextResponse.json({
    protocolo: candidatura.protocolo,
    status: candidatura.status,
    cargo: candidatura.cargo,
    createdAt: candidatura.createdAt,
    statusHistorico: JSON.parse(candidatura.statusHistorico || "[]").map(
      (h: { status: string; data: string; obs?: string }) => ({
        status: h.status,
        data: h.data,
        obs: h.obs || "",
      })
    ),
  });
}
