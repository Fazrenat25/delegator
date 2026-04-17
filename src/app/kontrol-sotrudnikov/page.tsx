import type { Metadata } from 'next';
import KontrolPage from './kontrol-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'Контроль задач сотрудников онлайн — Delegon',
  description:
    'Контролируйте выполнение задач сотрудников. Онлайн система для отслеживания задач и эффективности команды.',
  alternates: {
    canonical: `${SITE_URL}/kontrol-sotrudnikov`,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE_URL}/kontrol-sotrudnikov`,
    siteName: 'Delegon',
    title: 'Контроль задач сотрудников онлайн — Delegon',
    description: 'Контролируйте выполнение задач сотрудников. Онлайн система для отслеживания задач и эффективности команды.',
  },
};

export default function KontrolSotrudnikovPage() {
  return <KontrolPage />;
}
