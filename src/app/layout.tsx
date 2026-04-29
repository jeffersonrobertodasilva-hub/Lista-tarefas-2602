import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

export const metadata: Metadata = {
  title: "TaskFlow | Sua Lista de Tarefas Inteligente e Moderna",
  description: "Organize seu dia, priorize o que importa e aumente sua produtividade com o TaskFlow. A lista de tarefas moderna, rápida e intuitiva para profissionais e estudantes.",
  keywords: ["lista de tarefas", "todo list", "produtividade", "organização", "tarefas", "gerenciamento de tempo"],
  authors: [{ name: "TaskFlow Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://taskflow-todo.vercel.app",
    title: "TaskFlow | Sua Lista de Tarefas Inteligente",
    description: "Gerencie suas atividades com uma interface moderna e intuitiva. Organize-se hoje mesmo!",
    siteName: "TaskFlow",
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow | Sua Lista de Tarefas Inteligente",
    description: "Organize seu dia e priorize o que importa com o TaskFlow.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${outfit.variable} antialiased`}>
      <body className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
