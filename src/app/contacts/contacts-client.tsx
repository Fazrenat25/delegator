'use client';

import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { ArrowLeft, Mail, MessageSquare, Phone, MapPin, Clock, Send, Sparkles } from 'lucide-react';

export default function ContactsPage() {
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
              <span className="text-emerald-300 text-sm font-medium">Свяжитесь с нами</span>
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Мы всегда{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
                на связи
              </span>
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Есть вопросы о платформе? Нужна помощь с настройкой? Хотите обсудить корпоративный тариф?
              Напишите нам, и мы ответим в ближайшее время.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            {/* Contact Form */}
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-700/30 p-8">
              <h2 className="text-2xl font-bold text-white mb-6">Отправить сообщение</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    Ваше имя
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-colors"
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-colors"
                    placeholder="ivan@company.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-300 mb-2">
                    Тема
                  </label>
                  <input
                    type="text"
                    id="subject"
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-colors"
                    placeholder="Вопрос о тарифах"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                    Сообщение
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/30 transition-colors resize-none"
                    placeholder="Расскажите подробнее о вашем вопросе..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all shadow-xl shadow-emerald-500/25 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Отправить сообщение
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Email */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
                    <p className="text-slate-400 mb-2">Напишите нам на почту</p>
                    <a href="mailto:support@delegon.com" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                      support@delegon.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6 hover:border-cyan-500/20 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/30">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Телефон</h3>
                    <p className="text-slate-400 mb-2">Позвоните нам</p>
                    <a href="tel:+78001234567" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                      +7 (800) 123-45-67
                    </a>
                  </div>
                </div>
              </div>

              {/* Chat */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6 hover:border-violet-500/20 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-500/30">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Онлайн-чат</h3>
                    <p className="text-slate-400 mb-2">Быстрая поддержка в чате</p>
                    <button className="text-violet-400 hover:text-violet-300 transition-colors">
                      Открыть чат
                    </button>
                  </div>
                </div>
              </div>

              {/* Working Hours */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-500/30">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Часы работы</h3>
                    <div className="space-y-1 text-slate-400">
                      <p>Пн-Пт: 9:00 - 18:00 (МСК)</p>
                      <p>Сб-Вс: Выходной</p>
                      <p className="text-emerald-400 mt-2">Поддержка 24/7 для Business</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Office */}
              <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-2xl border border-slate-700/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-pink-500/30">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">Офис</h3>
                    <p className="text-slate-400">
                      г. Москва, ул. Примерная, д. 123<br />
                      БЦ "Технопарк", офис 456
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Quick Links */}
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm rounded-3xl border border-slate-700/30 p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Часто задаваемые вопросы</h2>
              <p className="text-slate-400">Возможно, ответ уже есть в нашей базе знаний</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <Link
                href="/pricing"
                className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-emerald-500/30 hover:bg-slate-800/70 transition-all group"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  Тарифы и оплата
                </h3>
                <p className="text-slate-400 text-sm">
                  Информация о тарифных планах и способах оплаты
                </p>
              </Link>

              <Link
                href="/#features"
                className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-cyan-500/30 hover:bg-slate-800/70 transition-all group"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Возможности
                </h3>
                <p className="text-slate-400 text-sm">
                  Узнайте о всех функциях платформы
                </p>
              </Link>

              <Link
                href="/#how-it-works"
                className="p-6 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-violet-500/30 hover:bg-slate-800/70 transition-all group"
              >
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">
                  Как начать
                </h3>
                <p className="text-slate-400 text-sm">
                  Пошаговое руководство по началу работы
                </p>
              </Link>
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
