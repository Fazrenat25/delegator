import type { Metadata } from 'next';
import ContactsClient from './contacts-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'Контакты - Delegon',
  description:
    'Свяжитесь с нами. Мы всегда готовы ответить на ваши вопросы.',
  alternates: {
    canonical: `${SITE_URL}/contacts`,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE_URL}/contacts`,
    siteName: 'Delegon',
    title: 'Контакты - Delegon',
    description: 'Свяжитесь с командой Delegon',
  },
};

export default function ContactsPage() {
  return <ContactsClient />;
}
