import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });

  const token  = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    return NextResponse.json({
      ok: false,
      erro: "TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID não configurados nas variáveis de ambiente.",
      token:  token  ? "✅ configurado" : "❌ ausente",
      chatId: chatId ? "✅ configurado" : "❌ ausente",
    });
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: "✅ <b>Teste de conexão</b>\n\nO painel admin da Limpservice está conectado e o Telegram está funcionando corretamente.",
        parse_mode: "HTML",
      }),
    });

    const json = await res.json() as { ok: boolean; description?: string; error_code?: number };

    if (!json.ok) {
      return NextResponse.json({
        ok: false,
        erro: json.description || "Erro desconhecido da API do Telegram",
        codigo: json.error_code,
      });
    }

    return NextResponse.json({ ok: true, mensagem: "Mensagem de teste enviada com sucesso!" });
  } catch (err) {
    return NextResponse.json({ ok: false, erro: String(err) });
  }
}
