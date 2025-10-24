
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const PALETTE = { navy: "#0B1A2A", navyDeep: "#081223", gold: "#C9A227" } as const;

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

function Question({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xl font-semibold" style={{ borderBottom: `2px solid ${PALETTE.gold}33`, paddingBottom: 6 }}>{text}</h3>
      {children}
    </div>
  );
}
function RadioRow({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
      {options.map((opt) => (
        <label key={opt} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 ${value === opt ? "border-[#C9A227] bg-[#C9A227]/10" : "border-zinc-200"}`}>
          <input type="radio" className="h-4 w-4" checked={value === opt} onChange={() => onChange(opt)} />
          <span className="font-medium">{opt}</span>
        </label>
      ))}
    </div>
  );
}
function CurrencyInput({ value, onValue }: { value: number | null; onValue: (n: number) => void }) {
  const [txt, setTxt] = useState(value ? String(value) : "");
  const onChange = (v: string) => {
    const onlyNumbers = v.replace(/\D/g, "");
    const num = Number(onlyNumbers) / 100;
    try { setTxt(new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(num || 0)); }
    catch { setTxt("R$ " + num); }
    onValue(num);
  };
  return (
    <input inputMode="numeric" className="mt-3 w-full rounded-xl border p-3 outline-none focus:ring-2" placeholder="R$ 0,00" value={txt} onChange={(e) => onChange(e.target.value)} />
  );
}

function buildSteps(data: Cadastro, setData: React.Dispatch<React.SetStateAction<Cadastro>>) {
  const steps: { id: string; render: React.ReactNode; validate: () => boolean }[] = [];
  steps.push({ id: "nome", render: (
    <Question text="Qual é o seu nome completo?">
      <input className="mt-3 w-full rounded-xl border p-3 outline-none focus:ring-2" placeholder="Seu nome" value={data.nome} onChange={(e) => setData((d) => ({ ...d, nome: e.target.value }))} />
    </Question>
  ), validate: () => data.nome.trim().length >= 2 });

  steps.push({ id: "cidade", render: (
    <Question text="Cidade/UF onde pretende construir?">
      <input className="mt-3 w-full rounded-xl border p-3 outline-none focus:ring-2" placeholder="Ex: Limeira/SP" value={data.cidade} onChange={(e) => setData((d) => ({ ...d, cidade: e.target.value }))} />
    </Question>
  ), validate: () => data.cidade.trim().length >= 2 });

  steps.push({ id: "renda", render: (
    <Question text="Renda bruta familiar mensal (R$)"><CurrencyInput value={data.rendaBruta} onValue={(n) => setData((d) => ({ ...d, rendaBruta: n }))} /></Question>
  ), validate: () => !!data.rendaBruta && (data.rendaBruta as number) > 0 });

  steps.push({ id: "fgts", render: (
    <Question text="Possui FGTS para utilizar no financiamento?">
      <RadioRow options={["Sim", "Não", "Não sei"]} value={data.possuiFgts} onChange={(v) => setData((d) => ({ ...d, possuiFgts: v as any }))} />
      {data.possuiFgts === "Sim" && (
        <div className="mt-3">
          <label className="text-sm text-zinc-700">Quanto de FGTS você tem disponível (R$)?</label>
          <CurrencyInput value={data.fgtsValor} onValue={(n)=> setData((d)=>({ ...d, fgtsValor: n }))} />
        </div>
      )}
    </Question>
  ), validate: () => data.possuiFgts !== "" && (data.possuiFgts !== "Sim" || (!!data.fgtsValor && (data.fgtsValor as number) > 0)) });

  steps.push({ id: "entrada", render: (
    <Question text="Entrada em dinheiro disponível">
      <RadioRow options={["Até 10 mil","10–30 mil","30–60 mil","60 mil","70 mil","80 mil","90 mil","100 mil","130 mil","150 mil","180 mil","200 mil","200 mil+"]} value={data.entradaDisponivel} onChange={(v)=> setData((d)=> ({...d, entradaDisponivel: v}))} />
    </Question>
  ), validate: () => data.entradaDisponivel !== "" });

  steps.push({ id: "bens", render: (
    <Question text="Pretende usar imóvel e/ou carro na entrada?">
      <RadioRow options={["Imóvel","Carro","Ambos","Não"]} value={data.usaBensNaEntrada} onChange={(v)=> setData((d)=> ({...d, usaBensNaEntrada: v as any}))} />
      {data.usaBensNaEntrada !== "Não" && data.usaBensNaEntrada !== "" && (
        <textarea className="mt-3 w-full rounded-xl border p-3 outline-none focus:ring-2" placeholder="Descreva: modelo/ano do carro, valor aproximado do imóvel, etc." value={data.bensDescricao} onChange={(e)=> setData((d)=> ({...d, bensDescricao: e.target.value}))} />
      )}
    </Question>
  ), validate: () => data.usaBensNaEntrada !== "" && (data.usaBensNaEntrada === "Não" || data.bensDescricao.trim().length >= 2) });

  steps.push({ id: "temTerreno", render: (
    <Question text="Você já possui terreno?">
      <RadioRow options={["Sim","Não"]} value={data.temTerreno} onChange={(v)=> setData((d)=> ({...d, temTerreno: v as any}))} />
    </Question>
  ), validate: () => data.temTerreno !== "" });

  if (data.temTerreno === "Sim") {
    steps.push({ id: "terrenoLocal", render: (
      <Question text="Onde fica o terreno?">
        <input className="mt-3 w-full rounded-xl border p-3 outline-none focus:ring-2" placeholder="Bairro, cidade" value={data.terrenoLocal} onChange={(e)=> setData((d)=> ({...d, terrenoLocal: e.target.value}))} />
      </Question>
    ), validate: () => data.terrenoLocal.trim().length >= 2 });
    steps.push({ id: "terrenoQuitado", render: (
      <Question text="O terreno está quitado?">
        <RadioRow options={["Sim","Não"]} value={data.terrenoQuitado} onChange={(v)=> setData((d)=> ({...d, terrenoQuitado: v as any}))} />
      </Question>
    ), validate: () => data.terrenoQuitado !== "" });
    if (data.terrenoQuitado === "Não") {
      steps.push({ id: "terrenoSaldo", render: (
        <Question text="Valor aproximado que falta quitar do terreno (R$)"><CurrencyInput value={data.terrenoSaldoDevedor} onValue={(n)=> setData((d)=> ({...d, terrenoSaldoDevedor: n}))} /></Question>
      ), validate: () => !!data.terrenoSaldoDevedor && (data.terrenoSaldoDevedor as number) > 0 });
    }
  } else if (data.temTerreno === "Não") {
    steps.push({ id: "bairroInteresse", render: (
      <Question text="Em qual bairro você tem interesse?">
        <input className="mt-3 w-full rounded-xl border p-3 outline-none focus:ring-2" placeholder={data.cidade.toLowerCase().includes("limeira") ? "Ex: Marajoara, Colinas do Engenho, Palmeiras Reais" : "Digite o bairro de interesse"} value={data.bairroInteresse} onChange={(e)=> setData((d)=> ({...d, bairroInteresse: e.target.value}))} />
      </Question>
    ), validate: () => data.bairroInteresse.trim().length >= 2 });
  }

  steps.push({ id: "quartos", render: (
    <Question text="Quantidade de quartos desejada">
      <RadioRow options={["1 quarto","2 quartos","2 quartos com 1 suíte","3 quartos","3 quartos com 1 suíte","Customizado"]} value={data.quartos} onChange={(v)=> setData((d)=> ({...d, quartos: v}))} />
      {data.quartos === "Customizado" && (
        <input className="mt-3 w-full rounded-xl border p-3 outline-none focus:ring-2" placeholder="Descreva a configuração desejada" value={data.quartosCustomizado} onChange={(e)=> setData((d)=> ({...d, quartosCustomizado: e.target.value}))} />
      )}
    </Question>
  ), validate: () => data.quartos !== "" && (data.quartos !== "Customizado" || data.quartosCustomizado.trim().length > 1) });

  steps.push({ id: "financiamentos", render: (
    <Question text="Você paga algum financiamento atualmente? (carro, moto, empréstimo)">
      <RadioRow options={["Sim","Não"]} value={data.possuiFinanciamentoAtual} onChange={(v)=> setData((d)=> ({...d, possuiFinanciamentoAtual: v as any}))} />
      {data.possuiFinanciamentoAtual === "Sim" && (
        <input className="mt-3 w-full rounded-xl border p-3 outline-none focus:ring-2" placeholder="Quais? Ex: carro e empréstimo consignado" value={data.quaisFinanciamentos} onChange={(e)=> setData((d)=> ({...d, quaisFinanciamentos: e.target.value}))} />
      )}
    </Question>
  ), validate: () => data.possuiFinanciamentoAtual !== "" && (data.possuiFinanciamentoAtual === "Não" || data.quaisFinanciamentos.trim().length >= 2) });

  steps.push({ id: "regime", render: (
    <Question text="Qual é o seu regime de trabalho?">
      <RadioRow options={["CLT","Empresário","Funcionário público","Autônomo/Outro"]} value={data.regimeTrabalho} onChange={(v)=> setData((d)=> ({...d, regimeTrabalho: v as any}))} />
    </Question>
  ), validate: () => data.regimeTrabalho !== "" });

  steps.push({ id: "imovel", render: (
    <Question text="Você tem algum imóvel (casa) no seu nome?">
      <RadioRow options={["Sim","Não"]} value={data.temImovelNoNome} onChange={(v)=> setData((d)=> ({...d, temImovelNoNome: v as any}))} />
    </Question>
  ), validate: () => data.temImovelNoNome !== "" });

  steps.push({ id: "whatsapp", render: (
    <Question text="Por fim, qual é o seu WhatsApp? (com DDD)">
      <input inputMode="tel" className="mt-3 w-full rounded-xl border p-3 outline-none focus:ring-2" placeholder="(19) 9 9999-9999" value={data.whatsapp} onChange={(e)=> setData((d)=> ({...d, whatsapp: e.target.value}))} />
      <p className="mt-2 text-sm text-zinc-500">Ao enviar, avisaremos que entraremos em contato em até 24h úteis.</p>
    </Question>
  ), validate: () => /\\d{10,15}/.test(data.whatsapp.replace(/\\D/g, "")) });

  return steps;
}

export default function ImobiliariaMatrizLanding_v3() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<Cadastro>({
    nome: "", cidade: "", rendaBruta: null, possuiFgts: "", fgtsValor: null, entradaDisponivel: "",
    usaBensNaEntrada: "", bensDescricao: "", temTerreno: "", terrenoLocal: "", terrenoQuitado: "",
    terrenoSaldoDevedor: null, bairroInteresse: "", quartos: "", quartosCustomizado: "",
    possuiFinanciamentoAtual: "", quaisFinanciamentos: "", regimeTrabalho: "", temImovelNoNome: "",
    whatsapp: "", origem: typeof window !== "undefined" ? (new URLSearchParams(window.location.search).toString() || "direct") : "direct",
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
      const res = await fetch("/api/cadastro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error("Falha ao enviar cadastro");
      setDone(true);
    } catch (e) { alert("Não foi possível enviar seu cadastro agora. Tente novamente em instantes."); }
    finally { setSubmitting(false); }
  };

  useEffect(() => {
    // sanity check
    if (!Array.isArray(steps) || steps.length === 0) console.error("steps vazio");
  }, [steps]);

  return (
    <div className="min-h-screen text-zinc-900" style={{ backgroundImage: "linear-gradient(to bottom, #ffffff, rgba(11,26,42,.06))" }}>
      <header className="sticky top-0 z-30 border-b border-zinc-200/70 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl" style={{ backgroundColor: PALETTE.navy }} />
            <span className="text-lg font-semibold">Imobiliária Matriz</span>
          </div>
          <a href="#simulador" className="text-sm font-medium hover:underline" style={{ color: PALETTE.gold }}>Simular agora</a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <h1 className="mb-4 text-4xl font-bold leading-tight md:text-5xl">
              Seu sonho, nosso compromisso: <span style={{ color: PALETTE.navy }}>casa própria</span> com tudo em um só lugar
            </h1>
            <p className="mb-6 text-lg text-zinc-700">
              Cuidamos de ponta a ponta: terreno, crédito (Correspondente Caixa), projeto e obra com garantia. Atendemos MCMV quando elegível e outras modalidades.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#simulador"><button className="rounded-2xl px-5 py-3 font-medium shadow-sm text-white" style={{backgroundColor:PALETTE.navy}}>Quero simular agora</button></a>
              <a className="rounded-2xl px-5 py-3 font-medium underline" href="#autoridade">Nossos resultados</a>
            </div>
          </div>
          <div className="relative">
            <div className="aspect-video w-full overflow-hidden rounded-3xl border border-zinc-200/70 bg-white shadow">
              <iframe className="h-full w-full" src="https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0" title="Como funciona nosso processo" allowFullScreen />
            </div>
          </div>
        </div>
      </section>

      <section id="simulador" className="mx-auto max-w-3xl px-4 py-12">
        <div className="overflow-hidden rounded-3xl border" style={{ borderColor: PALETTE.gold }}>
          <div className="h-2 w-full" style={{ backgroundColor: `${PALETTE.gold}33` }}>
            <div className="h-2 transition-all" style={{ width: `${progress}%`, backgroundColor: PALETTE.gold }} />
          </div>
          <div className="p-6 md:p-8">
            <h2 className="mb-1 text-2xl font-semibold">Simule em 1 minuto</h2>
            <p className="mb-6 text-zinc-600">Responda 1 pergunta por vez. Ao final, entraremos em contato no seu WhatsApp em até <strong>24h úteis</strong>.</p>

            {!done ? (
              <div>
                <AnimatePresence mode="wait">
                  <motion.div key={steps[stepIndex]?.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="mb-6">
                    {steps[stepIndex]?.render}
                  </motion.div>
                </AnimatePresence>
                <div className="flex items-center justify-between">
                  <button onClick={back} disabled={stepIndex === 0} className="text-zinc-600 underline disabled:opacity-40">Voltar</button>
                  {stepIndex < steps.length - 1 ? (
                    <button onClick={next} disabled={!canNext} className="rounded-2xl px-5 py-3 font-medium shadow-sm text-white disabled:opacity-50" style={{backgroundColor:PALETTE.navy}}>Continuar</button>
                  ) : (
                    <button onClick={handleSubmit} disabled={!canNext || submitting} className="rounded-2xl px-5 py-3 font-medium shadow-sm text-white disabled:opacity-50" style={{backgroundColor:PALETTE.navy}}>{submitting ? "Enviando…" : "Concluir e enviar"}</button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto mb-4 h-14 w-14 rounded-full p-3" style={{ backgroundColor: `${PALETTE.gold}1A` }}>
                  <div className="h-full w-full rounded-full" style={{ backgroundColor: PALETTE.gold }} />
                </div>
                <h3 className="mb-2 text-2xl font-semibold">Cadastro enviado!</h3>
                <p className="mx-auto max-w-md text-zinc-600">Obrigado, {data.nome.split(" ")[0]}! Entraremos em contato via WhatsApp {data.whatsapp} em até <strong>24h úteis</strong> com sua simulação.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 pb-20 pt-8 text-sm text-zinc-600">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Imobiliária Matriz — Seu sonho é o nosso compromisso.</p>
          <p>Atendimento: Seg‑Sex 9h–19h · Sáb 10h–14h</p>
        </div>
      </footer>
    </div>
  );
}
