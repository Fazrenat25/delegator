'use client';

import { useEffect, useState } from 'react';
import {
  Building2,
  Search,
  Edit2,
  Trash2,
  Users,
  CheckSquare,
  X,
  Save,
  Crown,
} from 'lucide-react';

interface Company {
  id: string;
  name: string;
  description?: string | null;
  createdAt: string;
  plan: string;
  planActive: boolean;
  planEndDate?: string | null;
  users: Array<{
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  }>;
  tasks: Array<{
    id: string;
    title: string;
    status: string;
  }>;
  _count: {
    users: number;
    tasks: number;
  };
}

export default function AdminCompaniesPage() {
  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [search, setSearch] = useState('');
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadCompanies();
  }, [search]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);

      const response = await fetch(`/api/admin/companies?${params}`);
      const data = await response.json();

      if (data.success) {
        setCompanies(data.data.companies);
      }
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company: Company) => {
    setEditingCompany(company);
    setEditForm({
      name: company.name,
      description: company.description || '',
    });
    setShowEditModal(true);
  };

  const handleSave = async () => {
    if (!editingCompany) return;

    setSaving(true);
    try {
      const response = await fetch('/api/admin/companies', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyId: editingCompany.id,
          data: editForm,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setShowEditModal(false);
        loadCompanies();
      }
    } catch (error) {
      console.error('Error saving company:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (companyId: string) => {
    try {
      const response = await fetch(`/api/admin/companies?companyId=${companyId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        loadCompanies();
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting company:', error);
    }
  };

  const planColors: Record<string, { bg: string; border: string; text: string; gradient: string }> = {
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

  const planLabels: Record<string, string> = {
    FREE: 'FREE',
    TEAM: 'TEAM',
    BUSINESS: 'BUSINESS',
  };

  const planIcons: Record<string, React.ReactNode> = {
    FREE: <Users className="w-3 h-3" />,
    TEAM: <Crown className="w-3 h-3" />,
    BUSINESS: <CheckSquare className="w-3 h-3" />,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Компании</h1>
          <p className="text-slate-400">Управление компаниями системы</p>
        </div>
        <button
          onClick={loadCompanies}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white transition-colors flex items-center gap-2"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Обновить
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск компаний..."
          className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              Загрузка...
            </div>
          </div>
        ) : companies.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Компании не найдены</p>
          </div>
        ) : (
          companies.map((company) => {
            const plan = planColors[company.plan] || planColors.FREE;
            const director = company.users.find(u => u.role === 'DIRECTOR');
            
            return (
              <div
                key={company.id}
                className="group relative rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-6 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 transition-all duration-300"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center shadow-lg`}>
                      <Building2 className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-1">{company.name}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-semibold ${plan.bg} ${plan.border} ${plan.text}`}>
                          {planIcons[company.plan]}
                          {planLabels[company.plan]}
                        </span>
                        {director && (
                          <span className="text-xs text-slate-500">
                            {director.firstName} {director.lastName[0]}.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(company)}
                      className="p-2 hover:bg-violet-500/10 rounded-lg transition-colors group/btn"
                      title="Редактировать"
                    >
                      <Edit2 className="w-4 h-4 text-slate-400 group-hover/btn:text-violet-400" />
                    </button>
                    {deleteConfirm === company.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(company.id)}
                          className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium rounded transition-colors"
                        >
                          Да
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="px-2 py-1 bg-slate-700 hover:bg-slate-600 text-white text-xs font-medium rounded transition-colors"
                        >
                          Нет
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(company.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group/btn"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-slate-400 group-hover/btn:text-red-400" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Description */}
                {company.description && (
                  <p className="text-slate-400 text-sm mb-4 line-clamp-2">{company.description}</p>
                )}

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">Сотрудников</span>
                    </div>
                    <p className="text-xl font-bold text-white">{company._count.users}</p>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckSquare className="w-4 h-4 text-slate-400" />
                      <span className="text-xs text-slate-400">Задач</span>
                    </div>
                    <p className="text-xl font-bold text-white">{company._count.tasks}</p>
                  </div>
                </div>

                {/* Users */}
                {company.users.length > 0 && (
                  <div className="pt-4 border-t border-slate-700">
                    <p className="text-xs text-slate-500 mb-3">Команда:</p>
                    <div className="flex flex-wrap gap-2">
                      {company.users
                        .sort((a, b) => (a.role === 'DIRECTOR' ? -1 : 1))
                        .map((user) => (
                          <span
                            key={user.id}
                            className={`px-2 py-1 rounded-lg text-xs font-medium ${
                              user.role === 'DIRECTOR'
                                ? 'bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 text-amber-400'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {user.firstName} {user.lastName[0]}.
                            {user.role === 'DIRECTOR' && (
                              <span className="ml-1 opacity-70">(Директор)</span>
                            )}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Created Date */}
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <p className="text-xs text-slate-500">
                    Создана: {new Date(company.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingCompany && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Edit2 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">Редактирование компании</h2>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Название компании
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-2">
                  Описание
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 resize-none"
                />
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
                className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
