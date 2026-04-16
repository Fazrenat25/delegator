import type { Metadata } from 'next';
import PricingClient from './pricing-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'Тарифы - Выберите подходящий план для вашей команды',
  description:
    'Гибкие тарифные планы для команд любого размера. Бесплатный план до 5 человек, расширенные возможности для бизнеса. Начните бесплатно!',
  keywords: ['тарифы', 'цены', 'стоимость', 'план команды', 'подписка'],
  alternates: {
    canonical: `${SITE_URL}/pricing`,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE_URL}/pricing`,
    siteName: 'Delegon',
    title: 'Тарифы - Delegon',
    description: 'Гибкие тарифные планы для команд любого размера',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Тарифы Delegon',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Тарифы - Delegon',
    description: 'Гибкие тарифные планы для команд любого размера',
    images: ['/images/og-image.jpg'],
  },
};

export default function PricingPage() {
  return <PricingClient />;
}
