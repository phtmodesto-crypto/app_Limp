import { Resend } from "resend";
import { render } from "@react-email/render";
import { CandidaturaEmail } from "@/emails/CandidaturaEmail";
import type { Classificacao } from "@/lib/scoring";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const rhEmail = process.env.RH_EMAIL;
  const fromEmail = process.env.EMAIL_FROM || "curriculos@grupollimpservice.com.br";

  if (!rhEmail) {
    console.warn("⚠️  RH_EMAIL não configurado — e-mail não enviado.");
    return { success: false, error: "RH_EMAIL não configurado" };
  }

  try {
    // render() retorna uma string HTML para uso com Resend
    const html = await render(CandidaturaEmail(data));

    const result = await resend.emails.send({
      from: `Grupo Limpservice Currículos <${fromEmail}>`,
      to: [rhEmail],
      subject: `[Nova Candidatura] ${data.nomeCompleto} — ${data.cargo} | Protocolo ${data.protocolo}`,
      html,
      tags: [
        { name: "protocolo", value: data.protocolo },
        { name: "cargo", value: data.cargo },
        { name: "classificacao", value: data.classificacao },
      ],
    });

    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("Erro ao enviar e-mail:", error);
    return { success: false, error };
  }
}
