'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, Clock, Users, Target, TrendingUp, Shield,
  Zap, Award, MessageSquare, ArrowRight, Star, BarChart3,
  Sparkles, Lock, Zap as ZapIcon, ChevronRight, X, Mail, Phone, MapPin, Building
} from 'lucide-react';

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<'about' | 'contact' | 'support' | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        setIsLoggedIn(data.success);
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
      document.body.style.overflow = 'unset';
    };
  }, [activeModal]);

  const features = [
    {
      icon: <Target className="w-7 h-7" />,
      title: 'Распределение задач',
      description: 'Назначайте задачи с приоритетами и сроками конкретным исполнителям',
      color: 'from-amber-500 to-amber-600',
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: 'Контроль дедлайнов',
      description: 'Автоматические уведомления о приближающихся сроках выполнения',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <BarChart3 className="w-7 h-7" />,
      title: 'Аналитика и отчёты',
      description: 'Прозрачная статистика по эффективности каждого сотрудника',
      color: 'from-emerald-500 to-emerald-600',
    },
    {
      icon: <MessageSquare className="w-7 h-7" />,
      title: 'Корпоративный чат',
      description: 'Встроенный мессенджер для быстрой коммуникации в команде',
      color: 'from-violet-500 to-violet-600',
    },
    {
      icon: <Users className="w-7 h-7" />,
      title: 'Управление командой',
      description: 'Добавляйте сотрудников и гибко настраивайте права доступа',
      color: 'from-pink-500 to-pink-600',
    },
    {
      icon: <Shield className="w-7 h-7" />,
      title: 'Защита данных',
      description: 'Шифрование и разграничение прав доступа к информации',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  const chatFeatures = [
    { icon: <ZapIcon className="w-5 h-5" />, text: 'Мгновенная доставка сообщений' },
    { icon: <CheckCircle className="w-5 h-5" />, text: 'Статус прочтения' },
    { icon: <Users className="w-5 h-5" />, text: 'Общий чат компании' },
    { icon: <Lock className="w-5 h-5" />, text: 'Личные сообщения' },
  ];

  const problems = [
    {
      before: 'Задачи теряются в чатах и почте',
      after: 'Все задачи в единой системе',
    },
    {
      before: 'Непонятно, кто за что отвечает',
      after: 'Чёткое распределение ответственности',
    },
    {
      before: 'Срывы дедлайнов',
      after: 'Контроль сроков и напоминания',
    },
    {
      before: 'Нет прозрачности в работе команды',
      after: 'Полная видимость прогресса',
    },
  ];

  const stats = [
    { value: '95%', label: 'Задач выполняется в срок', icon: <CheckCircle className="w-6 h-6" /> },
    { value: '3x', label: 'Рост продуктивности', icon: <TrendingUp className="w-6 h-6" /> },
    { value: '0', label: 'Потерянных задач', icon: <Shield className="w-6 h-6" /> },
    { value: '24/7', label: 'Доступ к системе', icon: <Clock className="w-6 h-6" /> },
  ];

  const steps = [
    {
      number: '01',
      title: 'Регистрация',
      description: 'Создайте аккаунт директора компании',
    },
    {
      number: '02',
      title: 'Команда',
      description: 'Пригласите сотрудников в систему',
    },
    {
      number: '03',
      title: 'Задачи',
      description: 'Распределяйте задачи с приоритетами',
    },
    {
      number: '04',
      title: 'Контроль',
      description: 'Отслеживайте выполнение онлайн',
    },
  ];

  const testimonials = [
    {
      name: 'Алексей Петров',
      role: 'Генеральный директор, TechCorp',
      text: 'Delegator помог нам наладить процессы в команде из 50+ человек. Прозрачность и контроль — на высшем уровне!',
      rating: 5,
    },
    {
      name: 'Мария Иванова',
      role: 'Руководитель проекта, DigitalStudio',
      text: 'Наконец-то все задачи в одном месте! Команда работает слаженно, дедлайны соблюдаются.',
      rating: 5,
    },
    {
      name: 'Дмитрий Сидоров',
      role: 'Основатель, StartUp Lab',
      text: 'Простой интерфейс и мощный функционал. Именно то, что нужно для растущего бизнеса.',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Logo + Badge */}
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25 group-hover:shadow-amber-500/40 transition-all duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Delegator</span>
              </Link>
              
              {/* Premium Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-800/40 border border-slate-700/50 rounded-full hover:border-amber-500/40 transition-all duration-300 backdrop-blur-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-slate-300 text-xs font-medium">Премиум система управления задачами</span>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="flex items-center gap-3 sm:gap-4">
              {!loading && (
                <>
                  {isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25 text-sm sm:text-base"
                    >
                      Личный кабинет
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="text-slate-400 hover:text-white transition-colors font-medium hidden sm:block text-sm"
                      >
                        Войти
                      </Link>
                      <Link
                        href="/register"
                        className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-lg shadow-amber-500/25 text-sm sm:text-base"
                      >
                        Регистрация
                      </Link>
                    </>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section 
          className="relative overflow-hidden"
          style={{
            backgroundImage: `url('/images/hero-bg.jpg')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '800px',
          }}
        >
          {/* Overlay gradient for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 via-slate-900/85 to-slate-950/90"></div>
          
          <div className="container mx-auto px-6 py-24 lg:py-36 relative z-10">
            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight tracking-tight text-center">
              <span className="block">
                Эффективное{' '}
                <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                  делегирование
                </span>
              </span>
              <span className="block">для вашего бизнеса</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-400 mb-14 max-w-3xl mx-auto leading-relaxed">
              Централизованная платформа для распределения задач, контроля исполнения
              и повышения продуктивности вашей команды. Избавьтесь от хаоса и начните
              <span className="text-slate-200 font-medium"> работать эффективно!</span>
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              {!loading && (
                <>
                  {isLoggedIn ? (
                    <Link
                      href="/dashboard"
                      className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-xl shadow-emerald-500/25 text-lg flex items-center justify-center gap-2"
                    >
                      Перейти в кабинет
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-500/25 text-lg flex items-center justify-center gap-2"
                      >
                        Начать бесплатно
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                      <Link
                        href="/login"
                        className="w-full sm:w-auto px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-xl hover:bg-slate-700/50 transition-all border border-slate-700 text-lg backdrop-blur-sm"
                      >
                        Войти в систему
                      </Link>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-6 bg-slate-800/20 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300 group"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-amber-500/20`}>
                    {stat.icon}
                  </div>
                  <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent mb-2">{stat.value}</div>
                  <div className="text-slate-400 text-sm lg:text-base font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Problems Section */}
        <section className="py-24">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Знакомые проблемы?
              </h2>
              <p className="text-xl text-slate-400 font-light">
                Мы знаем, как их решить
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              {problems.map((problem, index) => (
                <div
                  key={index}
                  className="p-6 sm:p-8 bg-slate-800/20 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300"
                >
                  <div className="text-lg text-slate-400 mb-3 font-light">{problem.before}</div>
                  <div className="text-lg text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    {problem.after}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Возможности Delegator
              </h2>
              <p className="text-xl text-slate-400 font-light">
                Всё необходимое для эффективной работы команды
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-8 bg-slate-800/20 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 group"
                >
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed font-light">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Chat Feature Highlight */}
        <section className="py-24 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/30 rounded-full mb-6">
                  <MessageSquare className="w-4 h-4 text-violet-400" />
                  <span className="text-violet-300 text-sm font-medium">Встроенный мессенджер</span>
                </div>
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                  Корпоративный чат
                </h2>
                <p className="text-xl text-slate-400 mb-8 leading-relaxed font-light">
                  Быстрая и безопасная коммуникация внутри вашей компании. 
                  Общайтесь с коллегами напрямую или в общем чате, не покидая платформы.
                </p>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                  {chatFeatures.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/20">
                        {item.icon}
                      </div>
                      <span className="text-slate-300 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-semibold group"
                >
                  Попробовать чат
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 to-amber-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative p-8 bg-slate-800/40 border border-slate-700/50 rounded-3xl backdrop-blur-xl shadow-2xl">
                  {/* Chat mock UI */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-700/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center text-white font-semibold">
                        АИ
                      </div>
                      <div>
                        <p className="text-white font-semibold">Александр Иванов</p>
                        <p className="text-xs text-slate-400">Менеджер по продажам</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-start">
                        <div className="max-w-[80%] px-4 py-3 bg-slate-700/50 rounded-2xl rounded-bl-md">
                          <p className="text-slate-200 text-sm">Коллеги, добрый день! Кто может взять задачу по клиенту ABC?</p>
                          <p className="text-xs text-slate-500 mt-2">10:30</p>
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <div className="max-w-[80%] px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl rounded-br-md shadow-lg shadow-amber-500/20">
                          <p className="text-white text-sm">Могу заняться этим вопросом!</p>
                          <p className="text-xs text-amber-100/70 mt-2">10:32</p>
                        </div>
                      </div>
                      <div className="flex justify-start">
                        <div className="max-w-[80%] px-4 py-3 bg-slate-700/50 rounded-2xl rounded-bl-md">
                          <p className="text-slate-200 text-sm">Отлично! Задача уже создана в системе.</p>
                          <p className="text-xs text-slate-500 mt-2">10:35</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Как это работает?
              </h2>
              <p className="text-xl text-slate-400 font-light">
                Начните работу за 4 простых шага
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className="relative p-8 bg-slate-800/20 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300 group"
                >
                  <div className="text-6xl font-bold text-amber-500/5 absolute top-4 right-4 group-hover:text-amber-500/10 transition-colors">
                    {step.number}
                  </div>
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold mb-6 relative z-10 shadow-lg shadow-amber-500/25 group-hover:scale-110 transition-transform duration-300">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                  <p className="text-slate-400 font-light">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 border-t border-slate-800/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                Что говорят клиенты
              </h2>
              <p className="text-xl text-slate-400 font-light">
                Реальные отзывы от руководителей компаний
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="p-8 bg-slate-800/20 border border-slate-700/50 rounded-2xl backdrop-blur-sm hover:border-amber-500/30 transition-all duration-300 group"
                >
                  <div className="flex gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-slate-300 mb-8 leading-relaxed font-light">&quot;{testimonial.text}&quot;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {testimonial.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-sm text-slate-400">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 border-t border-slate-800/50">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative p-12 sm:p-16 bg-gradient-to-br from-amber-500/10 via-amber-600/10 to-amber-500/10 border border-amber-500/30 rounded-3xl backdrop-blur-sm overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/5 to-transparent"></div>
              <div className="relative">
                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
                  Готовы наладить процессы?
                </h2>
                <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
                  Присоединяйтесь к Delegator уже сегодня и начните работать эффективно
                </p>
                {!loading && (
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-500/25 text-lg"
                  >
                    Зарегистрироваться бесплатно
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modals */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setActiveModal(null)}>
          <div className="relative w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button
              onClick={() => setActiveModal(null)}
              className="absolute -top-3 -right-3 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl">
              {activeModal === 'about' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">О компании</h3>
                  </div>
                  <div className="space-y-4 text-slate-300">
                    <p className="leading-relaxed">
                      <strong className="text-amber-500">Delegator</strong> — это современная платформа для делегирования задач и управления командой, созданная для повышения эффективности бизнеса.
                    </p>
                    <p className="leading-relaxed">
                      Мы помогаем компаниям наладить процессы, устранить хаос в задачах и обеспечить прозрачность работы каждого сотрудника.
                    </p>
                    <div className="pt-4 grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="text-2xl font-bold text-amber-500 mb-1">50+</div>
                        <div className="text-xs text-slate-400">Компаний</div>
                      </div>
                      <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="text-2xl font-bold text-amber-500 mb-1">1000+</div>
                        <div className="text-xs text-slate-400">Пользователей</div>
                      </div>
                      <div className="text-center p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <div className="text-2xl font-bold text-amber-500 mb-1">99%</div>
                        <div className="text-xs text-slate-400">Довольных</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'contact' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Контакты</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">Email</div>
                        <div className="text-slate-200 font-medium">info@delegator.com</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">Телефон</div>
                        <div className="text-slate-200 font-medium">+7 (999) 123-45-67</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-xs text-slate-400 uppercase tracking-wide">Адрес</div>
                        <div className="text-slate-200 font-medium">г. Москва, ул. Примерная, д. 1</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeModal === 'support' && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Поддержка</h3>
                  </div>
                  <div className="space-y-4 text-slate-300">
                    <p className="leading-relaxed">
                      Наша команда поддержки готова помочь вам с любыми вопросами по использованию платформы.
                    </p>
                    <div className="p-4 bg-violet-500/10 border border-violet-500/30 rounded-xl">
                      <div className="flex items-center gap-2 text-violet-400 font-medium mb-2">
                        <Clock className="w-4 h-4" />
                        <span>Время работы поддержки</span>
                      </div>
                      <p className="text-sm">Пн-Пт: 9:00 - 18:00 (МСК)</p>
                      <p className="text-sm">Сб-Вс: Выходной</p>
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span>Техническая поддержка 24/7</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span>Помощь в настройке системы</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span>Обучение работе с платформой</span>
                      </div>
                    </div>
                    <div className="pt-4">
                      <a href="mailto:support@delegator.com" className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg shadow-violet-500/25">
                        <Mail className="w-4 h-4" />
                        Написать в поддержку
                      </a>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-12">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Delegator</span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Профессиональная система делегирования и контроля задач для современного бизнеса
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Продукт</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="#features" className="hover:text-amber-500 transition-colors">Возможности</Link></li>
                <li><Link href="/pricing" className="hover:text-amber-500 transition-colors">Тарифы</Link></li>
                <li><Link href="#how-it-works" className="hover:text-amber-500 transition-colors">Как работает</Link></li>
                <li><Link href="#testimonials" className="hover:text-amber-500 transition-colors">Отзывы</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Компания</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><button onClick={() => setActiveModal('about')} className="hover:text-amber-500 transition-colors text-left">О нас</button></li>
                <li><button onClick={() => setActiveModal('contact')} className="hover:text-amber-500 transition-colors text-left">Контакты</button></li>
                <li><button onClick={() => setActiveModal('support')} className="hover:text-amber-500 transition-colors text-left">Поддержка</button></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Правовая информация</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li><Link href="/privacy" className="hover:text-amber-500 transition-colors">Политика конфиденциальности</Link></li>
                <li><Link href="/terms" className="hover:text-amber-500 transition-colors">Условия использования</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 Delegator. Все права защищены.
            </p>
            <p className="text-slate-500 text-sm">
              Профессиональная система делегирования
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
