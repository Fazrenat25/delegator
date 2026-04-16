import type { Metadata } from 'next';
import AboutClient from './about-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'О нас - Delegon',
  description:
    'Узнайте больше о платформе Delegon. Наша миссия, ценности и команда.',
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE_URL}/about`,
    siteName: 'Delegon',
    title: 'О нас - Delegon',
    description: 'Профессиональная система делегирования задач',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
