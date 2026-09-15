"use client";

import { useState } from "react";
import { Send, CheckCircle, XCircle, Loader2 } from "lucide-react";

export function TelegramTestButton() {
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "erro">("idle");
  const [msg, setMsg] = useState("");

  const testar = async () => {
    setEstado("loading");
    setMsg("");
    try {
      const res = await fetch("/api/admin/telegram-test", { method: "POST" });
      const data = await res.json() as { ok: boolean; mensagem?: string; erro?: string; token?: string; chatId?: string };
      if (data.ok) {
        setEstado("ok");
        setMsg(data.mensagem || "Mensagem enviada!");
      } else {
        setEstado("erro");
        setMsg(data.erro || "Erro desconhecido");
      }
    } catch {
      setEstado("erro");
      setMsg("Falha de rede ao testar Telegram.");
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        type="button"
        onClick={testar}
        disabled={estado === "loading"}
        className="btn-secondary text-sm flex items-center gap-2 px-4 py-2"
      >
        {estado === "loading"
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : <Send className="w-4 h-4" />}
        Testar Telegram
      </button>
      {estado === "ok" && (
        <span className="flex items-center gap-1.5 text-sm text-emerald-600 font-medium">
          <CheckCircle className="w-4 h-4" /> {msg}
        </span>
      )}
      {estado === "erro" && (
        <span className="flex items-center gap-1.5 text-sm text-red-600 font-medium">
          <XCircle className="w-4 h-4" /> {msg}
        </span>
      )}
    </div>
  );
}
