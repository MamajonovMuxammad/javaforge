import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toaster";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "JavaForge — Интерактивный буткемп Java Backend от 0 до Junior",
  description:
    "Современная интерактивная платформа для изучения Java Backend: живой запуск Java прямо в браузере, геймификация с XP и стриками, 84 дня от JVM до Spring Boot и Docker.",
  keywords: ["Java", "Backend", "Spring Boot", "JVM", "Обучение программированию", "Курс Java", "Junior"],
  authors: [{ name: "JavaForge Team" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full dark`}
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-zinc-100 antialiased selection:bg-orange-500/30 selection:text-white">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
