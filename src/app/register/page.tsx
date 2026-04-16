import type { Metadata } from 'next';
import RegisterClient from './register-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'Регистрация - Создайте аккаунт Delegon',
  description:
    'Зарегистрируйтесь бесплатно и начните эффективно управлять задачами вашей команды',
  alternates: {
    canonical: `${SITE_URL}/register`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function RegisterPage() {
  return <RegisterClient />;
}
