'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Check, Lock, CreditCard, Smartphone, Building } from 'lucide-react';

const plans = {
  TEAM: {
    name: 'TEAM',
    price: 29,
    users: 15,
    features: ['Всё из Free', 'Контроль задач', 'Статусы и дедлайны', 'Панель руководителя', '7 дней бесплатно'],
    color: 'from-blue-500 to-blue-600',
  },
  BUSINESS: {
    name: 'BUSINESS',
    price: 79,
    users: 50,
    features: ['Всё из Team', 'Автоматизация', 'Аналитика', 'Интеграции (API)', 'Персональный менеджер'],
    color: 'from-violet-500 to-violet-600',
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planType = searchParams.get('plan') as 'TEAM' | 'BUSINESS' | null;
  const [loading, setLoading] = useState(false);
  const [annual, setAnnual] = useState(false);

  const plan = planType ? plans[planType] : null;
  const price = plan ? (annual ? Math.floor(plan.price * 0.8) : plan.price) : 0;

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Имитация обработки платежа
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Обновляем тариф на сервере
      if (planType) {
        const response = await fetch('/api/subscription', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            plan: planType,
            period: annual ? 'YEARLY' : 'MONTHLY'
          }),
        });

        const data = await response.json();

        if (!data.success) {
          alert('Ошибка обновления тарифа: ' + data.error);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      router.push('/dashboard?payment=success');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Ошибка обработки платежа');
      setLoading(false);
    }
  };

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 mb-4">Тариф не выбран</p>
          <Link href="/pricing" className="text-amber-500 hover:text-amber-400">
            Выбрать тариф
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800/50 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <Link href="/dashboard" className="flex items-center gap-3 group inline-flex">
            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            <span className="text-slate-400 group-hover:text-white transition-colors">Назад в кабинет</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-4">
              <Lock className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-300 text-sm font-medium">Безопасная оплата</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Оформление подписки</h1>
            <p className="text-slate-400">Выберите способ оплаты и завершите оформление</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Plan Summary */}
            <div className="lg:col-span-1">
              <div className={`bg-gradient-to-br ${plan.color} rounded-2xl p-6 text-white shadow-2xl`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-white/80 mb-6">До {plan.users} человек</p>
                
                <div className="mb-6">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-5xl font-bold">${price}</span>
                    <span className="text-white/70">/месяц</span>
                  </div>
                  {annual && (
                    <p className="text-emerald-300 text-sm">
                      Экономия ${(plan.price - price) * 12} в год
                    </p>
                  )}
                </div>

                {/* Toggle */}
                <div className="flex items-center gap-3 mb-6 p-3 bg-white/10 rounded-xl">
                  <span className={`text-sm ${!annual ? 'text-white font-medium' : 'text-white/70'}`}>Ежемесячно</span>
                  <button
                    onClick={() => setAnnual(!annual)}
                    className="relative w-12 h-6 bg-white/20 rounded-full transition-colors"
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                        annual ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm ${annual ? 'text-white font-medium' : 'text-white/70'}`}>
                    Ежегодно
                    <span className="ml-1 px-1.5 py-0.5 bg-emerald-500 text-white text-xs rounded">-20%</span>
                  </span>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm text-white/90">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-6 p-4 bg-slate-800/30 border border-slate-700 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm font-medium text-white">Безопасная оплата</span>
                </div>
                <p className="text-xs text-slate-400 mb-3">
                  Ваши данные защищены SSL-шифрованием
                </p>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-slate-400" />
                  <Smartphone className="w-6 h-6 text-slate-400" />
                  <Building className="w-6 h-6 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Card */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-amber-500" />
                    Данные карты
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Номер карты
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: e.target.value.replace(/\D/g, '').slice(0, 16) })}
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-400 mb-2">
                        Владелец карты
                      </label>
                      <input
                        type="text"
                        value={paymentData.cardName}
                        onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value.toUpperCase() })}
                        placeholder="IVAN IVANOV"
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          Срок действия
                        </label>
                        <input
                          type="text"
                          value={paymentData.expiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2);
                            }
                            setPaymentData({ ...paymentData, expiry: value });
                          }}
                          placeholder="MM/YY"
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                          CVV/CVC
                        </label>
                        <input
                          type="text"
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 3) })}
                          placeholder="123"
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-slate-800/30 border border-slate-700 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Итого к оплате</h3>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-slate-400">
                      <span>Подписка {plan.name}</span>
                      <span>${price}</span>
                    </div>
                    {annual && (
                      <div className="flex justify-between text-emerald-400">
                        <span>Скидка 20%</span>
                        <span>-${(plan.price - price) * 12}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-slate-400">
                      <span>НДС</span>
                      <span>$0</span>
                    </div>
                    <div className="border-t border-slate-700 pt-3 flex justify-between text-white font-semibold text-lg">
                      <span>К оплате</span>
                      <span>${annual ? price * 12 : price}</span>
                    </div>
                    {annual && (
                      <p className="text-xs text-slate-500 text-right">
                        ${price}/месяц при оплате за год
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-4 px-6 bg-gradient-to-r ${plan.color} text-white font-semibold rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Обработка...
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        Оплатить ${annual ? price * 12 : price}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-slate-500 text-center mt-4">
                    Нажимая кнопку, вы соглашаетесь с{' '}
                    <Link href="/terms" className="text-amber-500 hover:text-amber-400" target="_blank">
                      Условиями использования
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
