'use client';

import { useState } from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Check, X, Star, Sparkles, Zap, ArrowRight, Crown } from 'lucide-react';

const plans = [
  {
    name: 'FREE',
    subtitle: 'Для небольших команд',
    price: 0,
    period: 'навсегда',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-400',
    buttonColor: 'bg-emerald-500 hover:bg-emerald-600',
    features: [
      { text: 'До 5 человек', included: true },
      { text: 'Базовые задачи', included: true },
      { text: 'Уведомления', included: true },
      { text: 'Корпоративный чат', included: true },
      { text: 'Контроль задач', included: false },
      { text: 'Статистика и отчёты', included: false },
      { text: 'Интеграции', included: false },
    ],
    cta: 'Начать бесплатно',
    popular: false,
  },
  {
    name: 'TEAM',
    subtitle: 'Для растущих компаний',
    price: 29,
    period: 'месяц',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    textColor: 'text-blue-400',
    buttonColor: 'bg-blue-500 hover:bg-blue-600',
    features: [
      { text: 'До 15 человек', included: true },
      { text: 'Всё из Free', included: true },
      { text: 'Контроль задач', included: true },
      { text: 'Статусы и дедлайны', included: true },
      { text: 'Панель руководителя', included: true },
      { text: 'Приоритеты задач', included: true },
      { text: 'Статистика и отчёты', included: false },
    ],
    cta: 'Попробовать бесплатно',
    popular: true,
    trial: '7 дней бесплатно',
  },
  {
    name: 'BUSINESS',
    subtitle: 'Для крупного бизнеса',
    price: 79,
    period: 'месяц',
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-violet-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-400',
    buttonColor: 'bg-violet-500 hover:bg-violet-600',
    features: [
      { text: 'До 50 человек', included: true },
      { text: 'Всё из Team', included: true },
      { text: 'Автоматизация', included: true },
      { text: 'Расширенная аналитика', included: true },
      { text: 'Интеграции (API)', included: true },
      { text: 'Персональный менеджер', included: true },
      { text: 'Приоритетная поддержка', included: true },
    ],
    cta: 'Начать',
    popular: false,
  },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  const getPrice = (price: number) => {
    if (price === 0) return 0;
    return annual ? Math.floor(price * 0.8) : price;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <PublicHeader />

      <main className="container mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="text-amber-300 text-sm font-medium">Прозрачные тарифы</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
            Выберите план для{' '}
            <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              вашей команды
            </span>
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
            Начните бесплатно и масштабируйтесь по мере роста вашего бизнеса
          </p>
        </div>

        {/* Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!annual ? 'text-white' : 'text-slate-400'}`}>Ежемесячно</span>
          <button
            onClick={() => setAnnual(!annual)}
            className="relative w-14 h-7 bg-slate-800 rounded-full transition-colors"
          >
            <span
              className={`absolute top-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full transition-transform shadow-lg ${
                annual ? 'left-8' : 'left-1'
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-white' : 'text-slate-400'}`}>
            Ежегодно
            <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
              -20%
            </span>
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                plan.popular
                  ? `${plan.borderColor} ${plan.bgColor} shadow-2xl shadow-blue-500/10`
                  : 'bg-slate-800/20 border-slate-700/50 hover:border-slate-600'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg shadow-blue-500/30">
                      <Star className="w-4 h-4 text-white fill-white" />
                      <span className="text-white text-sm font-semibold">Самый популярный</span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Crown className="w-5 h-5 text-blue-400" />
                  </div>
                </>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-sm text-slate-400 mb-4">{plan.subtitle}</p>
                  <div className="flex items-baseline justify-center gap-1 flex-wrap">
                    {annual && plan.price > 0 ? (
                      <>
                        <span className="text-5xl font-bold text-white">
                          ${getPrice(plan.price) * 12}
                        </span>
                        <span className="text-slate-400">/год</span>
                      </>
                    ) : (
                      <>
                        <span className="text-5xl font-bold text-white">
                          ${getPrice(plan.price)}
                        </span>
                        <span className="text-slate-400">/{plan.period}</span>
                      </>
                    )}
                  </div>
                  {annual && plan.price > 0 && (
                    <p className="text-sm text-emerald-400 mt-2">
                      Экономия ${(plan.price - getPrice(plan.price)) * 12} в год
                    </p>
                  )}
                  {plan.trial && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300 text-xs font-semibold">{plan.trial}</span>
                    </div>
                  )}
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.name === 'TEAM' ? '/register?plan=TEAM' : '/register'}
                  className={`w-full py-3.5 px-6 rounded-xl font-semibold text-white transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${plan.buttonColor} hover:shadow-xl`}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </Link>

                {/* Upgrade Notice for FREE */}
                {plan.name === 'FREE' && (
                  <div className="mt-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                    <p className="text-xs text-amber-300 text-center">
                      🔔 Нужно больше 5 человек? Перейдите на TEAM или BUSINESS
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div
                      key={featureIndex}
                      className={`flex items-start gap-3 ${
                        feature.included ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {feature.included ? (
                        <Check className={`w-5 h-5 flex-shrink-0 ${plan.textColor}`} />
                      ) : (
                        <X className="w-5 h-5 flex-shrink-0" />
                      )}
                      <span className="text-sm">{feature.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="mt-20 max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Сравнение возможностей</h2>
            <p className="text-slate-400">Подробное сравнение всех тарифных планов</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-6 text-slate-400 font-medium">Возможность</th>
                  <th className="text-center py-4 px-6 text-emerald-400 font-semibold">FREE</th>
                  <th className="text-center py-4 px-6 text-blue-400 font-semibold">TEAM</th>
                  <th className="text-center py-4 px-6 text-violet-400 font-semibold">BUSINESS</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'Пользователей', free: '5', team: '15', business: '50' },
                  { feature: 'Задачи', free: 'Базовые', team: 'Продвинутые', business: 'Полный функционал' },
                  { feature: 'Уведомления', free: true, team: true, business: true },
                  { feature: 'Корпоративный чат', free: true, team: true, business: true },
                  { feature: 'Контроль задач', free: false, team: true, business: true },
                  { feature: 'Статусы и дедлайны', free: false, team: true, business: true },
                  { feature: 'Панель руководителя', free: false, team: true, business: true },
                  { feature: 'Автоматизация', free: false, team: false, business: true },
                  { feature: 'Аналитика', free: false, team: 'Базовая', business: 'Расширенная' },
                  { feature: 'Интеграции (API)', free: false, team: false, business: true },
                  { feature: 'Персональный менеджер', free: false, team: false, business: true },
                  { feature: 'Поддержка', free: 'Email', team: 'Email + Чат', business: 'Приоритетная 24/7' },
                ].map((row, index) => (
                  <tr key={index} className="border-b border-slate-800 hover:bg-slate-800/30 transition-colors">
                    <td className="py-4 px-6 text-slate-300">{row.feature}</td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.free === 'boolean' ? (
                        row.free ? (
                          <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-slate-400 text-sm">{row.free}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.team === 'boolean' ? (
                        row.team ? (
                          <Check className="w-5 h-5 text-blue-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-slate-400 text-sm">{row.team}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      {typeof row.business === 'boolean' ? (
                        row.business ? (
                          <Check className="w-5 h-5 text-violet-500 mx-auto" />
                        ) : (
                          <X className="w-5 h-5 text-slate-600 mx-auto" />
                        )
                      ) : (
                        <span className="text-slate-400 text-sm">{row.business}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Частые вопросы</h2>
            <p className="text-slate-400">Ответы на популярные вопросы о тарифах</p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: 'Можно ли перейти на другой тариф в любое время?',
                answer: 'Да, вы можете изменить или отменить тарифный план в любой момент в настройках аккаунта.',
              },
              {
                question: 'Есть ли пробный период для платных тарифов?',
                answer: 'Да, тариф TEAM включает 7-дневный бесплатный пробный период. Вы можете протестировать все возможности без привязки карты.',
              },
              {
                question: 'Что происходит, когда я превышаю лимит пользователей?',
                answer: 'Мы предупредим вас о приближении к лимиту. Вы сможете либо удалить пользователей, либо перейти на следующий тариф.',
              },
              {
                question: 'Предоставляете ли вы скидки для некоммерческих организаций?',
                answer: 'Да, мы предоставляем специальные условия для НКО и образовательных учреждений. Свяжитесь с нами для деталей.',
              },
            ].map((faq, index) => (
              <FAQItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-violet-500/20 rounded-3xl blur-3xl"></div>
            <div className="relative p-12 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/50 rounded-3xl backdrop-blur-xl">
              <h2 className="text-3xl font-bold text-white mb-4">
                Готовы начать?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Начните с бесплатного тарифа и масштабируйтесь по мере роста вашей команды
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all shadow-xl shadow-amber-500/25"
                >
                  Начать бесплатно
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/#features"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800/50 text-white font-semibold rounded-xl hover:bg-slate-700/50 transition-all border border-slate-700"
                >
                  Узнать больше
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 mt-20">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © 2026 Delegator. Все права защищены.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">
                Политика конфиденциальности
              </Link>
              <Link href="/terms" className="text-slate-400 hover:text-amber-500 transition-colors text-sm">
                Условия использования
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// FAQ Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-700/50 rounded-xl bg-slate-800/20 backdrop-blur-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/30 transition-colors"
      >
        <span className="font-medium text-slate-200">{question}</span>
        <span className={`w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center transition-transform ${open ? 'rotate-45' : ''}`}>
          <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="px-6 pb-4 text-slate-400">
          {answer}
        </div>
      )}
    </div>
  );
}
