import type { Metadata } from 'next';
import UpravleniePage from './upravlenie-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'Управление задачами онлайн — система для команды | Delegon',
  description:
    'Управляйте задачами команды онлайн. Постановка задач, контроль выполнения и управление проектами в одном сервисе.',
  alternates: {
    canonical: `${SITE_URL}/upravlenie-zadachami`,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE_URL}/upravlenie-zadachami`,
    siteName: 'Delegon',
    title: 'Управление задачами онлайн — система для команды | Delegon',
    description: 'Управляйте задачами команды онлайн. Постановка задач, контроль выполнения и управление проектами в одном сервисе.',
  },
};

export default function UpravlenieZadachamiPage() {
  return <UpravleniePage />;
}
