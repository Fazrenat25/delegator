'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ArrowLeft, Save } from 'lucide-react';

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
  assignedToId: string | null;
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
}

export default function EditTaskPage() {
  const router = useRouter();
  const params = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: '',
    priority: '',
    deadline: '',
    assignedToId: '',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData.success) {
          setUser(sessionData.data.user);

          // Загружаем задачу
          const taskRes = await fetch(`/api/tasks?id=${params.id}`);
          const taskData = await taskRes.json();
          if (taskData.success && taskData.data) {
            setTask(taskData.data);
            setFormData({
              title: taskData.data.title,
              description: taskData.data.description,
              status: taskData.data.status,
              priority: taskData.data.priority,
              deadline: taskData.data.deadline ? new Date(taskData.data.deadline).toISOString().slice(0, 16) : '',
              assignedToId: taskData.data.assignedToId || '',
            });
          }

          // Загружаем сотрудников
          const employeesRes = await fetch('/api/employees');
          const employeesData = await employeesRes.json();
          if (employeesData.success) {
            setEmployees(employeesData.data || []);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch(`/api/tasks?id=${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          deadline: formData.deadline || null,
          assignedToId: formData.assignedToId || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/dashboard/tasks');
      } else {
        alert(data.error || 'Ошибка обновления задачи');
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Ошибка обновления задачи');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !user || !task) {
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
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft size={16} className="mr-2" />
            Назад
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Редактировать задачу</h1>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Изменение задачи</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Название задачи"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Описание
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Подробное описание задачи..."
                  rows={5}
                  className="w-full px-4 py-2.5 text-slate-900 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-200 focus:border-slate-500 transition-all resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Select
                  label="Статус"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={[
                    { value: 'PENDING', label: 'Ожидает' },
                    { value: 'IN_PROGRESS', label: 'В работе' },
                    { value: 'COMPLETED', label: 'Выполнена' },
                    { value: 'CANCELLED', label: 'Отменена' },
                  ]}
                />

                <Select
                  label="Приоритет"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  options={[
                    { value: 'LOW', label: 'Низкий' },
                    { value: 'MEDIUM', label: 'Средний' },
                    { value: 'HIGH', label: 'Высокий' },
                    { value: 'URGENT', label: 'Срочно' },
                  ]}
                />

                <Input
                  label="Дедлайн (дата и время)"
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <Select
                label="Исполнитель"
                value={formData.assignedToId}
                onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
                options={[
                  { value: '', label: 'Не назначен' },
                  ...employees.map(emp => ({
                    value: emp.id,
                    label: `${emp.firstName} ${emp.lastName}`,
                  })),
                ]}
              />

              <div className="flex items-center gap-3 pt-4">
                <Button
                  type="submit"
                  variant="primary"
                  className="flex-1"
                  disabled={submitting}
                >
                  <Save size={18} className="mr-2" />
                  {submitting ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Отмена
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
