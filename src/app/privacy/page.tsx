'use client';

import Link from 'next/link';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { ArrowLeft, Shield, Eye, Database, UserCheck, Mail, Clock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <PublicHeader />

      <main className="container mx-auto px-6 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          На главную
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 mb-6 shadow-lg shadow-amber-500/30">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Политика конфиденциальности
            </h1>
            <p className="text-xl text-slate-400">
              Последнее обновление: 27 марта 2026 г.
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-8 backdrop-blur-sm">
              <p className="text-slate-300 text-lg leading-relaxed mb-8">
                Мы в <strong className="text-amber-500">Delegator</strong> серьезно относимся к защите вашей конфиденциальности. 
                Эта Политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу личную информацию.
              </p>

              {/* Sections */}
              <div className="space-y-8">
                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">1. Какие данные мы собираем</h2>
                  </div>
                  <div className="pl-13">
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 mt-1">•</span>
                        <span><strong className="text-white">Имя и фамилия</strong> — для идентификации пользователя в системе</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 mt-1">•</span>
                        <span><strong className="text-white">Email адрес</strong> — для входа в систему и уведомлений</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 mt-1">•</span>
                        <span><strong className="text-white">Должность</strong> — для отображения в профиле и чате</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 mt-1">•</span>
                        <span><strong className="text-white">Данные компании</strong> — название и описание организации</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                      <Database className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">2. Как мы используем данные</h2>
                  </div>
                  <div className="pl-13">
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span>Предоставление доступа к функционалу системы делегирования задач</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span>Отправка уведомлений о новых задачах и дедлайнах</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span>Обеспечение работы чата между сотрудниками</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-1">✓</span>
                        <span>Формирование статистики и отчётности</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">3. Защита данных</h2>
                  </div>
                  <div className="pl-13">
                    <p className="text-slate-300 leading-relaxed mb-4">
                      Мы применяем современные меры безопасности для защиты вашей информации:
                    </p>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start gap-3">
                        <span className="text-violet-500 mt-1">🔒</span>
                        <span>Шифрование данных при передаче и хранении</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-violet-500 mt-1">🔒</span>
                        <span>Регулярное резервное копирование</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-violet-500 mt-1">🔒</span>
                        <span>Разграничение прав доступа между пользователями</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-violet-500 mt-1">🔒</span>
                        <span>Мониторинг и логирование доступа к данным</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">4. Передача данных третьим лицам</h2>
                  </div>
                  <div className="pl-13">
                    <p className="text-slate-300 leading-relaxed">
                      Мы <strong className="text-white">не продаем и не передаем</strong> ваши персональные данные третьим лицам. 
                      Исключение составляют случаи, когда это требуется по закону или необходимо для предоставления услуг 
                      (например, хостинг-провайдеру).
                    </p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">5. Ваши права</h2>
                  </div>
                  <div className="pl-13">
                    <p className="text-slate-300 leading-relaxed mb-4">
                      Вы имеете право:
                    </p>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-start gap-3">
                        <span className="text-pink-500 mt-1">✦</span>
                        <span>Получить копию своих персональных данных</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-pink-500 mt-1">✦</span>
                        <span>Исправить неточную информацию</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-pink-500 mt-1">✦</span>
                        <span>Удалить свой аккаунт и все связанные данные</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-pink-500 mt-1">✦</span>
                        <span>Отозвать согласие на обработку данных</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">6. Хранение данных</h2>
                  </div>
                  <div className="pl-13">
                    <p className="text-slate-300 leading-relaxed">
                      Мы храним ваши данные до тех пор, пока ваш аккаунт активен. После удаления аккаунта 
                      персональные данные удаляются в течение <strong className="text-white">30 дней</strong>, 
                      за исключением случаев, когда законодательство требует более длительного хранения.
                    </p>
                  </div>
                </section>

                <section>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">7. Контакты</h2>
                  </div>
                  <div className="pl-13">
                    <p className="text-slate-300 leading-relaxed">
                      По вопросам, связанным с конфиденциальностью и защитой данных, пожалуйста, свяжитесь с нами:
                    </p>
                    <p className="text-amber-500 mt-3">
                      privacy@delegator.com
                    </p>
                  </div>
                </section>
              </div>
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
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">Delegator</span>
              </Link>
              <p className="text-slate-400 text-sm">
                Профессиональная система делегирования и контроля задач
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Продукт</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/#features" className="hover:text-amber-500 transition-colors">Возможности</Link></li>
                <li><Link href="/pricing" className="hover:text-amber-500 transition-colors">Тарифы</Link></li>
                <li><Link href="/#how-it-works" className="hover:text-amber-500 transition-colors">Как работает</Link></li>
                <li><Link href="/#testimonials" className="hover:text-amber-500 transition-colors">Отзывы</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Компания</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/#about" className="hover:text-amber-500 transition-colors">О нас</Link></li>
                <li><Link href="/#contact" className="hover:text-amber-500 transition-colors">Контакты</Link></li>
                <li><Link href="/#support" className="hover:text-amber-500 transition-colors">Поддержка</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Правовая информация</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/privacy" className="hover:text-amber-500 transition-colors">Политика конфиденциальности</Link></li>
                <li><Link href="/terms" className="hover:text-amber-500 transition-colors">Условия использования</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
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
