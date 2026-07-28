import type { Classificacao } from "@/lib/scoring";

export interface TelegramCandidaturaData {
  protocolo: string;
  nomeCompleto: string;
  dataNasc: string;
  email: string;
  telefone: string;
  whatsapp?: string | null;
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
  adminUrl: string;
}

const LABEL: Record<string, string> = {
  pontualidade:     "Pontualidade",
  trabalhoEquipe:   "Trabalho em Equipe",
  proatividade:     "Proatividade",
  atencaoSeguranca: "Atenção à Segurança",
  comunicacao:      "Comunicação",
};

const CLASSIF_EMOJI: Record<string, string> = {
  "Perfil em Destaque": "🟢",
  "Perfil Adequado":    "🟡",
  "Em Análise":         "🔴",
};

function esc(t: string): string {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function estrelas(n: number): string {
  return "⭐".repeat(Math.max(1, Math.min(5, n)));
}

function fmtData(iso: string): string {
  const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
  const [ano, mes] = iso.split("-");
  return `${meses[parseInt(mes) - 1]}/${ano}`;
}

function fmtMoeda(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function construirMensagem(data: TelegramCandidaturaData): string {
  const emoji = CLASSIF_EMOJI[data.classificacao] ?? "⚪";
  const nota  = Math.round(data.pontuacaoTotal);

  // Experiências
  const exp = data.experiencias.length === 0
    ? "  Sem experiência informada"
    : data.experiencias.map((e) => {
        const inicio = fmtData(e.dataInicio);
        const fim    = e.empregoAtual ? "atual" : (e.dataFim ? fmtData(e.dataFim) : "—");
        return `  • <b>${esc(e.empresa)}</b> (${inicio} → ${fim})\n    Função: ${esc(e.cargo)}`;
      }).join("\n");

  // Cursos
  const cursos = data.cursos.length === 0
    ? "  Nenhum"
    : data.cursos.map((c) => {
        const inst = c.instituicao ? ` — ${esc(c.instituicao)}` : "";
        const ano  = c.ano ? ` (${c.ano})` : "";
        return `  • ${esc(c.nome)}${inst}${ano}`;
      }).join("\n");

  // Autoavaliação
  const auto = Object.entries(data.autoavaliacao)
    .map(([k, v]) => `  ${estrelas(v)} ${LABEL[k] ?? esc(k)}`)
    .join("\n");

  // Opcionais
  const whatsapp    = data.whatsapp ? `\n📲 <b>WhatsApp:</b> ${esc(data.whatsapp)}` : "";
  const pretensao   = data.pretensaoSalarial ? fmtMoeda(data.pretensaoSalarial) : "Não informada";
  const curriculo   = data.curriculoUrl
    ? `\n📎 <b>Currículo:</b> <a href="${data.curriculoUrl}">${esc(data.curriculoNome ?? "Baixar arquivo")}</a>`
    : "\n📎 <b>Currículo:</b> Não enviado";

  return [
    `${emoji} <b>NOVA CANDIDATURA — ${esc(data.cargo)}</b>`,
    `━━━━━━━━━━━━━━━━`,
    `📋 <b>Protocolo:</b> <code>${data.protocolo}</code>`,
    `📊 <b>Pontuação:</b> ${nota}/100 — ${esc(data.classificacao)}`,
    ``,
    `👤 <b>DADOS PESSOAIS</b>`,
    `<b>Nome:</b> ${esc(data.nomeCompleto)}`,
    `<b>Nascimento:</b> ${esc(data.dataNasc)}`,
    `<b>Email:</b> ${esc(data.email)}`,
    `<b>Telefone:</b> ${esc(data.telefone)}${whatsapp}`,
    `<b>Cidade:</b> ${esc(data.cidade)} — ${esc(data.estado)}`,
    ``,
    `💼 <b>VAGA</b>`,
    `<b>Cargo:</b> ${esc(data.cargo)}`,
    `<b>Turno:</b> ${data.turno.map(esc).join(", ")}`,
    `<b>Pretensão:</b> ${pretensao}`,
    ``,
    `🎓 <b>FORMAÇÃO</b>`,
    `<b>Escolaridade:</b> ${esc(data.escolaridade)}`,
    `<b>Cursos:</b>`,
    cursos,
    ``,
    `🏢 <b>EXPERIÊNCIA PROFISSIONAL</b>`,
    exp,
    ``,
    `⭐ <b>AUTOAVALIAÇÃO</b>`,
    auto,
    `━━━━━━━━━━━━━━━━`,
    curriculo,
    `🖥 <a href="${data.adminUrl}">Ver no painel admin</a>`,
  ].join("\n");
}

async function enviarMensagem(token: string, chatId: string, text: string): Promise<boolean> {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });

  const json = await res.json() as { ok: boolean; description?: string };
  if (!json.ok) {
    console.error("Telegram erro:", json.description);
    return false;
  }
  return true;
}

// Telegram limita 4096 chars por mensagem — divide se necessário
function dividirMensagem(texto: string, limite = 4096): string[] {
  if (texto.length <= limite) return [texto];

  const partes: string[] = [];
  const linhas = texto.split("\n");
  let atual = "";

  for (const linha of linhas) {
    if ((atual + "\n" + linha).length > limite) {
      partes.push(atual.trim());
      atual = linha;
    } else {
      atual += (atual ? "\n" : "") + linha;
    }
  }
  if (atual.trim()) partes.push(atual.trim());
  return partes;
}

export async function enviarTelegramCandidatura(data: TelegramCandidaturaData) {
  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn("⚠️  TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurados.");
    return { success: false, skipped: true };
  }

  try {
    const mensagem = construirMensagem(data);
    const partes   = dividirMensagem(mensagem);

    for (const parte of partes) {
      const ok = await enviarMensagem(token, chatId, parte);
      if (!ok) return { success: false, error: "Falha ao enviar mensagem" };
    }

    console.log(`✈️  Telegram: candidatura ${data.protocolo} enviada para chat ${chatId}`);
    return { success: true };
  } catch (error) {
    console.error("Erro ao enviar Telegram:", error);
    return { success: false, error };
  }
}
