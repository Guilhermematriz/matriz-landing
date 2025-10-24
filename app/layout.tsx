import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "Imobiliária Matriz — Casa própria com tudo em um só lugar",
  description:
    "Correspondente Caixa + Engenharia + Obra com garantia. Simule em 1 minuto e fale com nosso time pelo WhatsApp.",
  openGraph: {
    title: "Imobiliária Matriz — Seu sonho é o nosso compromisso.",
    description: "Casa própria com tudo em um só lugar. Simule em 1 minuto!",
    url: "https://matriz-landing.vercel.app",
    siteName: "Imobiliária Matriz",
    images: [
      { url: "/og.jpg", width: 1200, height: 630, alt: "Imobiliária Matriz" },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imobiliária Matriz",
    description: "Casa própria com tudo em um só lugar. Simule em 1 minuto!",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-200 text-zinc-900 dark:from-zinc-950 dark:to-zinc-900 dark:text-zinc-100 transition-colors duration-500`}
      >
        {/* Botão de modo escuro (sem import externo) */}
        <button
          onClick={() =>
            document.documentElement.classList.toggle("dark")
          }
          className="fixed top-4 right-4 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white/80 dark:bg-zinc-800/80 px-3 py-1 text-sm shadow-md hover:bg-white dark:hover:bg-zinc-700 transition"
        >
          🌓 Modo
        </button>

        <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  );
}
