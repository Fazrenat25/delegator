import type { Metadata } from 'next';
import HomePageClient from './home-client';

const SITE_URL = 'https://delegon.ru';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Delegon - Эффективное делегирование задач для вашего бизнеса',
  description:
    'Профессиональная платформа для управления задачами и делегирования. Повысьте эффективность команды с помощью удобных инструментов постановки задач, контроля выполнения и аналитики.',
  keywords: [
    'делегирование задач',
    'управление задачами',
    'task management',
    'делегирование в бизнесе',
    'управление командой',
  ],
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE_URL,
    siteName: 'Delegon',
    title: 'Delegon - Эффективное делегирование задач для вашего бизнеса',
    description:
      'Профессиональная платформа для управления задачами и делегирования.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Delegon - Система делегирования задач',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Delegon - Эффективное делегирование задач для вашего бизнеса',
    description: 'Профессиональная платформа для управления задачами.',
    images: ['/images/og-image.jpg'],
  },
};

export default function HomePage() {
  return <HomePageClient />;
}
