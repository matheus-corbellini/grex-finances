import type { Metadata } from "next";
import "../src/styles/index.css";

export const metadata: Metadata = {
  title: "Grex Finances",
  description: "Sistema de finanças desenvolvido com Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
