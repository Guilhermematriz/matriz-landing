"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Paleta premium */
const PALETTE = {
  ink: "#0B1220",
  inkDeep: "#070E19",
  gold: "#C9A227",
  goldSoft: "#E6D7A6",
  gray: "#6B7280",
  border: "rgba(0,0,0,.08)",
} as const;

/** Utils BR */
const currency = (v: number | string) => {
  const n = typeof v === "string" ? Number(v.replace(/\D/g, "")) / 100 : v;
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((n as number) || 0);
  } catch {
    return `R$ ${n}`;
  }
};

/** Micro UI */
const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = "", ...props }) => (
  <button
    className={
      "group relative inline-flex items-center justify-center rounded-2xl px-5 py-3 font-medium text-white transition active:scale-[.98] disabled:opacity-60 " +
      className
    }
    style={{ background: `linear-gradient(180deg, ${PALETTE.ink} 0%, ${PALETTE.inkDeep} 100%)` }}
    {...props}
  >
    <span className="absolute inset-0 rounded-2xl ring-1 ring-black/5" />
    <span className="relative">Continuar</span>
  </button>
);

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div
    className={
      "rounded-3xl border bg-white/90 shadow-[0_6px_24px_rgba(0,0,0,.06)] backdrop-blur " +
      className
    }
    style={{ borderColor: PALETTE.border }}
    {...props}
  />
);

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = "", ...props }) => (
  <div className={"p-6 md:p-8 " + className} {...props} />
);

/** Tipos */
type Cadastro = {
  nome: string;
  cidade: string;
  rendaBruta: number | null;
  possuiFgts: "Sim" | "Não" | "Não sei" | "";
  fgtsValor: number | null;
  entradaDisponivel: string;
  usaBensNaEntrada: "Imóvel" | "Carro" | "Ambos" | "Não" | "";
  bensDescricao: string;
  temTerreno: "Sim" | "Não" | "";
  terrenoLocal: string;
  terrenoQuitado: "Sim" | "Não" | "";
  terrenoSaldoDevedor: number | null;
  bairroInteresse: string;
  quartos: string;
  quartosCustomizado: string;
  possuiFinanciamentoAtual: "Sim" | "Não" | "";
  quaisFinanciamentos: string;
  regimeTrabalho: "CLT" | "Empresário" | "Funcionário público" | "Autônomo/Outro" | "";
  temImovelNoNome: "Sim" | "Não" | "";
  whatsapp: string;
  origem: string;
};

/** Helpers UI declarados antes do steps */
function SectionTitle({ kicker, title, sub }: { kicker?: string; title: string; sub?: string }) {
  return (
    <div className="mb-6">
      {kicker && <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">{kicker}</div>}
      <h2 className="text-2xl font-semibold md:text-3xl" style={{ color: PALETTE.ink }}>
        {title}
      </h2>
      {sub && <p className="mt-2 text-zinc-600">{sub}</p>}
    </div>
  );
}

function Question({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div>
      <h3
        className="text-lg font-semibold"
        style={{ borderBottom: `2px solid ${PALETTE.border}`, paddingBottom: 6, color: PALETTE.ink }}
      >
        {text}
      </h3>
      {children}
    </div>
  );
}

function RadioRow({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((opt) => {
        const active = value === opt;
        return (
          <label
            key={opt}
            className={
              "flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition " +
              (active ? "border-amber-500/70 bg-amber-50/70" : "border-zinc-200 hover:bg-zinc-50")
            }
          >
            <input type="radio" className="h-4 w-4" checked={active} onChange={() => onChange(opt)} />
            <span className="font-medium">{opt}</span>
          </label>
        );
      })}
    </div>
  );
}

function CurrencyInput({ value, onValue }: { value: number | null; onValue: (n: number) => void }) {
  const [txt, setTxt] = useState(value ? currency(value) : "");
  const onChange = (v: string) => {
    const onlyNumbers = v.replace(/\D/g, "");
    const num = Number(onlyNumbers) / 100;
    try {
      setTxt(new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num || 0));
    } catch {
      setTxt("R$ " + num);
    }
    onValue(num);
  };
  return (
    <input
      inputMode="numeric"
      className="mt-3 w-full rounded-xl border p-3 outline-none ring-amber-200 focus:ring-2"
      placeholder="R$ 0,00"
      value={txt}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

/** Autoridade */
const Stat: React.FC<{ number: string; label: string }> = ({ number, label }) => (
  <div className="rounded-2xl border p-6 text-center" style={{ borderColor: PALETTE.border }}>
    <div className="text-4xl font-bold" style={{ color: PALETTE.ink }}>
      {number}
    </div>
    <div className="mt-1 text-zinc-600">{label}</div>
  </div>
);

const Gallery: React.FC<{ images: string[]; caption?: string }> = ({ images, caption }) => {
  const [i, setI] = useState(0);
  const prev = () => setI((n) => (n - 1 + images.length) % images.length);
  const next = () => setI((n) => (n + 1) % images.length);
  return (
    <div className="relative overflow-hidden rounded-3xl border" style={{ borderColor: PALETTE.border }}>
      <img
        src={images[i]}
        alt="galeria"
        className="h-[340px] w-full object-cover"
        onError={(e) => {
          const t = e.currentTarget as HTMLImageElement;
          t.style.opacity = "0.12";
          t.style.background = `linear-gradient(45deg, ${PALETTE.ink}10, #00000011)`;
        }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
        <button onClick={prev} className="rounded-xl bg-white/85 px-3 py-1 text-sm shadow">
          ‹ Anterior
        </button>
        <div className="rounded-xl bg-white/85 px-2 py-1 text-xs shadow">
          {i + 1}/{images.length}
        </div>
        <button onClick={next} className="rounded-xl bg-white/85 px-3 py-1 text-sm shadow">
          Próximo ›
        </button>
      </div>
      {caption && <div className="p-3 text-sm text-zinc-600">{caption}</div>}
    </div>
  );
};

/** Steps builder */
function buildSteps(data: Cadastro, setData: React.Dispatch<React.SetStateAction<Cadastro>>) {
  const steps: { id: string; render: React.ReactNode; validate: () => boolean }[] = [];

  steps.push({
    id: "nome",
    render: (
      <Question text="Qual é o seu nome completo?">
        <input
          className="mt-3 w-full rounded-xl border p-3 outline-none ring-amber-200 focus:ring-2"
          placeholder="Seu nome"
          value={data.nome}
          onChange={(e) => setData((d) => ({ ...d, nome: e.target.value }))}
        />
      </Question>
    ),
    validate: () => data.nome.trim().length >= 2,
  });

  steps.push({
    id: "cidade",
    render: (
      <Question text="Cidade/UF onde pretende construir?">
        <input
          className="mt-3 w-full rounded-xl border p-3 outline-none ring-amber-200 focus:ring-2"
          placeholder="Ex: Limeira/SP"
          value={data.cidade}
          onChange={(e) => setData((d) => ({ ...d, cidade: e.target.value }))}
        />
        <p className="mt-2 text-sm text-zinc-500">
          Se for Limeira, exemplos: Marajoara, Colinas do Engenho, Palmeiras Reais. Se for Iracemápolis, daremos outras
          sugestões.
        </p>
      </Question>
    ),
    validate: () => data.cidade.trim().length >= 2,
  });

  steps.push({
    id: "renda",
    render: (
      <Question text="Renda bruta familiar mensal (R$)">
        <CurrencyInput value={data.rendaBruta} onValue={(n) => setData((d) => ({ ...d, rendaBruta: n }))} />
      </Question>
    ),
    validate: () => !!data.rendaBruta && (data.rendaBruta as number) > 0,
  });

  steps.push({
    id: "fgts",
    render: (
      <Question text="Possui FGTS para utilizar no financiamento?">
        <RadioRow options={["Sim", "Não", "Não sei"]} value={data.possuiFgts} onChange={(v) => setData((d) => ({ ...d, possuiFgts: v as any }))} />
        {data.possuiFgts === "Sim" && (
          <div className="mt-3">
            <label className="text-sm text-zinc-700">Quanto de FGTS você tem disponível (R$)?</label>
            <CurrencyInput value={data.fgtsValor} onValue={(n) => setData((d) => ({ ...d, fgtsValor: n }))} />
          </div>
        )}
      </Question>
    ),
    validate: () => data.possuiFgts !== "" && (data.possuiFgts !== "Sim" || (!!data.fgtsValor && (data.fgtsValor as number) > 0)),
  });

  steps.push({
    id: "entrada",
    render: (
      <Question text="Entrada em dinheiro disponível">
        <RadioRow
          options={[
            "Até 10 mil",
            "10–30 mil",
            "30–60 mil",
            "60 mil",
            "70 mil",
            "80 mil",
            "90 mil",
            "100 mil",
            "130 mil",
            "150 mil",
            "180 mil",
            "200 mil",
            "200 mil+",
          ]}
          value={data.entradaDisponivel}
          onChange={(v) => setData((d) => ({ ...d, entradaDisponivel: v }))}
        />
      </Question>
    ),
    validate: () => data.entradaDisponivel !== "",
  });

  steps.push({
    id: "bens",
    render: (
      <Question text="Pretende usar imóvel e/ou carro na entrada?">
        <RadioRow options={["Imóvel", "Carro", "Ambos", "Não"]} value={data.usaBensNaEntrada} onChange={(v) => setData((d) => ({ ...d, usaBensNaEntrada: v as any }))} />
        {data.usaBensNaEntrada !== "Não" && data.usaBensNaEntrada !== "" && (
          <textarea
            className="mt-3 w-full rounded-xl border p-3 outline-none ring-amber-200 focus:ring-2"
            placeholder="Descreva: modelo/ano do carro, valor aproximado do imóvel, etc."
            value={data.bensDescricao}
            onChange={(e) => setData((d) => ({ ...d, bensDescricao: e.target.value }))}
          />
        )}
      </Question>
    ),
    validate: () => data.usaBensNaEntrada !== "" && (data.usaBensNaEntrada === "Não" || data.bensDescricao.trim().length >= 2),
  });

  steps.push({
    id: "temTerreno",
    render: (
      <Question text="Você já possui terreno?">
        <RadioRow options={["Sim", "Não"]} value={data.temTerreno} onChange={(v) => setData((d) => ({ ...d, temTerreno: v as any }))} />
      </Question>
    ),
    validate: () => data.temTerreno !== "",
  });

  if (data.temTerreno === "Sim") {
    steps.push({
      id: "terrenoLocal",
      render: (
        <Question text="Onde fica o terreno?">
          <input
            className="mt-3 w-full rounded-xl border p-3 outline-none ring-amber-200 focus:ring-2"
            placeholder="Bairro, cidade"
            value={data.terrenoLocal}
            onChange={(e) => setData((d) => ({ ...d, terrenoLocal: e.target.value }))}
          />
        </Question>
      ),
      validate: () => data.terrenoLocal.trim().length >= 2,
    });

    steps.push({
      id: "terrenoQuitado",
      render: (
        <Question text="O terreno está quitado?">
          <RadioRow options={["Sim", "Não"]} value={data.terrenoQuitado} onChange={(v) => setData((d) => ({ ...d, terrenoQuitado: v as any }))} />
        </Question>
      ),
      validate: () => data.terrenoQuitado !== "",
    });

    if (data.terrenoQuitado === "Não") {
      steps.push({
        id: "terrenoSaldo",
        render: (
          <Question text="Valor aproximado que falta quitar do terreno (R$)">
            <CurrencyInput value={data.terrenoSaldoDevedor} onValue={(n) => setData((d) => ({ ...d, terrenoSaldoDevedor: n }))} />
          </Question>
        ),
        validate: () => !!data.terrenoSaldoDevedor && (data.terrenoSaldoDevedor as number) > 0,
      });
    }
  } else if (data.temTerreno === "Não") {
    steps.push({
      id: "bairroInteresse",
      render: (
        <Question text="Em qual bairro você tem interesse?">
          <input
            className="mt-3 w-full rounded-xl border p-3 outline-none ring-amber-200 focus:ring-2"
            placeholder={
              data.cidade.toLowerCase().includes("limeira")
                ? "Ex: Marajoara, Colinas do Engenho, Palmeiras Reais"
                : "Digite o bairro de interesse"
            }
            value={data.bairroInteresse}
            onChange={(e) => setData((d) => ({ ...d, bairroInteresse: e.target.value }))}
          />
        </Question>
      ),
      validate: () => data.bairroInteresse.trim().length >= 2,
    });
  }

  steps.push({
    id: "quartos",
    render: (
      <Question text="Quantidade de quartos desejada">
        <RadioRow
          options={["1 quarto", "2 quartos", "2 quartos com 1 suíte", "3 quartos", "3 quartos com 1 suíte", "Customizado"]}
          value={data.quartos}
          onChange={(v) => setData((d) => ({ ...d, quartos: v }))}
        />
        {data.quartos === "Customizado" && (
          <input
            className="mt-3 w-full rounded-xl border p-3 outline-none ring-amber-200 focus:ring-2"
            placeholder="Descreva a configuração desejada"
            value={data.quartosCustomizado}
            onChange={(e) => setData((d) => ({ ...d, quartosCustomizado: e.target.value }))}
          />
        )}
      </Question>
    ),
    validate: () => data.quartos !== "" && (data.quartos !== "Customizado" || data.quartosCustomizado.trim().length > 1),
  });

  steps.push({
    id: "financiamentos",
    render: (
      <Question text="Você paga algum financiamento atualmente? (carro, moto, empréstimo)">
        <RadioRow
          options={["Sim", "Não"]}
          value={data.possuiFinanciamentoAtual}
          onChange={(v) => setData((d) => ({ ...d, possuiFinanciamentoAtual: v as any }))} />
        {data.possuiFinanciamentoAtual === "Sim" && (
          <input
            className="mt-3 w-full rounded-xl border p-3 outline-none ring-amber-200 focus:ring-2"
            placeholder="Quais? Ex: carro e empréstimo consignado"
            value={data.quaisFinanciamentos}
            onChange={(e) => setData((d) => ({ ...d, quaisFinanciamentos: e.target.value }))}
          />
        )}
      </Question>
    ),
    validate: () => data.possuiFinanciamentoAtual !== "" && (data.possuiFinanciamentoAtual === "Não" || data.quaisFinanciamentos.trim().length >= 2),
  });

  steps.push({
    id: "regime",
    render: (
      <Question text="Qual é o seu regime de trabalho?">
        <RadioRow
          options={["CLT", "Empresário", "Funcionário público", "Autônomo/Outro"]}
          value={data.regimeTrabalho}
          onChange={(v) => setData((d) => ({ ...d, regimeTrabalho: v as any }))}
        />
      </Question>
    ),
    validate: () => data.regimeTrabalho !== "",
  });

  steps.push({
    id: "imovel",
    render: (
      <Question text="Você tem algum imóvel (casa) no seu nome?">
        <RadioRow options={["Sim", "Não"]} value={data.temImovelNoNome} onChange={(v) => setData((d) => ({ ...d, temImovelNoNome: v as any }))} />
      </Question>
    ),
    validate: () => data.temImovelNoNome !== "",
  });

  steps.push({
    id: "whatsapp",
    render: (
      <Question text="Por fim, qual é o seu WhatsApp? (com DDD)">
        <input
          inputMode="tel"
          className="mt-3 w-full rounded-xl border p-3 outline-none ring-amber-200 focus:ring-2"
          placeholder="(19) 9 9999-9999"
          value={data.whatsapp}
          onChange={(e) => setData((d) => ({ ...d, whatsapp: e.target.value }))}
        />
        <p className="mt-2 text-sm text-zinc-500">
          Ao enviar, avisaremos que entraremos em contato em até <strong>24h úteis</strong>.
        </p>
      </Question>
    ),
    validate: () => /\d{10,15}/.test(data.whatsapp.replace(/\D/g, "")),
  });

  return steps;
}

/** Página */
export default function ImobiliariaMatrizLanding_v3() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<Cadastro>({
    nome: "",
    cidade: "",
    rendaBruta: null,
    possuiFgts: "",
    fgtsValor: null,
    entradaDisponivel: "",
    usaBensNaEntrada: "",
    bensDescricao: "",
    temTerreno: "",
    terrenoLocal: "",
    terrenoQuitado: "",
    terrenoSaldoDevedor: null,
    bairroInteresse: "",
    quartos: "",
    quartosCustomizado: "",
    possuiFinanciamentoAtual: "",
    quaisFinanciamentos: "",
    regimeTrabalho: "",
    temImovelNoNome: "",
    whatsapp: "",
    origem:
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).toString() || "direct"
        : "direct",
  });

  const steps = useMemo(() => buildSteps(data, setData), [data]);
  const [stepIndex, setStepIndex] = useState(0);
  const progress = Math.round(((done ? steps.length : stepIndex) / steps.length) * 100);
  const canNext = steps[stepIndex]?.validate?.() ?? false;

  const next = () => setStepIndex((s) => Math.min(s + 1, steps.length - 1));
  const back = () => setStepIndex((s) => Math.max(s - 1, 0));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Falha ao enviar cadastro");
      setDone(true);
    } catch {
      alert("Não foi possível enviar seu cadastro agora. Tente novamente em instantes.");
    } finally {
      setSubmitting(false);
    }
  };

  /** self-test dev */
  useEffect(() => {
    try {
      if (!Array.isArray(steps) || steps.length === 0) throw new Error("steps vazio");
      const bad = steps.find((s) => !s || typeof s.id !== "string" || !s.render || typeof s.validate !== "function");
      if (bad) throw new Error("step malformado: " + JSON.stringify(bad?.id));
    } catch (err) {
      console.error("[SelfTest] erro:", err);
    }
  }, [steps]);

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_600px_at_80%_-10%,rgba(201,162,39,.1),transparent),linear-gradient(to_bottom,#ffffff,rgba(255,255,255,.6))] text-zinc-900">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur" style={{ borderColor: PALETTE.border }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-xl border" style={{ borderColor: PALETTE.border }}>
              <div className="h-4 w-4 rounded-sm" style={{ background: PALETTE.gold }} />
            </div>
            <span className="text-lg font-semibold" style={{ color: PALETTE.ink }}>
              Imobiliária Matriz
            </span>
          </div>
          <a href="#simulador" className="text-sm font-medium text-amber-700 hover:underline">
            Simular agora
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-4 text-4xl font-semibold leading-tight md:text-5xl" style={{ color: PALETTE.ink }}>
              Seu sonho, nosso compromisso:
              <span className="ml-2 bg-gradient-to-b from-amber-500 to-amber-700 bg-clip-text text-transparent">
                casa própria
              </span>{" "}
              com tudo em um só lugar
            </h1>
            <p className="mb-6 text-lg text-zinc-700">
              Cuidamos de ponta a ponta: escolha do terreno, projeto, aprovações (Prefeitura/Receita/CNO), crédito
              (Correspondente Caixa) e obra com garantia conforme ABNT.
            </p>
            <ul className="mb-8 grid gap-3 text-zinc-800">
              <li>• Correspondente Caixa + Engenharia + Execução da Obra</li>
              <li>• Entrada flexível (podemos parcelar) e aceitamos bens (carro/imóvel)</li>
              <li>• Entrega assistida + pós-obra com orientações de manutenção</li>
            </ul>
            <div className="flex flex-wrap gap-3">
              <a href="#simulador">
                <button className="rounded-2xl px-5 py-3 font-medium text-white shadow"
                        style={{ background: `linear-gradient(180deg, ${PALETTE.ink} 0%, ${PALETTE.inkDeep} 100%)` }}>
                  Quero simular agora
                </button>
              </a>
              <a className="rounded-2xl px-5 py-3 font-medium underline" href="#autoridade">
                Nossos resultados
              </a>
            </div>
          </div>

          {/* Vídeo */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="relative"
          >
            <div className="aspect-video w-full overflow-hidden rounded-3xl border bg-white shadow"
                 style={{ borderColor: PALETTE.border }}>
              <iframe
                className="h-full w-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0"
                title="Como funciona nosso processo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div
              className="pointer-events-none absolute -bottom-5 -right-5 hidden rotate-2 rounded-2xl px-3 py-1 text-sm font-medium text-white md:block"
              style={{ background: PALETTE.ink }}
            >
              Vídeo explicativo
            </div>
          </motion.div>
        </div>
      </section>

      {/* Autoridade */}
      <section id="autoridade" className="mx-auto max-w-6xl px-4 pb-4">
        <Card>
          <CardContent>
            <div className="grid gap-6 text-center sm:grid-cols-3">
              <Stat number="470+" label="casas construídas" />
              <Stat number="17" label="anos de experiência" />
              <Stat number="450+" label="famílias atendidas" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Como funciona */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <SectionTitle title="Como funciona, na prática" sub="Tudo centralizado: documentação, crédito, projeto e obra." />
        <div className="grid gap-6 md:grid-cols-3">
          {["Documentação & Aprovação", "Crédito & Caixa", "Projeto & Obra"].map((t, i) => (
            <Card key={i}>
              <CardContent>
                <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                  Etapa {i + 1}
                </div>
                <h3 className="mb-2 text-xl font-semibold" style={{ color: PALETTE.ink }}>
                  {t}
                </h3>
                <p className="text-zinc-700">
                  {i === 0 && "Escolha do terreno + licenças (Prefeitura, CNO/Receita) com nossa assessoria."}
                  {i === 1 && "Análise e condução do crédito como Correspondente Caixa, com transparência."}
                  {i === 2 && "Projeto executivo + obra completa com garantia conforme ABNT."}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Galerias */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <SectionTitle title="Algumas casas que construímos" />
        <Gallery
          images={["/galeria/casa1.jpg", "/galeria/casa2.jpg", "/galeria/casa3.jpg", "/galeria/casa4.jpg"]}
          caption="Substitua por fotos reais das suas obras em /public/galeria"
        />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-10">
        <SectionTitle title="Clientes felizes" />
        <Gallery
          images={["/clientes/cliente1.jpg", "/clientes/cliente2.jpg", "/clientes/cliente3.jpg"]}
          caption="Fotos autorizadas pelos clientes. Substitua por imagens reais em /public/clientes"
        />
      </section>

      {/* Depoimentos */}
      <section className="mx-auto max-w-6xl px-4 pb-10">
        <Card>
          <CardContent>
            <SectionTitle title="Depoimentos" />
            <div className="grid gap-6 md:grid-cols-3">
              {[
                { n: "Carla & João", t: "Realizamos o sonho da nossa casa com todo suporte da Matriz." },
                { n: "André", t: "Processo de crédito transparente e obra entregue no prazo." },
                { n: "Luciana", t: "Acompanhamento do começo ao fim. Recomendo muito!" },
              ].map((d, i) => (
                <blockquote key={i} className="rounded-2xl border p-4 text-zinc-700" style={{ borderColor: PALETTE.border }}>
                  <p>“{d.t}”</p>
                  <footer className="mt-2 text-sm font-semibold" style={{ color: PALETTE.ink }}>
                    {d.n}
                  </footer>
                </blockquote>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Programas */}
      <section className="mx-auto max-w-6xl px-4 pb-4">
        <Card>
          <CardContent>
            <SectionTitle title="Linhas de financiamento" />
            <p className="text-zinc-700">
              Minha Casa Minha Vida (quando elegível), FGTS, SBPE, Carta de Crédito e outras. Indicamos a melhor rota de acordo
              com sua renda, FGTS e perfil.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Simulador */}
      <section id="simulador" className="mx-auto max-w-3xl px-4 py-12">
        <Card className="overflow-hidden" style={{ borderColor: PALETTE.gold + "55" }}>
          <div className="h-2 w-full bg-amber-200/40">
            <div className="h-2 transition-all" style={{ width: `${progress}%`, backgroundColor: PALETTE.gold }} />
          </div>

          <CardContent>
            <h2 className="mb-1 text-2xl font-semibold" style={{ color: PALETTE.ink }}>
              Simule em 1 minuto
            </h2>
            <p className="mb-6 text-zinc-600">
              Responda 1 pergunta por vez. Ao final, entraremos em contato no seu WhatsApp em até{" "}
              <strong>24h úteis</strong>.
            </p>

            {!done ? (
              <div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={steps[stepIndex]?.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="mb-6"
                  >
                    {steps[stepIndex]?.render}
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <button
                    onClick={back}
                    disabled={stepIndex === 0}
                    className="text-zinc-600 underline disabled:opacity-40"
                  >
                    Voltar
                  </button>

                  {stepIndex < steps.length - 1 ? (
                    <Button onClick={next} disabled={!canNext}>
                      Continuar
                    </Button>
                  ) : (
                    <Button onClick={handleSubmit} disabled={!canNext || submitting}>
                      {submitting ? "Enviando…" : "Concluir e enviar"}
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full p-3" style={{ backgroundColor: `${PALETTE.gold}1A` }}>
                  <div className="h-full w-full rounded-full" style={{ backgroundColor: PALETTE.gold }} />
                </div>
                <h3 className="mb-2 text-2xl font-semibold" style={{ color: PALETTE.ink }}>
                  Cadastro enviado!
                </h3>
                <p className="mx-auto max-w-md text-zinc-600">
                  Obrigado, {data.nome.split(" ")[0]}! Entraremos em contato via WhatsApp {data.whatsapp} em até{" "}
                  <strong>24h úteis</strong> com sua simulação.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* CTA final */}
      <section className="mx-auto max-w-6xl px-4 pb-12">
        <Card style={{ borderColor: PALETTE.gold + "55" }}>
          <CardContent className="flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <h3 className="text-2xl font-semibold" style={{ color: PALETTE.ink }}>
                Pronto(a) para dar o próximo passo?
              </h3>
              <p className="text-zinc-600">Fazemos a sua viabilidade sem compromisso e indicamos o melhor caminho.</p>
            </div>
            <a href="#simulador">
              <button className="rounded-2xl px-5 py-3 font-medium text-white shadow"
                      style={{ background: `linear-gradient(180deg, ${PALETTE.ink} 0%, ${PALETTE.inkDeep} 100%)` }}>
                Simular agora
              </button>
            </a>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 pb-20 pt-8 text-sm text-zinc-600">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <p>
            © {new Date().getFullYear()} Imobiliária Matriz — Seu sonho é o nosso compromisso.
          </p>
          <p>Atendimento: Seg-Sex 9h–19h · Sáb 10h–14h</p>
        </div>
      </footer>
    </div>
  );
}
