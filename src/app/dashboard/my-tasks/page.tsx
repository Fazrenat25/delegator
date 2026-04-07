'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getPriorityColor, getStatusColor, formatDate } from '@/lib/utils';
import { Search, Filter, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';
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
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

export default function MyTasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData.success) {
          setUser(sessionData.data.user);

          const tasksRes = await fetch('/api/tasks/my');
          const tasksData = await tasksRes.json();
          if (tasksData.success) {
            setTasks(tasksData.data || []);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading tasks:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'IN_PROGRESS': return 'warning';
      case 'CANCELLED': return 'danger';
      default: return 'default';
    }
  };

  const getPriorityBadgeVariant = (priority: string): 'default' | 'success' | 'warning' | 'danger' => {
    switch (priority) {
      case 'URGENT': return 'danger';
      case 'HIGH': return 'warning';
      case 'LOW': return 'success';
      default: return 'default';
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Мои задачи</h1>
          <p className="text-sm sm:text-base text-slate-500">Задачи, назначенные вам</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Всего</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-slate-500 to-slate-600 rounded-xl flex items-center justify-center shadow-lg shadow-slate-500/30">
                  <Filter className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">В ожидании</p>
                  <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">В работе</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <AlertCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">Выполнено</p>
                  <p className="text-3xl font-bold text-emerald-600">{stats.completed}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <CheckCircle className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <Input
                  placeholder="Поиск задач..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200"
                >
                  <option value="all">Все статусы</option>
                  <option value="PENDING">В ожидании</option>
                  <option value="IN_PROGRESS">В работе</option>
                  <option value="COMPLETED">Выполнено</option>
                  <option value="CANCELLED">Отменено</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Задачи ({filteredTasks.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Задачи не найдены</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-5 bg-slate-50 rounded-xl border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 mb-2">{task.title}</h3>
                        <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                        <div className="flex items-center gap-3">
                          <Badge variant={getStatusBadgeVariant(task.status)} size="sm">
                            {task.status === 'PENDING' && 'В ожидании'}
                            {task.status === 'IN_PROGRESS' && 'В работе'}
                            {task.status === 'COMPLETED' && 'Выполнено'}
                            {task.status === 'CANCELLED' && 'Отменено'}
                          </Badge>
                          <Badge variant={getPriorityBadgeVariant(task.priority)} size="sm">
                            {task.priority === 'LOW' && 'Низкий'}
                            {task.priority === 'MEDIUM' && 'Средний'}
                            {task.priority === 'HIGH' && 'Высокий'}
                            {task.priority === 'URGENT' && 'Срочно'}
                          </Badge>
                          {task.deadline && (
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Clock size={14} />
                              {formatDate(task.deadline)}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Link href={`/dashboard/tasks/${task.id}`} className="flex items-center">
                          <Eye size={16} className="mr-1" />
                          Подробнее
                        </Link>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-200">
                      <span>Создано: {formatDate(task.createdAt)}</span>
                      <span>От: {task.createdBy.firstName} {task.createdBy.lastName}</span>
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
