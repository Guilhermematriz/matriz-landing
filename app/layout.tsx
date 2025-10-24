import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import DarkToggle from "@/components/DarkToggle";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://matriz-landing-gwII-agvvai.vercel.app"), // ajuste para seu domínio final
  title: "Imobiliária Matriz — Landing + Simulador",
  description: "Seu sonho, nosso compromisso. Construção completa com crédito, projeto e obra.",
  openGraph: {
    title: "Imobiliária Matriz — Landing + Simulador",
    description:
      "Cuidamos de ponta a ponta: terreno, crédito (Correspondente Caixa), projeto e obra.",
    url: "/",
    siteName: "Imobiliária Matriz",
    images: [
      {
        url: "/og-matriz.jpg", // coloque um arquivo real em /public/og-matriz.jpg
        width: 1200,
        height: 630,
        alt: "Imobiliária Matriz",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Imobiliária Matriz — Landing + Simulador",
    description:
      "Cuidamos de ponta a ponta: terreno, crédito (Correspondente Caixa), projeto e obra.",
    images: ["/og-matriz.jpg"],
  },
  icons: { icon: "/favicon.ico" }, // coloque um favicon em /public
};

export const viewport: Viewport = {
  themeColor: [
    { color: "#ffffff", media: "(prefers-color-scheme: light)" },
    { color: "#0a0d12", media: "(prefers-color-scheme: dark)" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <div className="fixed right-4 top-4 z-50">
          <DarkToggle />
        </div>
        {children}
      </body>
    </html>
  );
}
