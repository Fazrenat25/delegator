'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatDate, formatDateTime, getPriorityColor, getStatusColor } from '@/lib/utils';
import { ArrowLeft, Clock, User, Calendar, AlertCircle, CheckCircle, PlayCircle } from 'lucide-react';
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
  createdBy: {
    firstName: string;
    lastName: string;
  };
  assignedTo: {
    firstName: string;
    lastName: string;
  } | null;
  company: {
    name: string;
  };
}

export default function TaskDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData.success) {
          setUser(sessionData.data.user);

          const taskRes = await fetch(`/api/tasks?id=${params.id}`);
          const taskData = await taskRes.json();
          if (taskData.success) {
            setTask(taskData.data);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading task:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [params.id, router]);

  const handleStatusChange = async (newStatus: string) => {
    if (!task) return;
    
    setUpdating(true);
    try {
      const response = await fetch(`/api/tasks?id=${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setTask(data.data);
      } else {
        alert(data.error || 'Ошибка обновления статуса');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Ошибка обновления статуса');
    } finally {
      setUpdating(false);
    }
  };

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

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <DashboardLayout user={user}>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h2 className="text-2xl font-bold text-white mb-2">Задача не найдена</h2>
          <Button onClick={() => router.back()}>
            <ArrowLeft size={16} className="mr-2" />
            Назад
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft size={16} className="mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Задача #{task.id.slice(-6)}</h1>
        </div>

        {/* Task Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{task.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant={getStatusBadgeVariant(task.status)} size="sm">
                    {task.status === 'PENDING' && 'В ожидании'}
                    {task.status === 'IN_PROGRESS' && 'В работе'}
                    {task.status === 'COMPLETED' && 'Выполнено'}
                    {task.status === 'CANCELLED' && 'Отменено'}
                  </Badge>
                  <Badge variant={getPriorityBadgeVariant(task.priority)} size="sm">
                    {task.priority === 'LOW' && 'Низкий приоритет'}
                    {task.priority === 'MEDIUM' && 'Средний приоритет'}
                    {task.priority === 'HIGH' && 'Высокий приоритет'}
                    {task.priority === 'URGENT' && 'Срочно'}
                  </Badge>
                </div>

                <div className="prose max-w-none">
                  <h3 className="text-lg font-semibold text-white mb-2">Описание</h3>
                  <p className="text-slate-400 whitespace-pre-wrap">{task.description}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Actions - только для исполнителя */}
            {user.role === 'EMPLOYEE' && task.assignedTo?.firstName && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Действия</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {task.status === 'PENDING' && (
                    <Button
                      onClick={() => handleStatusChange('IN_PROGRESS')}
                      disabled={updating}
                      className="w-full"
                      variant="primary"
                    >
                      <PlayCircle size={16} className="mr-2" />
                      Взять в работу
                    </Button>
                  )}
                  {task.status === 'IN_PROGRESS' && (
                    <Button
                      onClick={() => handleStatusChange('COMPLETED')}
                      disabled={updating}
                      className="w-full"
                      variant="primary"
                    >
                      <CheckCircle size={16} className="mr-2" />
                      Завершить задачу
                    </Button>
                  )}
                  {task.status === 'COMPLETED' && (
                    <div className="text-center text-sm text-emerald-600 font-medium">
                      ✓ Задача выполнена
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Meta Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-500">Создано</p>
                    <p className="font-medium text-white">
                      {task.createdBy.firstName} {task.createdBy.lastName}
                    </p>
                  </div>
                </div>

                {task.assignedTo && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-slate-500">Исполнитель</p>
                      <p className="font-medium text-white">
                        {task.assignedTo.firstName} {task.assignedTo.lastName}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-500">Дата создания</p>
                    <p className="font-medium text-white">
                      {formatDateTime(task.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <div>
                    <p className="text-slate-500">Последнее обновление</p>
                    <p className="font-medium text-white">
                      {formatDateTime(task.updatedAt)}
                    </p>
                  </div>
                </div>

                {task.deadline && (
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-slate-400" />
                    <div>
                      <p className="text-slate-500">Дедлайн</p>
                      <p className="font-medium text-amber-600">
                        {formatDateTime(task.deadline)}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
