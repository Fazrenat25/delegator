'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, Briefcase, TrendingUp, Award } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  companyId: string | null;
}

interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  position: string | null;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface Stats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  pendingTasks: number;
  cancelledTasks: number;
  completionRate: number;
  recentTasks: Task[];
}

export default function EmployeeStatisticsPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData.success) {
          setUser(sessionData.data.user);

          // Загружаем сотрудника
          const employeesRes = await fetch('/api/employees');
          const employeesData = await employeesRes.json();
          if (employeesData.success) {
            const emp = employeesData.data.find((e: Employee) => e.id === params.id);
            if (emp) {
              setEmployee(emp);
            } else {
              router.push('/dashboard/employees');
              return;
            }
          }

          // Загружаем задачи компании
          const tasksRes = await fetch('/api/tasks');
          const tasksData = await tasksRes.json();
          const allTasks = tasksData.data || [];

          // Фильтруем задачи сотрудника
          const employeeTasks = allTasks.filter((t: Task) => t.assignedTo && t.assignedTo.id === params.id);

          const completedTasks = employeeTasks.filter((t: Task) => t.status === 'COMPLETED').length;
          const inProgressTasks = employeeTasks.filter((t: Task) => t.status === 'IN_PROGRESS').length;
          const pendingTasks = employeeTasks.filter((t: Task) => t.status === 'PENDING').length;
          const cancelledTasks = employeeTasks.filter((t: Task) => t.status === 'CANCELLED').length;

          setStats({
            totalTasks: employeeTasks.length,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            cancelledTasks,
            completionRate: employeeTasks.length > 0 
              ? Math.round((completedTasks / employeeTasks.length) * 100) 
              : 0,
            recentTasks: employeeTasks.slice(0, 10),
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading employee statistics:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.id, router]);

  if (loading || !user || !employee || !stats) {
    return (
      <div className="min-h-screen bg-slate-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  const getPositionLabel = (position?: string | null) => {
    const positions: Record<string, string> = {
      'MANAGER': 'Менеджер',
      'DEVELOPER': 'Разработчик',
      'DESIGNER': 'Дизайнер',
      'ANALYST': 'Аналитик',
      'TESTER': 'Тестировщик',
      'HR': 'HR-специалист',
      'ACCOUNTANT': 'Бухгалтер',
      'SALESMAN': 'Менеджер по продажам',
      'SUPPORT': 'Специалист поддержки',
      'INTERN': 'Стажер',
    };
    return position ? positions[position] || 'Сотрудник' : 'Сотрудник';
  };

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft size={16} className="mr-2" />
            Назад
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Статистика: {employee.firstName} {employee.lastName}
            </h1>
            <p className="text-sm text-slate-500">
              {getPositionLabel(employee.position)}
            </p>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Всего задач</p>
                  <p className="text-3xl font-bold text-white">{stats.totalTasks}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Briefcase className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Выполнено</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.completedTasks}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">В работе</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgressTasks}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Процент выполнения</p>
                  <p className="text-3xl font-bold text-cyan-600">{stats.completionRate}%</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks by Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan-400" />
                Распределение задач
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                    <span className="text-sm text-slate-400">В ожидании</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stats.pendingTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-sm text-slate-400">В работе</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stats.inProgressTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-slate-400">Завершено</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stats.completedTasks}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm text-slate-400">Отменено</span>
                  </div>
                  <span className="text-lg font-bold text-white">{stats.cancelledTasks}</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-6 h-3 bg-slate-800/50 rounded-full overflow-hidden flex">
                {stats.totalTasks > 0 && (
                  <>
                    <div 
                      className="bg-slate-400 transition-all"
                      style={{ width: `${(stats.pendingTasks / stats.totalTasks) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-blue-500 transition-all"
                      style={{ width: `${(stats.inProgressTasks / stats.totalTasks) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-emerald-500 transition-all"
                      style={{ width: `${(stats.completedTasks / stats.totalTasks) * 100}%` }}
                    ></div>
                    <div 
                      className="bg-red-500 transition-all"
                      style={{ width: `${(stats.cancelledTasks / stats.totalTasks) * 100}%` }}
                    ></div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Performance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                Показатели эффективности
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-emerald-700">Успешность выполнения</span>
                  <span className="text-2xl font-bold text-emerald-900">{stats.completionRate}%</span>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Всего задач</span>
                  <span className="text-2xl font-bold text-blue-900">{stats.totalTasks}</span>
                </div>
              </div>

              <div className="p-4 bg-cyan-500/10 rounded-lg border border-cyan-500/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-cyan-700">Активных задач</span>
                  <span className="text-2xl font-bold text-cyan-900">{stats.inProgressTasks + stats.pendingTasks}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Tasks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-cyan-400" />
              Последние задачи
            </CardTitle>
          </CardHeader>
          <CardContent>
            {stats.recentTasks.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Задач пока нет</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg border border-slate-700/50"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white mb-1 truncate">{task.title}</h4>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span>{formatDate(task.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={task.status === 'COMPLETED' ? 'success' : task.status === 'IN_PROGRESS' ? 'warning' : task.status === 'CANCELLED' ? 'danger' : 'default'} 
                        size="sm"
                      >
                        {task.status === 'PENDING' && 'В ожидании'}
                        {task.status === 'IN_PROGRESS' && 'В работе'}
                        {task.status === 'COMPLETED' && 'Завершено'}
                        {task.status === 'CANCELLED' && 'Отменено'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
