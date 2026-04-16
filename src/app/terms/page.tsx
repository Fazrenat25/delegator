import type { Metadata } from 'next';
import TermsClient from './terms-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'Условия использования - Delegon',
  description:
    'Условия использования платформы Delegon. Ознакомьтесь с правилами сервиса.',
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE_URL}/terms`,
    siteName: 'Delegon',
    title: 'Условия использования - Delegon',
    description: 'Правила использования сервиса Delegon',
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
