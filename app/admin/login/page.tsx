"use client";

import { useState, FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Star, Lock } from "lucide-react";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro("");

    const result = await signIn("credentials", {
      email,
      senha,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setErro("E-mail ou senha incorretos. Verifique suas credenciais.");
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-brand flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Star className="w-9 h-9 text-white fill-white" />
          </div>
          <h1 className="text-white font-bold text-xl">Grupo Limpservice</h1>
          <p className="text-white/70 text-sm">Área Administrativa</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-7">
          <div className="flex items-center gap-2 mb-5">
            <Lock className="w-5 h-5 text-navy-600" />
            <h2 className="text-lg font-bold text-navy-600">Acesso restrito</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field" htmlFor="email">E-mail</label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="label-field" htmlFor="senha">Senha</label>
              <div className="relative">
                <input
                  id="senha"
                  type={showSenha ? "text" : "password"}
                  autoComplete="current-password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowSenha(!showSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showSenha ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {erro && (
              <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-sm text-red-600">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando…
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-5">
            Acesso exclusivo para a equipe de RH do Grupo Limpservice
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-brand" />}>
      <LoginForm />
    </Suspense>
  );
}
