'use client';

import { PublicHeader } from '@/components/layout/PublicHeader';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Users, Clock, BarChart3 } from 'lucide-react';

export default function KontrolPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <PublicHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Контроль задач сотрудников
          </h1>
          <p className="text-xl text-slate-300 leading-relaxed">
            Delegon — это система контроля задач сотрудников, которая позволяет отслеживать выполнение задач и анализировать эффективность команды.
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          {/* Как контролировать сотрудников */}
          <section className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Как контролировать сотрудников</h2>
            </div>
            <p className="text-lg text-slate-300 mb-6">
              Сервис даёт полный контроль над задачами: статусы, сроки и ответственные.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300 text-lg">Отслеживание статусов задач</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300 text-lg">Контроль сроков</span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <span className="text-slate-300 text-lg">Анализ эффективности</span>
              </li>
            </ul>
          </section>

          {/* Преимущества системы */}
          <section className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Преимущества системы</h2>
            </div>
            <p className="text-lg text-slate-300">
              Вы всегда знаете, кто и над чем работает.
            </p>
          </section>

          {/* CTA Section */}
          <section className="text-center py-12">
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-4">
                Начните контролировать задачи эффективно
              </h3>
              <p className="text-slate-300 mb-6">
                Попробуйте Delegon бесплатно и убедитесь в удобстве системы
              </p>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-xl hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5"
              >
                Начать бесплатно
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Delegon. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
