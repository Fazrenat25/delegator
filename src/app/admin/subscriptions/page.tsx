'use client';

import { useEffect, useState } from 'react';
import {
  CreditCard,
  Crown,
  Star,
  Zap,
  Edit2,
  X,
  Save,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

interface Subscription {
  id: string;
  userId: string;
  plan: string;
  startDate: string;
  endDate?: string | null;
  isActive: boolean;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email?: string | null;
  };
}

export default function AdminSubscriptionsPage() {
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    plan: '',
    endDate: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/subscriptions');
      const data = await response.json();

      if (data.success) {
        setSubscriptions(data.data.subscriptions);
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (sub: Subscription) => {
    setEditingSub(sub);
    setEditForm({
      plan: sub.plan,
      endDate: sub.endDate ? new Date(sub.endDate).toISOString().split('T')[0] : '',
      isActive: sub.isActive,
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editingSub) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/subscriptions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: editingSub.userId,
          plan: editForm.plan,
          endDate: editForm.endDate ? new Date(editForm.endDate).toISOString() : null,
          isActive: editForm.isActive,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowEditModal(false);
        loadSubscriptions();
      }
    } catch (error) {
      console.error('Error saving subscription:', error);
    } finally {
      setSaving(false);
    }
  };

  const planColors: Record<string, {
    bg: string;
    border: string;
    text: string;
    gradient: string;
  }> = {
    FREE: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      text: 'text-emerald-400',
      gradient: 'from-emerald-500 to-emerald-600',
    },
    TEAM: {
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      gradient: 'from-blue-500 to-blue-600',
    },
    BUSINESS: {
      bg: 'bg-violet-500/10',
      border: 'border-violet-500/30',
      text: 'text-violet-400',
      gradient: 'from-violet-500 to-violet-600',
    },
  };

  const planIcons: Record<string, React.ReactNode> = {
    FREE: <Star className="w-4 h-4" />,
    TEAM: <Zap className="w-4 h-4" />,
    BUSINESS: <Crown className="w-4 h-4" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Тарифы и подписки</h1>
          <p className="text-slate-400">Управление подписками пользователей</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['FREE', 'TEAM', 'BUSINESS'].map((plan) => {
          const count = subscriptions.filter((s) => s.plan === plan && s.isActive).length;
          const colors = planColors[plan];
          return (
            <div
              key={plan}
              className={`rounded-2xl border ${colors.border} ${colors.bg} backdrop-blur-sm p-6`}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}
                >
                  <div className={`text-white`}>{planIcons[plan]}</div>
                </div>
                <CheckCircle className={`w-6 h-6 ${colors.text}`} />
              </div>
              <p className="text-3xl font-bold text-white mb-1">{count}</p>
              <p className={`text-sm ${colors.text} font-medium`}>{plan}</p>
            </div>
          );
        })}
      </div>

      {/* Subscriptions Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-800/20 backdrop-blur-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Пользователь</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium">Тариф</th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium hidden md:table-cell">
                  Статус
                </th>
                <th className="text-left py-4 px-6 text-slate-400 font-medium hidden lg:table-cell">
                  Дата окончания
                </th>
                <th className="text-right py-4 px-6 text-slate-400 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                      Загрузка...
                    </div>
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>Подписки не найдены</p>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => {
                  const colors = planColors[sub.plan];
                  const isExpiringSoon =
                    sub.endDate &&
                    new Date(sub.endDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

                  return (
                    <tr
                      key={sub.id}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {sub.user.firstName[0]}
                              {sub.user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {sub.user.firstName} {sub.user.lastName}
                            </p>
                            <p className="text-sm text-slate-400">@{sub.user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold ${colors.bg} ${colors.border} ${colors.text}`}
                        >
                          {planIcons[sub.plan]}
                          {sub.plan}
                        </span>
                      </td>
                      <td className="py-4 px-6 hidden md:table-cell">
                        {sub.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-semibold">
                            <CheckCircle className="w-4 h-4" />
                            Активен
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-500/10 text-slate-400 text-sm font-semibold">
                            <X className="w-4 h-4" />
                            Неактивен
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6 hidden lg:table-cell">
                        {sub.endDate ? (
                          <div className="flex items-center gap-2">
                            {isExpiringSoon && (
                              <AlertCircle className="w-4 h-4 text-amber-400" />
                            )}
                            <span
                              className={
                                isExpiringSoon ? 'text-amber-400 font-semibold' : 'text-slate-300'
                              }
                            >
                              {new Date(sub.endDate).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500">Бессрочно</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(sub)}
                            className="p-2 hover:bg-violet-500/10 rounded-lg transition-colors group"
                            title="Редактировать"
                          >
                            <Edit2 className="w-4 h-4 text-violet-400 group-hover:text-violet-300" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                    planColors[editingSub.plan].gradient
                  } flex items-center justify-center`}
                >
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Редактирование подписки</h2>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* User Info */}
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                  <span className="text-sm font-bold text-white">
                    {editingSub.user.firstName[0]}
                    {editingSub.user.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {editingSub.user.firstName} {editingSub.user.lastName}
                  </p>
                  <p className="text-sm text-slate-400">@{editingSub.user.username}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">Тариф</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                >
                  <option value="FREE">FREE</option>
                  <option value="TEAM">TEAM</option>
                  <option value="BUSINESS">BUSINESS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Дата окончания
                </label>
                <input
                  type="date"
                  value={editForm.endDate}
                  onChange={(e) => setEditForm({ ...editForm, endDate: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Оставьте пустым для бессрочной подписки
                </p>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800 rounded-xl border border-slate-700">
                <div>
                  <p className="font-medium text-white">Активная подписка</p>
                  <p className="text-sm text-slate-400">Пользователь имеет доступ к тарифу</p>
                </div>
                <button
                  onClick={() => setEditForm({ ...editForm, isActive: !editForm.isActive })}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    editForm.isActive ? 'bg-violet-500' : 'bg-slate-700'
                  }`}
                >
                  <span
                    className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      editForm.isActive ? 'left-8' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Сохранить
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
