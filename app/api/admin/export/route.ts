import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const cargo = searchParams.get("cargo") || "";
  const status = searchParams.get("status") || "";
  const classificacao = searchParams.get("classificacao") || "";

  const where: Record<string, unknown> = { anonimizado: false };
  if (cargo) where.cargo = cargo;
  if (status) where.status = status;
  if (classificacao) where.classificacao = classificacao;

  const candidaturas = await prisma.candidatura.findMany({
    where,
    orderBy: { pontuacaoTotal: "desc" },
    select: {
      protocolo: true,
      nomeCompleto: true,
      email: true,
      telefone: true,
      cidade: true,
      estado: true,
      cargo: true,
      turno: true,
      pretensaoSalarial: true,
      escolaridade: true,
      pontuacaoTotal: true,
      classificacao: true,
      status: true,
      curriculoUrl: true,
      lgpdDataHora: true,
      createdAt: true,
    },
  });

  const rows = candidaturas.map((c) => ({
    Protocolo: c.protocolo,
    Nome: c.nomeCompleto,
    "E-mail": c.email,
    Telefone: c.telefone,
    Cidade: c.cidade,
    Estado: c.estado,
    Cargo: c.cargo,
    Turno: JSON.parse(c.turno).join(", "),
    "Pretensão (R$)": c.pretensaoSalarial ?? "",
    Escolaridade: c.escolaridade,
    "Pontuação Total": c.pontuacaoTotal,
    Classificação: c.classificacao,
    Status: c.status,
    "Currículo": c.curriculoUrl ? "Sim" : "Não",
    "LGPD aceito em": c.lgpdDataHora.toISOString(),
    "Data candidatura": c.createdAt.toISOString(),
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  // Larguras automáticas
  const colWidths = Object.keys(rows[0] || {}).map((key) => ({
    wch: Math.max(key.length, 12),
  }));
  ws["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Candidaturas");

  const buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const dataStr = new Date().toISOString().split("T")[0];
  return new NextResponse(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="candidaturas-limpservice-${dataStr}.xlsx"`,
    },
  });
}
