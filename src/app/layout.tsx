import type { Metadata } from "next";
import { SupportForm } from "@/components/layout/SupportForm";
import "./globals.css";

const SITE_URL = "https://delegon.ru";

export const metadata: Metadata = {
  title: {
    default: "Delegon - Система делегирования задач для бизнеса",
    template: "%s | Delegon",
  },
  description:
    "Профессиональная платформа для управления задачами и делегирования. Повысьте эффективность команды с помощью удобных инструментов постановки задач, контроля выполнения и аналитики.",
  keywords: [
    "делегирование задач",
    "управление задачами",
    "task management",
    "делегирование в бизнесе",
    "управление командой",
    "контроль задач",
    "корпоративная платформа",
  ],
  authors: [{ name: "Delegon Team" }],
  creator: "Delegon",
  publisher: "Delegon",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: SITE_URL,
    languages: {
      "ru-RU": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: SITE_URL,
    siteName: "Delegon",
    title: "Delegon - Система делегирования задач для бизнеса",
    description:
      "Профессиональная платформа для управления задачами и делегирования. Повысьте эффективность команды.",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Delegon - Система делегирования задач",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Delegon - Система делегирования задач для бизнеса",
    description:
      "Профессиональная платформа для управления задачами и делегирования.",
    images: ["/images/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
  category: "business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Delegon",
              url: SITE_URL,
              logo: `${SITE_URL}/images/logo.png`,
              description:
                "Профессиональная платформа для управления задачами и делегирования",
              sameAs: [],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                availableLanguage: ["Russian"],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Delegon",
              url: SITE_URL,
              description:
                "Система делегирования задач для бизнеса",
              potentialAction: {
                "@type": "SearchAction",
                target: `${SITE_URL}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
              inLanguage: "ru-RU",
            }),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        {children}
        <SupportForm />
      </body>
    </html>
  );
}
