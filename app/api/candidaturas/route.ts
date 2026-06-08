import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { candidaturaSchema } from "@/lib/validations";
import { calcularTudo } from "@/lib/scoring";
import { enviarEmailCandidatura } from "@/lib/email";
import { v4 as uuid } from "uuid";

// Rate limiting simples em memória (substitua por Redis em produção)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string, max = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true; // permitido
  }
  if (entry.count >= max) return false; // bloqueado
  entry.count++;
  return true;
}

function gerarProtocolo(): string {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const aleatorio = uuid().split("-")[0].toUpperCase();
  return `LS-${ano}${mes}-${aleatorio}`;
}

export async function POST(request: NextRequest) {
  // Rate limiting por IP
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "127.0.0.1";

  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Muitas tentativas. Aguarde alguns minutos e tente novamente." },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();

    // Honeypot — se preenchido, é bot
    if (body._hp && body._hp.trim() !== "") {
      return NextResponse.json({ protocolo: "OK" }); // retorna 200 falso
    }

    // Validação Zod
    const parsed = candidaturaSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const data = parsed.data;

    // Cálculo de pontuação
    const { pontuacaoAuto, pontuacaoCompl, pontuacaoTotal, classificacao } =
      calcularTudo({
        nomeCompleto: data.nomeCompleto,
        email: data.email,
        telefone: data.telefone,
        cidade: data.cidade,
        estado: data.estado,
        cargo: data.cargo,
        turno: data.turno,
        experiencias: data.experiencias,
        escolaridade: data.escolaridade,
        cursos: data.cursos,
        curriculoUrl: data.curriculoUrl,
        autoavaliacao: data.autoavaliacao,
      });

    const protocolo = gerarProtocolo();
    const userAgent = request.headers.get("user-agent") || "";

    // Salva no banco
    const candidatura = await prisma.candidatura.create({
      data: {
        protocolo,
        nomeCompleto: data.nomeCompleto,
        dataNasc: data.dataNasc,
        telefone: data.telefone,
        whatsapp: data.whatsapp || null,
        email: data.email,
        cidade: data.cidade,
        estado: data.estado,
        cargo: data.cargo,
        turno: JSON.stringify(data.turno),
        pretensaoSalarial: data.pretensaoSalarial || null,
        experiencias: JSON.stringify(data.experiencias),
        escolaridade: data.escolaridade,
        cursos: JSON.stringify(data.cursos),
        autoavaliacao: JSON.stringify(data.autoavaliacao),
        pontuacaoAuto,
        pontuacaoCompl,
        pontuacaoTotal,
        classificacao,
        curriculoUrl: data.curriculoUrl || null,
        curriculoNome: data.curriculoNome || null,
        curriculoTipo: data.curriculoTipo || null,
        curriculoTamanho: data.curriculoTamanho || null,
        lgpdAceite: true,
        lgpdDataHora: new Date(),
        status: "NOVO",
        statusHistorico: JSON.stringify([
          { status: "NOVO", data: new Date().toISOString(), obs: "Candidatura recebida" },
        ]),
        ipOrigem: ip,
        userAgent,
      },
    });

    // Envia e-mail ao RH (sem bloquear a resposta)
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    enviarEmailCandidatura({
      protocolo: candidatura.protocolo,
      nomeCompleto: candidatura.nomeCompleto,
      email: candidatura.email,
      telefone: candidatura.telefone,
      cidade: candidatura.cidade,
      estado: candidatura.estado,
      cargo: candidatura.cargo,
      turno: JSON.parse(candidatura.turno),
      pretensaoSalarial: candidatura.pretensaoSalarial,
      escolaridade: candidatura.escolaridade,
      experiencias: JSON.parse(candidatura.experiencias),
      cursos: JSON.parse(candidatura.cursos),
      autoavaliacao: JSON.parse(candidatura.autoavaliacao),
      pontuacaoTotal: candidatura.pontuacaoTotal,
      classificacao: candidatura.classificacao as "Perfil em Destaque" | "Perfil Adequado" | "Em Análise",
      curriculoUrl: candidatura.curriculoUrl,
      curriculoNome: candidatura.curriculoNome,
      lgpdDataHora: candidatura.lgpdDataHora,
      adminUrl: `${appUrl}/admin/candidatos/${candidatura.id}`,
      createdAt: candidatura.createdAt,
    }).catch((err) => console.error("Erro ao enviar e-mail:", err));

    return NextResponse.json({ protocolo: candidatura.protocolo }, { status: 201 });
  } catch (error) {
    console.error("Erro ao processar candidatura:", error);
    return NextResponse.json(
      { error: "Erro interno. Tente novamente em instantes." },
      { status: 500 }
    );
  }
}
