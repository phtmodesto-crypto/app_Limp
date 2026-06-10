import { Resend } from "resend";
import { render } from "@react-email/render";
import { CandidaturaEmail } from "@/emails/CandidaturaEmail";
import type { Classificacao } from "@/lib/scoring";

export interface EmailCandidaturaData {
  protocolo: string;
  nomeCompleto: string;
  email: string;
  telefone: string;
  cidade: string;
  estado: string;
  cargo: string;
  turno: string[];
  pretensaoSalarial?: number | null;
  escolaridade: string;
  experiencias: {
    empresa: string;
    cargo: string;
    dataInicio: string;
    dataFim?: string;
    empregoAtual: boolean;
  }[];
  cursos: { nome: string; instituicao?: string; ano?: string }[];
  autoavaliacao: Record<string, number>;
  pontuacaoTotal: number;
  classificacao: Classificacao;
  curriculoUrl?: string | null;
  curriculoNome?: string | null;
  lgpdDataHora: Date;
  adminUrl: string;
  createdAt: Date;
}

export async function enviarEmailCandidatura(data: EmailCandidaturaData) {
  const apiKey   = process.env.RESEND_API_KEY;
  const rhEmail  = process.env.RH_EMAIL;
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";

  // Guarda de configuração — não quebra o fluxo principal, só loga
  if (!apiKey || apiKey === "COLE_AQUI_A_CHAVE_DO_RESEND") {
    console.warn("⚠️  RESEND_API_KEY não configurado — e-mail não enviado.");
    return { success: false, skipped: true, reason: "RESEND_API_KEY ausente" };
  }
  if (!rhEmail) {
    console.warn("⚠️  RH_EMAIL não configurado — e-mail não enviado.");
    return { success: false, skipped: true, reason: "RH_EMAIL ausente" };
  }

  try {
    const resend = new Resend(apiKey);
    const html = await render(CandidaturaEmail(data));

    const result = await resend.emails.send({
      from: `Grupo Limpservice Currículos <${fromEmail}>`,
      to: [rhEmail],
      replyTo: data.email,
      subject: `[Nova Candidatura] ${data.nomeCompleto} — ${data.cargo} | ${data.protocolo}`,
      html,
      tags: [
        { name: "protocolo", value: data.protocolo },
        { name: "cargo",     value: data.cargo },
        { name: "classif",   value: data.classificacao },
      ],
    });

    if (result.error) {
      console.error("Resend retornou erro:", result.error);
      return { success: false, error: result.error };
    }

    console.log(`✉️  E-mail enviado para ${rhEmail} — id: ${result.data?.id}`);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Erro inesperado ao enviar e-mail:", error);
    return { success: false, error };
  }
}
