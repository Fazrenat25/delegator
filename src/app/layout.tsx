import type { Metadata } from "next";
import { SupportForm } from "@/components/layout/SupportForm";
import "./globals.css";

export const metadata: Metadata = {
  title: "Delegator - Система делегирования задач",
  description: "Профессиональная платформа для управления задачами и делегирования",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        {children}
        <SupportForm />
      </body>
    </html>
  );
}
