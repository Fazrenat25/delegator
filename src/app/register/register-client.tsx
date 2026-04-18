'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent } from '@/components/ui/Card';
import { CheckCircle, Shield, Users, Zap, Crown } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    companyName: '',
  });

  // Получаем план из URL параметра
  const plan = searchParams.get('plan');

  // Сохраняем тариф в localStorage при монтировании, если есть параметр plan
  useEffect(() => {
    if (plan === 'TEAM') {
      localStorage.setItem('currentPlan', 'TEAM');
      localStorage.setItem('planTrialEnd', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
    }
  }, [plan]);

  // Генерация логина из имени и фамилии (транслит)
  const generateUsername = (firstName: string, lastName: string) => {
    const translit: Record<string, string> = {
      'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
      'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
      'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
      'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
      'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
      'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
      'э': 'e', 'ю': 'yu', 'я': 'ya'
    };

    const transliterate = (str: string) =>
      str.toLowerCase().split('').map(c => translit[c] || c).join('').replace(/[^a-z]/g, '');

    const first = transliterate(firstName);
    const last = transliterate(lastName);

    if (first && last) {
      return `${last}_${first}`;
    }
    return '';
  };

  // Автоматическая генерация логина при изменении имени или фамилии
  useEffect(() => {
    if (formData.firstName && formData.lastName) {
      const generatedUsername = generateUsername(formData.firstName, formData.lastName);
      setFormData(prev => ({ ...prev, username: generatedUsername }));
    }
  }, [formData.firstName, formData.lastName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    console.log('Form submitted with data:', formData);

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (formData.password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    // Генерируем username если ещё не сгенерирован
    let username = formData.username;
    if (!username && formData.firstName && formData.lastName) {
      username = generateUsername(formData.firstName, formData.lastName);
    }

    console.log('Generated username:', username);

    if (!username || username.length < 3) {
      setError('Логин должен быть не менее 3 символов');
      return;
    }

    setIsLoading(true);

    try {
      const requestBody = {
        username,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: 'DIRECTOR',
        companyName: formData.companyName,
        plan: plan || 'FREE',
      };
      
      console.log('Sending registration request:', requestBody);
      
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('Registration response:', data, 'Status:', response.status);

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка регистрации');
      }

      // Перенаправление админов на /admin, остальных на /dashboard
      if (data.data?.user?.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  const benefits = [
    { icon: <Users className="w-4 h-4" />, text: 'Управление командой' },
    { icon: <Shield className="w-4 h-4" />, text: 'Контроль задач' },
    { icon: <Zap className="w-4 h-4" />, text: 'Быстрые уведомления' },
    { icon: <CheckCircle className="w-4 h-4" />, text: 'Отчётность 24/7' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 sm:p-6">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-0 lg:gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden lg:block text-white space-y-8 pr-8">
            <Link href="/" className="flex items-center gap-4 mb-12 group">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
                <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:via-teal-500 group-hover:to-cyan-600 transition-all duration-300">Delegon</span>
            </Link>

            <div>
              <h1 className="text-5xl font-bold mb-4 leading-tight">
                Станьте <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">директором</span> своей компании
              </h1>
              <p className="text-xl text-slate-400 font-light leading-relaxed">
                Зарегистрируйтесь и получите полный контроль над бизнес-процессами вашей команды
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all duration-300">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    {benefit.icon}
                  </div>
                  <span className="text-lg text-slate-200 font-medium">{benefit.text}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-slate-800">
              <p className="text-slate-400 text-sm mb-4">Преимущества аккаунта директора:</p>
              <div className="flex items-center gap-2 text-emerald-400">
                <Crown className="w-5 h-5" />
                <span className="font-medium">Полный доступ ко всем функциям системы</span>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="w-full">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-2xl shadow-emerald-500/30 group-hover:shadow-emerald-500/50 transition-all duration-300">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:via-teal-500 group-hover:to-cyan-600 transition-all duration-300">Delegon</span>
              </Link>
              <h1 className="text-2xl font-bold text-white mb-2">Регистрация нового директора</h1>
              <p className="text-slate-400 text-sm">Создайте аккаунт для управления вашей компанией</p>
            </div>

            <Card className="backdrop-blur-xl bg-slate-800/40 border-slate-700/50 shadow-2xl shadow-black/20">
              <CardContent className="p-6 sm:p-8">
                {/* Trial Plan Banner */}
                {plan === 'TEAM' && (
                  <div className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-xl">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold mb-1">7 дней TEAM тарифа бесплатно!</h3>
                        <p className="text-slate-400 text-sm">
                  После регистрации вам будет доступен тариф TEAM со всеми возможностями: до 15 человек, контроль задач, панель руководителя и приоритеты.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Crown className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Создать аккаунт директора</h2>
                  </div>
                  <p className="text-slate-400 text-sm">Заполните форму для регистрации в системе</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm flex items-center gap-2">
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Имя"
                      placeholder="Иван"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                    <Input
                      label="Фамилия"
                      placeholder="Иванов"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Input
                      label="Логин"
                      placeholder="ivanov_ivan"
                      value={formData.username}
                      readOnly
                      className="bg-slate-800/30 border-slate-700 text-slate-400 cursor-not-allowed"
                    />
                    <div className="absolute right-3 top-[34px] flex items-center gap-1.5 text-xs text-slate-500">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span>Генерируется автоматически</span>
                    </div>
                  </div>

                  <Input
                    label="Название компании"
                    placeholder="ООО «Вектор»"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    required
                  />

                  <Input
                    label="Пароль"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    required
                    autoComplete="new-password"
                  />

                  <Input
                    label="Подтверждение пароля"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="bg-slate-900/50 border-slate-600 text-white placeholder-slate-500 focus:border-emerald-500 focus:ring-emerald-500/20"
                    required
                    autoComplete="new-password"
                  />

                  <Button
                    type="submit"
                    className="w-full mt-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 px-6 rounded-xl shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40"
                    size="lg"
                    isLoading={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Регистрация...
                      </span>
                    ) : (
                      'Зарегистрироваться'
                    )}
                  </Button>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-700/50 text-center">
                  <p className="text-slate-400 text-sm">
                    Уже есть аккаунт?{' '}
                    <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors">
                      Войти в систему
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="mt-6 flex items-center justify-center gap-6 text-slate-500 text-xs">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Безопасное хранение</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Проверенные технологии</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
