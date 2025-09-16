import React from "react";
import type { Metadata } from "next";
import "../styles/index.css";
import { ThemeProvider } from "../context/ThemeContext";
import { ToastProvider } from "../context/ToastContext";

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
      <body>
        <ThemeProvider>
          <ToastProvider position="top-right" maxToasts={5}>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
