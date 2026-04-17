'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getPriorityColor, getStatusColor, formatDate, formatDateTime } from '@/lib/utils';
import { Briefcase, CheckCircle, Clock, Plus, ArrowRight, Users, TrendingUp, Award, Target } from 'lucide-react';
import Link from 'next/link';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  companyId: string | null;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  assignedTo: {
    firstName: string;
    lastName: string;
  } | null;
}

interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  employeesCount: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  useEffect(() => {
    // Показываем уведомление об успешной оплате
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      setShowPaymentSuccess(true);
      // Очищаем URL
      window.history.replaceState({}, '', '/dashboard');
    }
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (!sessionData.success) {
          router.push('/login');
          return;
        }

        // Перенаправление админов на /admin
        if (sessionData.data.user?.role === 'ADMIN') {
          router.push('/admin');
          return;
        }

        setUser(sessionData.data.user);

        const tasksRes = await fetch('/api/tasks');
        const tasksData = await tasksRes.json();
        setTasks(tasksData.data || []);

        // Загружаем сотрудников (только для директора)
        let employeesCount = 0;
        if (sessionData.data.user?.role === 'DIRECTOR') {
          const employeesRes = await fetch('/api/employees');
          const employeesData = await employeesRes.json();
          employeesCount = employeesData.data?.length || 0;
        }

        // Calculate stats
        const completedTasks = tasksData.data?.filter((t: Task) => t.status === 'COMPLETED').length || 0;
        const inProgressTasks = tasksData.data?.filter((t: Task) => t.status === 'IN_PROGRESS').length || 0;
        const pendingTasks = tasksData.data?.filter((t: Task) => t.status === 'PENDING').length || 0;

        setStats({
          totalTasks: tasksData.data?.length || 0,
          completedTasks,
          inProgressTasks,
          pendingTasks,
          employeesCount,
        });
      } catch (error) {
        console.error('Error loading dashboard:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: 'Ожидает',
      IN_PROGRESS: 'В работе',
      COMPLETED: 'Завершено',
      CANCELLED: 'Отменено',
    };
    return labels[status] || status;
  };

  const getPriorityLabel = (priority: string) => {
    const labels: Record<string, string> = {
      LOW: 'Низкий',
      MEDIUM: 'Средний',
      HIGH: 'Высокий',
      URGENT: 'Срочно',
    };
    return labels[priority] || priority;
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8 min-h-screen bg-slate-900/50">
        {/* Payment Success Notification */}
        {showPaymentSuccess && (
          <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/25">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">
                Оплата прошла успешно!
              </h3>
              <p className="text-slate-400 text-sm">
                Ваш тариф обновлён. Теперь вам доступны все возможности нового тарифа.
              </p>
            </div>
            <button
              onClick={() => setShowPaymentSuccess(false)}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow" hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Всего задач</p>
                  <p className="text-3xl font-bold text-white">{stats?.totalTasks || 0}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Завершено</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats?.completedTasks || 0}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow" hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">В работе</p>
                  <p className="text-3xl font-bold text-cyan-600">{stats?.inProgressTasks || 0}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions & Recent Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Быстрые действия</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {user.role === 'DIRECTOR' && (
                <>
                  <Link href="/dashboard/tasks/new">
                    <Button className="w-full justify-start" variant="primary">
                      <Plus size={20} className="mr-2" />
                      Создать задачу
                    </Button>
                  </Link>
                  <Link href="/dashboard/employees">
                    <Button className="w-full justify-start" variant="outline">
                      <Users size={20} className="mr-2" />
                      Управление сотрудниками
                    </Button>
                  </Link>
                </>
              )}
              {user.role !== 'DIRECTOR' && (
                <Link href="/dashboard/my-tasks">
                  <Button className="w-full justify-start" variant="primary">
                    <Briefcase size={20} className="mr-2" />
                    Мои задачи
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Последние задачи</CardTitle>
              <Link href="/dashboard/tasks" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center">
                Все задачи
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </CardHeader>
            <CardContent>
              {tasks.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Задач пока нет</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div
                      key={task.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700/30 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 gap-4"
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-white mb-3 truncate">{task.title}</h4>
                        <div className="flex flex-col gap-2 text-xs">
                          <span className="flex items-center gap-2 text-slate-400">
                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-slate-500">Создано:</span>
                            <span className="font-medium text-slate-300">{formatDateTime(task.createdAt)}</span>
                          </span>
                          {task.status !== 'PENDING' && (
                            <span className="flex items-center gap-2 text-slate-400">
                              <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                              </svg>
                              <span className="text-slate-500">В работе:</span>
                              <span className="font-medium text-slate-300">{formatDateTime(task.updatedAt)}</span>
                            </span>
                          )}
                          {task.deadline && (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-slate-400">Дедлайн:</span>
                              <span className="text-emerald-400 font-semibold">{formatDateTime(task.deadline)}</span>
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge variant={task.priority === 'URGENT' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'info'} size="sm">
                          {getPriorityLabel(task.priority)}
                        </Badge>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mini Statistics - только для директора */}
        {user.role === 'DIRECTOR' && stats && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Общая статистика</h2>
              <Link href="/dashboard/statistics" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center">
                Подробно
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Completion Rate */}
              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">Выполнено</p>
                      <p className="text-2xl font-bold text-emerald-600">
                        {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* In Progress */}
              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">В работе</p>
                      <p className="text-2xl font-bold text-cyan-600">{stats.inProgressTasks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Pending */}
              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">Ожидает</p>
                      <p className="text-2xl font-bold text-cyan-600">{stats.pendingTasks}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employees */}
              <Card hover>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/30">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-400">Сотрудников</p>
                      <p className="text-2xl font-bold text-slate-400">{stats.employeesCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
