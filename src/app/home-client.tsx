'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import {
  CheckCircle, Clock, Users, Target, TrendingUp, Shield,
  Zap, Award, MessageSquare, ArrowRight, Star, BarChart3,
  Sparkles, X, Mail, Phone, MapPin, Building
} from 'lucide-react';

export default function HomePageClient() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | 'support' | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        if (data.success) {
          setIsLoggedIn(true);
          setUserRole(data.data.user.role);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  // Закрытие модального окна по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };

    if (activeModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [activeModal]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 mx-auto mb-4">
              <div className="w-full h-full rounded-full bg-amber-500/20 animate-pulse"></div>
            </div>
          </div>
          <p className="text-slate-400 animate-pulse">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <PublicHeader />

      {/* Hero Section */}
      <header className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-200">
                Новое поколение управления задачами
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="text-white">Эффективное</span>
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                делегирование
              </span>
              <br />
              <span className="text-white">для вашего бизнеса</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto">
              Профессиональная платформа для постановки задач, контроля выполнения и аналитики
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isLoggedIn ? (
                <>
                  <Link
                    href="/register"
                    className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 hover:scale-[1.02]"
                  >
                    Начать бесплатно
                    <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center px-8 py-4 bg-white/5 border border-slate-700 text-white font-semibold rounded-xl hover:bg-white/10 hover:border-slate-600 transition-all duration-300 backdrop-blur-sm"
                  >
                    Тарифы
                  </Link>
                </>
              ) : (
                <Link
                  href={userRole === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="group inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 hover:scale-[1.02]"
                >
                  {userRole === 'ADMIN' ? 'Перейти в панель Администратора' : 'Перейти в личный кабинет'}
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Знакомые проблемы */}
      <section className="py-20 bg-slate-900/50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
              <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-sm font-medium text-red-300">Проблемы бизнеса</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Знакомые проблемы?
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Мы понимаем эти боли и создали решение
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Clock,
                title: 'Задачи теряются в чатах',
                description: 'Важные поручения забываются в бесконечных переписках мессенджеров',
                stat: '67%',
                statLabel: 'задач теряются'
              },
              {
                icon: Users,
                title: 'Нет контроля выполнения',
                description: 'Непонятно, кто что делает и на каком этапе выполнение задач',
                stat: '54%',
                statLabel: 'времени на контроль'
              },
              {
                icon: TrendingUp,
                title: 'Отсутствует аналитика',
                description: 'Невозможно оценить эффективность команды и отдельные проекты',
                stat: '0',
                statLabel: 'данных для решений'
              },
              {
                icon: Shield,
                title: 'Небезопасное хранение данных',
                description: 'Конфиденциальная информация хранится в личных сообщениях и на email',
                stat: '89%',
                statLabel: 'риск утечки'
              },
              {
                icon: Zap,
                title: 'Медленные процессы',
                description: 'Ручное распределение задач занимает много времени',
                stat: '3ч',
                statLabel: 'в день на рутину'
              },
              {
                icon: Award,
                title: 'Нет мотивации у команды',
                description: 'Сотрудники не видят своих достижений и прогресса',
                stat: '42%',
                statLabel: 'снижение продуктивности'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-6 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 hover:border-red-500/30 hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-red-500/10"
              >
                {/* Stat badge */}
                <div className="absolute top-4 right-4 px-2.5 py-1 bg-red-500/10 border border-red-500/20 rounded-lg backdrop-blur-sm">
                  <p className="text-xs font-bold text-red-400">{item.stat}</p>
                </div>

                <div className="w-14 h-14 bg-gradient-to-br from-red-500/20 to-orange-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                  <item.icon className="w-7 h-7 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-red-100 transition-colors">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-3">{item.description}</p>
                <p className="text-xs text-red-400/70">{item.statLabel}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Возможности */}
      <section className="py-20 bg-gradient-to-b from-slate-900 to-slate-950 relative overflow-hidden">
        {/* Decorative grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Мощные инструменты</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Возможности платформы
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Всё необходимое для эффективного управления командой
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Постановка задач',
                description: 'Создавайте задачи с детальным описанием, приоритетами и дедлайнами',
                features: ['Приоритеты', 'Дедлайны', 'Описания'],
                color: 'emerald'
              },
              {
                icon: Users,
                title: 'Делегирование',
                description: 'Назначайте ответственных и контролируйте статус выполнения',
                features: ['Назначение', 'Статусы', 'Контроль'],
                color: 'teal'
              },
              {
                icon: BarChart3,
                title: 'Аналитика',
                description: 'Отслеживайте эффективность команды и отдельных сотрудников',
                features: ['Метрики', 'Отчеты', 'Графики'],
                color: 'cyan'
              },
              {
                icon: MessageSquare,
                title: 'Корпоративный чат',
                description: 'Общайтесь с командой в защищённом корпоративном мессенджере',
                features: ['Личные чаты', 'Группы', 'Файлы'],
                color: 'emerald'
              },
              {
                icon: Shield,
                title: 'Безопасность',
                description: 'Ролевая модель доступа и шифрование конфиденциальных данных',
                features: ['Роли', 'Шифрование', 'Аудит'],
                color: 'teal'
              },
              {
                icon: Zap,
                title: 'Автоматизация',
                description: 'Автоматические уведомления и напоминания о дедлайнах',
                features: ['Уведомления', 'Напоминания', 'Интеграции'],
                color: 'cyan'
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group relative p-6 bg-slate-800/30 backdrop-blur-sm rounded-2xl border border-slate-700/30 hover:border-emerald-500/30 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>

                <div className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br from-${item.color}-500/20 to-${item.color}-600/20 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <item.icon className={`w-7 h-7 text-${item.color}-400`} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-emerald-100 transition-colors">{item.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{item.description}</p>

                  {/* Feature tags */}
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature, idx) => (
                      <span key={idx} className="px-2.5 py-1 bg-slate-700/50 border border-slate-600/50 rounded-lg text-xs text-slate-300 backdrop-blur-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Как это работает */}
      <section className="py-20 bg-slate-900/50 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="text-sm font-medium text-emerald-300">Простой старт</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Как это работает
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Начать работу с Delegon очень просто
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden lg:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>

            {[
              {
                step: '1',
                title: 'Регистрация',
                description: 'Создайте аккаунт за 2 минуты',
                icon: '🚀',
                time: '2 мин'
              },
              {
                step: '2',
                title: 'Создайте команду',
                description: 'Пригласите сотрудников по email',
                icon: '👥',
                time: '5 мин'
              },
              {
                step: '3',
                title: 'Постановка задач',
                description: 'Создайте первую задачу и назначьте ответственного',
                icon: '✅',
                time: '3 мин'
              },
              {
                step: '4',
                title: 'Контроль',
                description: 'Отслеживайте прогресс и получайте аналитику',
                icon: '📊',
                time: 'Всегда'
              },
            ].map((item, index) => (
              <div key={index} className="relative group">
                {/* Step number badge */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {item.step}
                    </div>
                  </div>
                </div>

                <div className="pt-10 p-6 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 hover:border-emerald-500/30 hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-emerald-500/10 h-full">
                  {/* Icon */}
                  <div className="text-4xl mb-4 text-center group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>

                  {/* Time badge */}
                  <div className="flex justify-center mb-3">
                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
                      {item.time}
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold text-white mb-2 text-center group-hover:text-emerald-100 transition-colors">{item.title}</h3>
                  <p className="text-slate-400 text-sm text-center leading-relaxed">{item.description}</p>
                </div>

                {/* Arrow for desktop */}
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/4 -right-4 z-20">
                    <svg className="w-8 h-8 text-emerald-500/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-slate-400 mb-6">Готовы начать? Это займет всего 10 минут</p>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              <span>Начать бесплатно</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Отзывы клиентов */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
              <span className="text-sm font-medium text-emerald-300">Отзывы клиентов</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Что говорят наши клиенты
            </h2>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto">
              Более 1000+ компаний уже используют Delegon
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Алексей Петров',
                role: 'CEO, TechStart',
                company: 'TechStart',
                content:
                  'Delegon полностью изменил наш подход к управлению задачами. Теперь всё структурировано и под контролем.',
                rating: 5,
                avatar: 'АП',
                metric: '+45%',
                metricLabel: 'продуктивность'
              },
              {
                name: 'Мария Сидорова',
                role: 'Project Manager',
                company: 'Digital Agency',
                content:
                  'Наконец-то удобная платформа для нашей команды. Делегирование стало простым и прозрачным.',
                rating: 5,
                avatar: 'МС',
                metric: '3ч/день',
                metricLabel: 'экономия времени'
              },
              {
                name: 'Дмитрий Козлов',
                role: 'CTO',
                company: 'E-commerce',
                content:
                  'Отличная аналитика и возможность отслеживать эффективность каждого сотрудника.',
                rating: 5,
                avatar: 'ДК',
                metric: '100%',
                metricLabel: 'контроль задач'
              },
            ].map((review, index) => (
              <div
                key={index}
                className="group relative p-6 bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 hover:border-emerald-500/30 hover:bg-slate-800/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/10"
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-300"></div>

                <div className="relative">
                  {/* Rating stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-emerald-400 text-emerald-400" />
                    ))}
                  </div>

                  {/* Quote */}
                  <div className="mb-6">
                    <svg className="w-8 h-8 text-emerald-500/20 mb-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                    <p className="text-slate-300 text-base leading-relaxed italic">
                      "{review.content}"
                    </p>
                  </div>

                  {/* Metric badge */}
                  <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <span className="text-emerald-400 font-bold text-sm">{review.metric}</span>
                    <span className="text-emerald-400/70 text-xs">{review.metricLabel}</span>
                  </div>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-700/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-lg group-hover:scale-110 transition-transform">
                      {review.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-white group-hover:text-emerald-100 transition-colors">{review.name}</p>
                      <p className="text-sm text-slate-400">{review.role}</p>
                      <p className="text-xs text-emerald-400/70">{review.company}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust indicators */}
          <div className="mt-16 pt-12 border-t border-slate-700/30">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">1000+</p>
                <p className="text-slate-400 text-sm">Активных компаний</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">50K+</p>
                <p className="text-slate-400 text-sm">Выполненных задач</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">98%</p>
                <p className="text-slate-400 text-sm">Довольных клиентов</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-bold text-emerald-400 mb-2">24/7</p>
                <p className="text-slate-400 text-sm">Поддержка</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-600"></div>
        <div className="absolute inset-0">
          <div className="absolute top-10 left-20 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
          <div className="absolute bottom-10 right-20 w-60 h-60 bg-white/10 rounded-full blur-2xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Готовы повысить эффективность?
          </h2>
          <p className="text-xl text-white/90 mb-10">
            Присоединяйтесь к тысячам компаний, которые уже выбрали Delegon
          </p>
          {!isLoggedIn ? (
            <Link
              href="/register"
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              Начать бесплатно
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <Link
              href={userRole === 'ADMIN' ? '/admin' : '/dashboard'}
              className="group inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-700 font-semibold rounded-xl hover:bg-slate-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02]"
            >
              {userRole === 'ADMIN' ? 'Перейти в панель Администратора' : 'Перейти в личный кабинет'}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <span className="text-white font-bold text-lg">D</span>
                </div>
                <h3 className="text-white font-semibold text-xl">Delegon</h3>
              </div>
              <p className="text-sm text-slate-400">
                Профессиональная платформа для управления задачами
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Продукт</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/pricing" className="hover:text-amber-400 transition-colors">
                    Тарифы
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-amber-400 transition-colors">
                    Возможности
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <button
                    onClick={() => setActiveModal('about')}
                    className="hover:text-amber-400 transition-colors"
                  >
                    О нас
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveModal('contact')}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    Контакты
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Правовая информация</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                    Политика конфиденциальности
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-amber-400 transition-colors">
                    Условия использования
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-sm">
            <p>&copy; {new Date().getFullYear()} Delegon. Все права защищены.</p>
          </div>
        </div>
      </footer>

      {/* Модальные окна */}
      {activeModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {activeModal === 'about' && 'О компании Delegon'}
                  {activeModal === 'contact' && 'Контактная информация'}
                  {activeModal === 'support' && 'Техническая поддержка'}
                </h3>
                <button
                  onClick={() => setActiveModal(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {activeModal === 'about' && (
                <div className="space-y-4 text-slate-300">
                  <p>
                    <strong className="text-white">Delegon</strong> — современная система делегирования задач для команд и
                    организаций.
                  </p>
                  <p>
                    Мы создали платформу, которая объединяет все аспекты управления задачами — от
                    создания до контроля выполнения.
                  </p>
                  <p>
                    Наша миссия — сделать делегирование простым, прозрачным и эффективным для
                    каждого.
                  </p>
                </div>
              )}

              {activeModal === 'contact' && (
                <div className="space-y-4 text-slate-300">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-amber-400" />
                    <span>info@delegon.ru</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-amber-400" />
                    <span>+7 (800) 123-45-67</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-amber-400" />
                    <span>г. Москва, ул. Примерная, д. 1</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Building className="w-5 h-5 text-amber-400" />
                    <span>Пн-Пт: 9:00 - 18:00</span>
                  </div>
                </div>
              )}

              {activeModal === 'support' && (
                <div className="space-y-4 text-slate-300">
                  <p>Наша служба поддержки работает 24/7 и готова помочь вам с любыми вопросами.</p>
                  <p>Среднее время ответа — менее 2 часов.</p>
                  <p>
                    <strong className="text-white">Email:</strong> support@delegon.ru
                  </p>
                  <p>
                    <strong className="text-white">Телефон:</strong> +7 (800) 123-45-68
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
