'use client';

import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { ArrowLeft, Target, Users, Zap, Shield, Heart, TrendingUp, Award, Sparkles, CheckCircle } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <PublicHeader />

      <main className="container mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <div className="max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-sm font-medium">О платформе</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Делаем делегирование{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                простым и эффективным
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Delegon — это современная платформа для управления задачами и делегирования,
              которая помогает командам работать продуктивнее и достигать больших результатов.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-700/30 p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Наша миссия</h2>
                </div>
                <p className="text-lg text-slate-300 leading-relaxed">
                  Мы создаем инструменты, которые помогают руководителям эффективно делегировать задачи,
                  а сотрудникам — четко понимать свои обязанности и приоритеты. Наша цель — сделать рабочие
                  процессы прозрачными, управляемыми и результативными для команд любого размера.
                </p>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Наши ценности</h2>
              <p className="text-slate-400 text-lg">Принципы, которыми мы руководствуемся</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: 'Простота',
                  description: 'Интуитивный интерфейс, который не требует обучения',
                  color: 'from-emerald-500 to-teal-600',
                  shadowColor: 'shadow-emerald-500/30',
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: 'Надежность',
                  description: 'Защита данных и стабильная работа 24/7',
                  color: 'from-cyan-500 to-cyan-600',
                  shadowColor: 'shadow-cyan-500/30',
                },
                {
                  icon: <Heart className="w-6 h-6" />,
                  title: 'Забота',
                  description: 'Поддержка клиентов и постоянное улучшение продукта',
                  color: 'from-pink-500 to-pink-600',
                  shadowColor: 'shadow-pink-500/30',
                },
                {
                  icon: <TrendingUp className="w-6 h-6" />,
                  title: 'Эффективность',
                  description: 'Инструменты для роста продуктивности команды',
                  color: 'from-violet-500 to-violet-600',
                  shadowColor: 'shadow-violet-500/30',
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: 'Командность',
                  description: 'Создаем условия для слаженной работы',
                  color: 'from-amber-500 to-amber-600',
                  shadowColor: 'shadow-amber-500/30',
                },
                {
                  icon: <Award className="w-6 h-6" />,
                  title: 'Качество',
                  description: 'Высокие стандарты во всем, что мы делаем',
                  color: 'from-emerald-500 to-emerald-600',
                  shadowColor: 'shadow-emerald-500/30',
                },
              ].map((value, index) => (
                <div
                  key={index}
                  className="bg-slate-800/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 hover:-translate-y-1 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-4 shadow-lg ${value.shadowColor}`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-20">
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-700/30 p-12">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-white mb-4">Delegon в цифрах</h2>
                <p className="text-slate-400 text-lg">Результаты, которыми мы гордимся</p>
              </div>

              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { value: '1000+', label: 'Компаний', icon: <Users className="w-6 h-6" />, color: 'emerald' },
                  { value: '50K+', label: 'Задач в день', icon: <CheckCircle className="w-6 h-6" />, color: 'cyan' },
                  { value: '98%', label: 'Довольных клиентов', icon: <Heart className="w-6 h-6" />, color: 'pink' },
                  { value: '24/7', label: 'Поддержка', icon: <Shield className="w-6 h-6" />, color: 'violet' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-${stat.color}-500/30`}>
                      {stat.icon}
                    </div>
                    <div className={`text-4xl font-bold bg-gradient-to-r from-${stat.color}-400 to-${stat.color}-600 bg-clip-text text-transparent mb-2`}>
                      {stat.value}
                    </div>
                    <div className="text-slate-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-3xl blur-3xl"></div>
              <div className="relative p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-3xl backdrop-blur-xl">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Готовы начать?
                </h2>
                <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                  Присоединяйтесь к тысячам команд, которые уже используют Delegon для эффективного управления задачами
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.02]"
                  >
                    Начать бесплатно
                    <ArrowLeft className="w-5 h-5 rotate-180" />
                  </Link>
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-xl hover:bg-slate-700/50 transition-all border border-slate-700"
                  >
                    Посмотреть тарифы
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Delegon</span>
              </Link>
              <p className="text-slate-400 text-sm">
                Профессиональная система делегирования и контроля задач
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Продукт</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/#features" className="hover:text-emerald-400 transition-colors">Возможности</Link></li>
                <li><Link href="/pricing" className="hover:text-emerald-400 transition-colors">Тарифы</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-emerald-400 transition-colors">Как работает</Link></li>
                <li><Link href="/#testimonials" className="hover:text-emerald-400 transition-colors">Отзывы</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Компания</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/about" className="hover:text-emerald-400 transition-colors">О нас</Link></li>
                <li><Link href="/contacts" className="hover:text-emerald-400 transition-colors">Контакты</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Правовая информация</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Политика конфиденциальности</Link></li>
                <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Условия использования</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 Delegon. Все права защищены.
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
