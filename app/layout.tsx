import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Trabalhe Conosco — Grupo Limpservice",
    template: "%s | Grupo Limpservice",
  },
  description:
    "Candidate-se a uma vaga no Grupo Limpservice — 25 anos de excelência em terceirização de serviços. Preencha seu currículo de forma simples e rápida.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Trabalhe Conosco — Grupo Limpservice",
    description: "25 anos de excelência em serviços. Candidate-se agora.",
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
