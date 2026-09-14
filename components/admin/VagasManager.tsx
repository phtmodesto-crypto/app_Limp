"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";

interface Vaga {
  id: string;
  nome: string;
  icon: string;
  ativo: boolean;
  ordem: number;
}

interface FormState {
  nome: string;
  icon: string;
  ordem: string;
}

const emptyForm: FormState = { nome: "", icon: "", ordem: "" };

export function VagasManager({ vagasIniciais }: { vagasIniciais: Vaga[] }) {
  const [vagas, setVagas] = useState<Vaga[]>(vagasIniciais);
  const [loading, setLoading] = useState<string | null>(null);
  const [erro, setErro] = useState("");

  // Criar
  const [criando, setCriando] = useState(false);
  const [formNova, setFormNova] = useState<FormState>(emptyForm);

  // Editar
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [formEdit, setFormEdit] = useState<FormState>(emptyForm);

  // Excluir
  const [excluindoId, setExcluindoId] = useState<string | null>(null);

  const ativas = vagas.filter((v) => v.ativo).length;

  /* ── Toggle ativo ── */
  const toggle = async (id: string, ativo: boolean) => {
    setLoading(id);
    setErro("");
    try {
      const res = await fetch("/api/admin/vagas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ativo }),
      });
      if (!res.ok) throw new Error();
      setVagas((prev) => prev.map((v) => (v.id === id ? { ...v, ativo } : v)));
    } catch {
      setErro("Não foi possível salvar. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  /* ── Criar ── */
  const criarVaga = async () => {
    if (!formNova.nome.trim()) {
      setErro("O nome da vaga é obrigatório.");
      return;
    }
    setLoading("nova");
    setErro("");
    try {
      const res = await fetch("/api/admin/vagas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formNova.nome.trim(),
          icon: formNova.icon.trim(),
          ordem: Number(formNova.ordem) || vagas.length + 1,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao criar");
      setVagas((prev) => [...prev, data]);
      setCriando(false);
      setFormNova(emptyForm);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao criar vaga.");
    } finally {
      setLoading(null);
    }
  };

  /* ── Editar ── */
  const abrirEdicao = (v: Vaga) => {
    setEditandoId(v.id);
    setFormEdit({ nome: v.nome, icon: v.icon, ordem: String(v.ordem) });
    setErro("");
  };

  const salvarEdicao = async (id: string) => {
    if (!formEdit.nome.trim()) {
      setErro("O nome da vaga é obrigatório.");
      return;
    }
    setLoading(id);
    setErro("");
    try {
      const res = await fetch(`/api/admin/vagas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formEdit.nome.trim(),
          icon: formEdit.icon.trim(),
          ordem: Number(formEdit.ordem) || 0,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erro ao salvar");
      setVagas((prev) => prev.map((v) => (v.id === id ? data : v)));
      setEditandoId(null);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar.");
    } finally {
      setLoading(null);
    }
  };

  /* ── Excluir ── */
  const confirmarExclusao = async (id: string) => {
    setLoading(id);
    setErro("");
    try {
      const res = await fetch(`/api/admin/vagas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setVagas((prev) => prev.filter((v) => v.id !== id));
      setExcluindoId(null);
    } catch {
      setErro("Não foi possível excluir. Tente novamente.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-500">
          {ativas} de {vagas.length} vagas visíveis no site público.
        </p>
        <button
          type="button"
          onClick={() => { setCriando(true); setErro(""); setEditandoId(null); }}
          className="btn-primary flex items-center gap-1.5 py-2 px-3 text-sm"
        >
          <Plus className="w-4 h-4" /> Nova vaga
        </button>
      </div>

      {erro && (
        <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
          {erro}
        </div>
      )}

      {/* Formulário de criação */}
      {criando && (
        <div className="mb-4 p-4 border-2 border-navy-200 bg-brand-light rounded-xl space-y-3">
          <p className="text-sm font-bold text-navy-600">Nova vaga</p>
          <div className="flex gap-2">
            <div className="w-20">
              <label className="label-field text-xs">Ícone <span className="text-slate-400 font-normal">(opt.)</span></label>
              <input
                type="text"
                placeholder="🧹"
                className="input-field py-2 text-center text-xl"
                value={formNova.icon}
                onChange={(e) => setFormNova((f) => ({ ...f, icon: e.target.value }))}
              />
            </div>
            <div className="flex-1">
              <label className="label-field text-xs">Nome da vaga</label>
              <input
                type="text"
                placeholder="Ex.: Auxiliar de Limpeza"
                className="input-field py-2"
                value={formNova.nome}
                onChange={(e) => setFormNova((f) => ({ ...f, nome: e.target.value }))}
              />
            </div>
            <div className="w-20">
              <label className="label-field text-xs">Ordem</label>
              <input
                type="number"
                placeholder="0"
                className="input-field py-2"
                value={formNova.ordem}
                onChange={(e) => setFormNova((f) => ({ ...f, ordem: e.target.value }))}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => { setCriando(false); setFormNova(emptyForm); setErro(""); }}
              className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" /> Cancelar
            </button>
            <button
              type="button"
              onClick={criarVaga}
              disabled={loading === "nova"}
              className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1"
            >
              {loading === "nova"
                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                : <Check className="w-3.5 h-3.5" />}
              Criar vaga
            </button>
          </div>
        </div>
      )}

      {/* Lista de vagas */}
      <div className="space-y-3">
        {vagas.map((vaga) => (
          <div key={vaga.id}>
            {editandoId === vaga.id ? (
              /* Linha de edição */
              <div className="p-4 border-2 border-navy-200 bg-brand-light rounded-xl space-y-3">
                <p className="text-xs font-bold text-navy-600 uppercase tracking-wide">Editando</p>
                <div className="flex gap-2">
                  <div className="w-20">
                    <label className="label-field text-xs">Ícone <span className="text-slate-400 font-normal">(opt.)</span></label>
                    <input
                      type="text"
                      className="input-field py-2 text-center text-xl"
                      value={formEdit.icon}
                      onChange={(e) => setFormEdit((f) => ({ ...f, icon: e.target.value }))}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="label-field text-xs">Nome</label>
                    <input
                      type="text"
                      className="input-field py-2"
                      value={formEdit.nome}
                      onChange={(e) => setFormEdit((f) => ({ ...f, nome: e.target.value }))}
                    />
                  </div>
                  <div className="w-20">
                    <label className="label-field text-xs">Ordem</label>
                    <input
                      type="number"
                      className="input-field py-2"
                      value={formEdit.ordem}
                      onChange={(e) => setFormEdit((f) => ({ ...f, ordem: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => { setEditandoId(null); setErro(""); }}
                    className="btn-secondary py-1.5 px-3 text-sm flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => salvarEdicao(vaga.id)}
                    disabled={loading === vaga.id}
                    className="btn-primary py-1.5 px-3 text-sm flex items-center gap-1"
                  >
                    {loading === vaga.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Check className="w-3.5 h-3.5" />}
                    Salvar
                  </button>
                </div>
              </div>
            ) : excluindoId === vaga.id ? (
              /* Confirmação de exclusão */
              <div className="flex items-center justify-between p-4 rounded-xl border-2 border-red-200 bg-red-50">
                <p className="text-sm text-red-700 font-medium">
                  Excluir <strong>{vaga.nome}</strong>? Esta ação não pode ser desfeita.
                </p>
                <div className="flex gap-2 ml-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setExcluindoId(null)}
                    className="btn-secondary py-1.5 px-3 text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => confirmarExclusao(vaga.id)}
                    disabled={loading === vaga.id}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-xl text-sm flex items-center gap-1 transition-colors"
                  >
                    {loading === vaga.id
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Trash2 className="w-3.5 h-3.5" />}
                    Excluir
                  </button>
                </div>
              </div>
            ) : (
              /* Linha normal */
              <div
                className={`flex items-center justify-between p-4 rounded-xl border transition-all
                  ${vaga.ativo
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-slate-100 bg-slate-50 opacity-60"
                  }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className="text-2xl flex-shrink-0">{vaga.icon}</span>
                  <div className="min-w-0">
                    <span className="font-semibold text-slate-700 truncate block">{vaga.nome}</span>
                    <span className="text-xs text-slate-400">Ordem: {vaga.ordem}</span>
                  </div>
                  {vaga.ativo && (
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">
                      Visível
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                  {/* Toggle */}
                  <button
                    type="button"
                    onClick={() => toggle(vaga.id, !vaga.ativo)}
                    disabled={loading === vaga.id}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none
                      ${vaga.ativo ? "bg-emerald-500" : "bg-slate-300"}
                      ${loading === vaga.id ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                    aria-label={vaga.ativo ? "Desativar" : "Ativar"}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
                        ${vaga.ativo ? "translate-x-6" : "translate-x-1"}`}
                    />
                  </button>

                  {/* Editar */}
                  <button
                    type="button"
                    onClick={() => abrirEdicao(vaga)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-navy-600 hover:bg-white transition-colors"
                    aria-label="Editar vaga"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>

                  {/* Excluir */}
                  <button
                    type="button"
                    onClick={() => { setExcluindoId(vaga.id); setErro(""); }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label="Excluir vaga"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {vagas.length === 0 && (
          <p className="text-center text-slate-400 py-8 text-sm">
            Nenhuma vaga cadastrada. Clique em &ldquo;Nova vaga&rdquo; para adicionar.
          </p>
        )}
      </div>
    </div>
  );
}
