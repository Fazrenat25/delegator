import type { Metadata } from 'next';
import PrivacyClient from './privacy-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'Политика конфиденциальности - Delegon',
  description:
    'Политика конфиденциальности платформы Delegon. Узнайте, как мы защищаем ваши данные.',
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE_URL}/privacy`,
    siteName: 'Delegon',
    title: 'Политика конфиденциальности - Delegon',
    description: 'Как мы защищаем ваши данные',
  },
};

export default function PrivacyPage() {
  return <PrivacyClient />;
}
