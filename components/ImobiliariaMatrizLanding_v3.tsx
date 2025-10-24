"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * Paleta simples pra usar em estilos inline onde precisar
 * (mantém compatibilidade com Tailwind existente).
 */
const PALETTE = {
  ink: "#0f172a", // slate-900
  border: "#e2e8f0", // slate-200
  primary: "#0ea5e9", // sky-500
  primaryDark: "#0284c7", // sky-600
  bg: "#ffffff",
};

/**
 * Toggle de Dark Mode embutido
 * (evita dependência de '@/components/DarkToggle').
 * Tailwind deve estar com 'darkMode: "class"' no tailwind.config.js.
 */
function DarkToggle() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (enabled) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [enabled]);

  return (
    <button
      type="button"
      onClick={() => setEnabled((v) => !v)}
      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition hover:bg-slate-50 dark:hover:bg-slate-800"
      aria-pressed={enabled}
    >
      <span
        className={`inline-block size-2 rounded-full ${
          enabled ? "bg-yellow-400" : "bg-slate-300"
        }`}
      />
      {enabled ? "Dark on" : "Dark off"}
    </button>
  );
}

/**
 * Componente principal da Landing
 */
export default function ImobiliariaMatrizLanding_v3() {
  // ---- estado do formulário
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<null | { id?: string }>(null);
  const [err, setErr] = useState<string | null>(null);

  // campos
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cidade, setCidade] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setOk(null);

    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nome.trim(),
          telefone: telefone.trim(),
          email: email.trim(),
          cidade: cidade.trim(),
        }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Erro ao enviar");
      }

      const data = await res.json().catch(() => ({}));
      setOk({ id: data?.id });
      setNome("");
      setTelefone("");
      setEmail("");
      setCidade("");
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao enviar. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* topo */}
      <header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <div className="text-sm">
            <a href="#simular" className="text-sky-600 hover:underline">
              Simular agora
            </a>
          </div>
          <DarkToggle />
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-5xl px-4 py-10">
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="text-3xl font-semibold leading-tight sm:text-4xl"
        >
          Seu sonho, nosso compromisso:{" "}
          <span className="text-sky-600">casa própria</span> com tudo em um só
          lugar
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mt-3 max-w-3xl text-base text-slate-600 dark:text-slate-300"
        >
          Cuidamos de ponta a ponta: terreno, crédito (Correspondente Caixa),
          projeto e obra com garantia. Atendemos MCMV quando elegível e outras
          modalidades.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="mt-3"
        >
          <a
            href="#cases"
            className="text-sm font-medium text-slate-700 underline hover:text-sky-700 dark:text-slate-300 dark:hover:text-sky-400"
          >
            Nossos resultados
          </a>
        </motion.div>

        {/* vídeo */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative mt-8"
        >
          <div
            className="aspect-video w-full overflow-hidden rounded-3xl border bg-white shadow dark:bg-slate-900"
            style={{ borderColor: PALETTE.border }}
          >
            <iframe
              className="h-full w-full"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1&playsinline=1"
              title="Como funciona nosso processo"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* badge decorativo opcional */}
          <div
            className="pointer-events-none absolute -bottom-5 -right-5 hidden rotate-2 rounded-2xl px-3 py-1 text-sm font-medium text-white shadow md:block"
            style={{ background: PALETTE.ink }}
          >
            Atendimento humanizado
          </div>
        </motion.div>
      </section>

      {/* formulário */}
      <section id="simular" className="mx-auto max-w-5xl px-4 pb-12">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-xl font-semibold"
        >
          Simule em 1 minuto
        </motion.h2>

        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Responda 1 pergunta por vez. Ao final, entraremos em contato no seu
          WhatsApp em até <strong>24h úteis</strong>.
        </p>

        <form
          onSubmit={onSubmit}
          className="mt-5 grid gap-4 rounded-2xl border p-4 shadow-sm dark:border-slate-800"
          style={{ borderColor: PALETTE.border }}
        >
          {/* nome */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Qual é o seu nome completo?
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              placeholder="Seu nome"
              className="w-full rounded-lg border px-3 py-2 outline-none transition placeholder:text-slate-400 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          {/* telefone */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              WhatsApp (com DDD)
            </label>
            <input
              type="tel"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              required
              placeholder="(11) 99999-9999"
              className="w-full rounded-lg border px-3 py-2 outline-none transition placeholder:text-slate-400 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          {/* email */}
          <div>
            <label className="mb-1 block text-sm font-medium">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="voce@email.com"
              className="w-full rounded-lg border px-3 py-2 outline-none transition placeholder:text-slate-400 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          {/* cidade */}
          <div>
            <label className="mb-1 block text-sm font-medium">
              Cidade/UF onde pretende construir
            </label>
            <input
              type="text"
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              required
              placeholder="Ex.: Campinas/SP"
              className="w-full rounded-lg border px-3 py-2 outline-none transition placeholder:text-slate-400 focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900"
            />
          </div>

          {/* feedback */}
          {err && (
            <p className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-300">
              {err}
            </p>
          )}
          {ok && (
            <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300">
              Recebemos seus dados. Vamos te chamar no WhatsApp em até 24h
              úteis. (Protocolo: {ok.id ?? "—"})
            </p>
          )}

          <div className="mt-2 flex items-center justify-between gap-3">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-4 py-2 text-white shadow transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Enviando..." : "Quero simular agora"}
            </button>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Horário: Seg–Sex 9h–19h · Sáb 10h–14h
            </span>
          </div>
        </form>
      </section>

      {/* rodapé */}
      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Imobiliária Matriz — Seu sonho é o nosso
          compromisso.
        </div>
      </footer>
    </main>
  );
}
