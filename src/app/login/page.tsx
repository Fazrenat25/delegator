import type { Metadata } from 'next';
import LoginClient from './login-client';

const SITE_URL = 'https://delegon.ru';

export const metadata: Metadata = {
  title: 'Вход в систему - Delegon',
  description: 'Войдите в свой аккаунт Delegon для доступа к панели управления задачами',
  alternates: {
    canonical: `${SITE_URL}/login`,
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
