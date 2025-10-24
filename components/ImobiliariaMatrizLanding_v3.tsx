"use client";

import { motion } from "framer-motion";

export default function ImobiliariaMatrizLanding_v3() {
  return (
    <main className="min-h-screen bg-[#0b0b0b] text-white flex flex-col items-center justify-center font-[system-ui]">
      {/* Hero Section */}
      <section className="w-full max-w-5xl px-6 py-16 text-center">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Seu sonho, nosso compromisso.
        </motion.h1>
        <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed">
          Casa própria com tudo em um só lugar — terreno, projeto e construção,
          com assessoria completa no financiamento pela Caixa.
        </p>

        <motion.a
          href="https://wa.me/5551999999999"
          target="_blank"
          className="inline-block px-8 py-4 bg-yellow-400 text-black font-semibold rounded-full shadow-lg hover:shadow-yellow-500/30 hover:scale-105 transition-all"
          whileHover={{ scale: 1.05 }}
        >
          Simule seu financiamento agora
        </motion.a>
      </section>

      {/* Video */}
      <section className="w-full max-w-3xl px-6 pb-20">
        <div className="aspect-video rounded-xl overflow-hidden shadow-lg shadow-yellow-500/10 border border-yellow-500/10">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/4K4hN1vOvB4"
            title="Imobiliária Matriz - Seu sonho é o nosso compromisso"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-yellow-500/20 py-6 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} Imobiliária Matriz — Seu sonho é o nosso
        compromisso.  
        <br />
        Atendimento: Seg a Sex 9h às 19h, Sáb 10h às 14h.
      </footer>
    </main>
  );
}
