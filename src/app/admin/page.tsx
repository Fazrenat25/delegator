'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Building2,
  CheckSquare,
  CreditCard,
  TrendingUp,
  TrendingDown,
  UserCheck,
  UserX,
  Crown,
  Star,
  Zap,
  AlertCircle,
} from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalCompanies: number;
  totalTasks: number;
  activeSubscriptions: number;
  usersByRole: Record<string, number>;
  subscriptionsByPlan: Record<string, number>;
}

interface RecentUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
  company?: { name: string } | null;
}

interface ExpiringSubscription {
  id: string;
  plan: string;
  endDate: string;
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
  const [expiringSubscriptions, setExpiringSubscriptions] = useState<ExpiringSubscription[]>([]);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();

        if (!data.success) {
          router.push('/login');
          return;
        }

        setStats(data.data.stats);
        setRecentUsers(data.data.recentUsers || []);
        setExpiringSubscriptions(data.data.expiringSubscriptions || []);
      } catch (error) {
        console.error('Error loading dashboard:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Всего пользователей',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/30',
    },
    {
      title: 'Компаний',
      value: stats?.totalCompanies || 0,
      icon: Building2,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
    },
    {
      title: 'Задач в системе',
      value: stats?.totalTasks || 0,
      icon: CheckSquare,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
    },
    {
      title: 'Активных подписок',
      value: stats?.activeSubscriptions || 0,
      icon: CreditCard,
      color: 'from-violet-500 to-violet-600',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/30',
    },
  ];

  const planColors: Record<string, string> = {
    FREE: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    TEAM: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    BUSINESS: 'text-violet-400 bg-violet-500/10 border-violet-500/30',
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'text-red-400 bg-red-500/10 border-red-500/30',
    DIRECTOR: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    EMPLOYEE: 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  const roleLabels: Record<string, string> = {
    ADMIN: 'Администратор',
    DIRECTOR: 'Директор',
    EMPLOYEE: 'Сотрудник',
  };

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="relative group rounded-2xl border backdrop-blur-sm bg-slate-800/20 hover:bg-slate-800/30 transition-all duration-300 hover:scale-105"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.bgColor} border ${stat.borderColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color.replace('from-', 'text-').split(' ')[0]}`} />
                </div>
                <div className={`px-2 py-1 rounded-lg ${stat.bgColor} border ${stat.borderColor}`}>
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-sm text-slate-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users by Role */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/20 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Пользователи по ролям</h2>
          </div>
          <div className="space-y-3">
            {stats &&
              Object.entries(stats.usersByRole).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-lg border ${roleColors[role] || 'text-slate-400'}`}>
                      <span className="text-sm font-semibold">{roleLabels[role] || role}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">{count}</span>
                </div>
              ))}
          </div>
        </div>

        {/* Subscriptions by Plan */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/20 backdrop-blur-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Подписки по тарифам</h2>
          </div>
          <div className="space-y-3">
            {stats &&
              Object.entries(stats.subscriptionsByPlan).map(([plan, count]) => (
                <div key={plan} className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className={`px-3 py-1 rounded-lg border ${planColors[plan] || 'text-slate-400'}`}>
                      <span className="text-sm font-semibold">{plan}</span>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-white">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Recent Users & Expiring Subscriptions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/20 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Новые пользователи</h2>
            </div>
          </div>
          <div className="space-y-3">
            {recentUsers.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Нет новых пользователей</p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-slate-400">@{user.username}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-lg border text-xs font-semibold ${roleColors[user.role]}`}>
                    {roleLabels[user.role] || user.role}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Expiring Subscriptions */}
        <div className="rounded-2xl border border-slate-800 bg-slate-800/20 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-white">Истекающие подписки</h2>
            </div>
          </div>
          <div className="space-y-3">
            {expiringSubscriptions.length === 0 ? (
              <p className="text-slate-400 text-center py-4">Нет истекающих подписок</p>
            ) : (
              expiringSubscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">
                        {sub.user.firstName[0]}
                        {sub.user.lastName[0]}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {sub.user.firstName} {sub.user.lastName}
                      </p>
                      <p className="text-xs text-slate-400">@{sub.user.username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-lg border text-xs font-semibold mb-1 ${planColors[sub.plan]}`}>
                      {sub.plan}
                    </div>
                    <p className="text-xs text-amber-400">
                      {new Date(sub.endDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
