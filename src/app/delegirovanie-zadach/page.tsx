import type { Metadata } from 'next';
import DelegirovaniePage from './delegirovanie-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'Система делегирования задач онлайн — Delegon',
  description:
    'Сервис для делегирования задач сотрудникам. Постановка задач, контроль выполнения и управление командой онлайн.',
  alternates: {
    canonical: `${SITE_URL}/delegirovanie-zadach`,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE_URL}/delegirovanie-zadach`,
    siteName: 'Delegon',
    title: 'Система делегирования задач онлайн — Delegon',
    description: 'Сервис для делегирования задач сотрудникам. Постановка задач, контроль выполнения и управление командой онлайн.',
  },
};

export default function DelegirovanieZadachPage() {
  return <DelegirovaniePage />;
}
