'use client';

import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Scale, UserX, Book } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <PublicHeader />

      <main className="container mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-6 shadow-lg shadow-emerald-500/30">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Условия использования
            </h1>
            <p className="text-xl text-slate-400">
              Последнее обновление: 27 марта 2026 г.
            </p>
          </div>

          {/* Content */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              Добро пожаловать в <strong className="text-emerald-400">Delegon</strong>! Эти Условия использования регулируют 
              использование нашей платформы для делегирования задач и управления командой.
            </p>

            <div className="space-y-8">
              {/* Section 1 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Book className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">1. Общие положения</h2>
                </div>
                <div className="pl-13 space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    1.1. Регистрируясь в системе Delegon, вы подтверждаете, что ознакомились с этими 
                    Условиями использования и согласны соблюдать их.
                  </p>
                  <p className="leading-relaxed">
                    1.2. Мы оставляем за собой право изменять данные Условия в любое время. Изменения 
                    вступают в силу с момента публикации на сайте.
                  </p>
                  <p className="leading-relaxed">
                    1.3. Продолжение использования сервиса после внесения изменений означает ваше согласие 
                    с новыми Условиями.
                  </p>
                </div>
              </section>

              {/* Section 2 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">2. Регистрация аккаунта</h2>
                </div>
                <div className="pl-13 space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    2.1. Для использования сервиса вы должны зарегистрировать аккаунт, предоставив 
                    достоверную и полную информацию.
                  </p>
                  <p className="leading-relaxed">
                    2.2. Вы несете ответственность за сохранность данных своего аккаунта и за все действия, 
                    совершенные под вашей учетной записью.
                  </p>
                  <p className="leading-relaxed">
                    2.3. Один пользователь может иметь только один аккаунт в системе.
                  </p>
                  <p className="leading-relaxed">
                    2.4. Вы обязаны немедленно уведомить нас о любом несанкционированном доступе к вашему аккаунту.
                  </p>
                </div>
              </section>

              {/* Section 3 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
                    <Scale className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">3. Права и обязанности</h2>
                </div>
                <div className="pl-13">
                  <h3 className="text-lg font-semibold text-white mb-3">Вы имеете право:</h3>
                  <ul className="space-y-2 text-slate-300 mb-6">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span>Создавать, назначать и управлять задачами</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span>Приглашать сотрудников в свою компанию</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span>Использовать встроенный чат для коммуникации</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span>Просматривать статистику и отчеты</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">✓</span>
                      <span>Удалить свой аккаунт в любое время</span>
                    </li>
                  </ul>

                  <h3 className="text-lg font-semibold text-white mb-3">Вы обязаны:</h3>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>Использовать сервис только в законных целях</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>Не нарушать права других пользователей</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>Не распространять вредоносный контент через чат или задачи</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1">•</span>
                      <span>Не пытаться получить несанкционированный доступ к системе</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 4 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">4. Ограничения использования</h2>
                </div>
                <div className="pl-13">
                  <p className="text-slate-300 leading-relaxed mb-4">
                    Запрещается использовать Delegon для:
                  </p>
                  <ul className="space-y-2 text-slate-300">
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">✕</span>
                      <span>Распространения незаконного или вредоносного контента</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">✕</span>
                      <span>Нарушения авторских прав или интеллектуальной собственности</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">✕</span>
                      <span>Спама или массовых рассылок без согласия получателей</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">✕</span>
                      <span>Передачи конфиденциальной информации третьих лиц без их согласия</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-400 mt-1">✕</span>
                      <span>Любой деятельности, которая может нанести ущерб репутации сервиса</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* Section 5 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-lg shadow-pink-500/20">
                    <UserX className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">5. Приостановка и прекращение доступа</h2>
                </div>
                <div className="pl-13 space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    5.1. Мы оставляем за собой право приостановить или прекратить доступ к сервису в случае 
                    нарушения данных Условий.
                  </p>
                  <p className="leading-relaxed">
                    5.2. Вы можете удалить свой аккаунт в любой момент через настройки профиля. После удаления 
                    аккаунта все ваши данные будут удалены в течение 30 дней.
                  </p>
                  <p className="leading-relaxed">
                    5.3. Мы не несем ответственности за потерю данных в результате удаления аккаунта по 
                    инициативе пользователя.
                  </p>
                </div>
              </section>

              {/* Section 6 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">6. Отказ от ответственности</h2>
                </div>
                <div className="pl-13 space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    6.1. Сервис предоставляется «как есть» без каких-либо гарантий.
                  </p>
                  <p className="leading-relaxed">
                    6.2. Мы не несем ответственности за косвенные, случайные или последующие убытки, 
                    возникшие в результате использования или невозможности использования сервиса.
                  </p>
                  <p className="leading-relaxed">
                    6.3. Мы не гарантируем бесперебойную работу сервиса и оставляем за собой право на 
                    технические перерывы для обслуживания.
                  </p>
                </div>
              </section>

              {/* Section 7 */}
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">7. Заключительные положения</h2>
                </div>
                <div className="pl-13 space-y-4 text-slate-300">
                  <p className="leading-relaxed">
                    7.1. Данные Условия регулируются законодательством Российской Федерации.
                  </p>
                  <p className="leading-relaxed">
                    7.2. Все споры и разногласия разрешаются путем переговоров. В случае недостижения
                    согласия — в судебном порядке по месту нахождения истца.
                  </p>
                  <p className="leading-relaxed">
                    7.3. Вопросы и предложения по данным Условиям можно направить по адресу:
                    <span className="text-emerald-400 ml-1">legal@delegon.com</span>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-20">
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
                <li><Link href="/#about" className="hover:text-emerald-400 transition-colors">О нас</Link></li>
                <li><Link href="/#contact" className="hover:text-emerald-400 transition-colors">Контакты</Link></li>
                <li><Link href="/#support" className="hover:text-emerald-400 transition-colors">Поддержка</Link></li>
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
