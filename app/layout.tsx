export const metadata = {
  title: "Imobiliária Matriz",
  description: "Landing + Simulador",
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
