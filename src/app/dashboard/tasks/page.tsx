'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { getPriorityColor, getStatusColor, formatDate, formatDateTime } from '@/lib/utils';
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react';
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
    email: string;
  } | null;
  createdBy: {
    firstName: string;
    lastName: string;
  };
}

interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function TasksPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    deadline: '',
    assignedToId: '',
  });

  // Обработчики для кнопок задач
  const handleViewTask = (taskId: string) => {
    router.push(`/dashboard/tasks/${taskId}`);
  };

  const handleEditTask = (taskId: string) => {
    router.push(`/dashboard/tasks/${taskId}/edit`);
  };

  const handleDeleteTask = async (taskId: string, taskTitle: string) => {
    if (!confirm(`Вы уверены, что хотите удалить задачу "${taskTitle}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        alert(data.error || 'Ошибка удаления задачи');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Ошибка удаления задачи');
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [sessionRes, tasksRes] = await Promise.all([
          fetch('/api/auth/session'),
          fetch('/api/tasks'),
        ]);

        const sessionData = await sessionRes.json();
        const tasksData = await tasksRes.json();

        if (sessionData.success) {
          setUser(sessionData.data.user);
          setTasks(tasksData.data || []);

          // Load employees if director
          if (sessionData.data.user.role === 'DIRECTOR') {
            const employeesRes = await fetch('/api/employees');
            const employeesData = await employeesRes.json();
            if (employeesData.success) {
              setEmployees(employeesData.data || []);
            }
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

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTask,
          deadline: newTask.deadline || null,
          assignedToId: newTask.assignedToId || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTasks([data.data, ...tasks]);
        setShowCreateModal(false);
        setNewTask({
          title: '',
          description: '',
          priority: 'MEDIUM',
          deadline: '',
          assignedToId: '',
        });
      } else {
        alert(data.error || 'Ошибка создания задачи');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Ошибка создания задачи');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || task.status === statusFilter;
    const matchesPriority = !priorityFilter || task.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Задачи</h1>
            <p className="text-sm sm:text-base text-slate-500">Управление и распределение задач</p>
          </div>
          {user.role === 'DIRECTOR' && (
            <Button onClick={() => setShowCreateModal(true)} variant="primary">
              <Plus size={20} className="mr-2" />
              Создать задачу
            </Button>
          )}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <Input
                    placeholder="Поиск задач..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={[
                  { value: '', label: 'Все статусы' },
                  { value: 'PENDING', label: 'Ожидает' },
                  { value: 'IN_PROGRESS', label: 'В работе' },
                  { value: 'COMPLETED', label: 'Завершено' },
                  { value: 'CANCELLED', label: 'Отменено' },
                ]}
              />
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                options={[
                  { value: '', label: 'Все приоритеты' },
                  { value: 'LOW', label: 'Низкий' },
                  { value: 'MEDIUM', label: 'Средний' },
                  { value: 'HIGH', label: 'Высокий' },
                  { value: 'URGENT', label: 'Срочно' },
                ]}
              />
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
                    className="p-4 sm:p-5 bg-slate-800/40 rounded-xl border border-slate-700/30 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
                  >
                    {/* Mobile: Stack vertically, Desktop: Side by side */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Title and Priority */}
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="text-base sm:text-lg font-semibold text-white break-words">{task.title}</h3>
                          <Badge
                            variant={task.priority === 'URGENT' ? 'danger' : task.priority === 'HIGH' ? 'warning' : 'info'}
                            size="sm"
                          >
                            {getPriorityLabel(task.priority)}
                          </Badge>
                        </div>

                        {/* Description */}
                        <p className="text-sm sm:text-base text-slate-400 mb-3 break-words">{task.description}</p>

                        {/* Info - Stack on mobile */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-slate-500">
                          <span className="break-words">
                            <strong>Создатель:</strong> {task.createdBy.firstName} {task.createdBy.lastName}
                          </span>
                          {task.assignedTo && (
                            <span className="break-words">
                              <strong>Исполнитель:</strong> {task.assignedTo.firstName} {task.assignedTo.lastName}
                            </span>
                          )}
                          {task.deadline && (
                            <span className="break-words">
                              <strong>Срок:</strong> {formatDate(task.deadline)}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Status and Actions */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 sm:gap-2 shrink-0">
                        <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium border whitespace-nowrap ${getStatusColor(task.status)}`}>
                          {getStatusLabel(task.status)}
                        </span>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handleViewTask(task.id)}
                            className="p-1.5 sm:p-2 text-slate-400 hover:text-blue-600 transition-colors"
                            title="Просмотр"
                          >
                            <Eye size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </button>
                          {user.role === 'DIRECTOR' && (
                            <>
                              <button
                                onClick={() => handleEditTask(task.id)}
                                className="p-1.5 sm:p-2 text-slate-400 hover:text-emerald-400 transition-colors"
                                title="Редактировать"
                              >
                                <Edit size={16} className="sm:w-[18px] sm:h-[18px]" />
                              </button>
                              <button
                                onClick={() => handleDeleteTask(task.id, task.title)}
                                className="p-1.5 sm:p-2 text-slate-400 hover:text-red-600 transition-colors"
                                title="Удалить"
                              >
                                <Trash2 size={16} className="sm:w-[18px] sm:h-[18px]" />
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Создать новую задачу</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTask} className="space-y-5">
                <Input
                  label="Название задачи"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                />
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Описание
                  </label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2.5 text-white bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Приоритет"
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    options={[
                      { value: 'LOW', label: 'Низкий' },
                      { value: 'MEDIUM', label: 'Средний' },
                      { value: 'HIGH', label: 'Высокий' },
                      { value: 'URGENT', label: 'Срочно' },
                    ]}
                  />
                  <Input
                    label="Срок исполнения (дата и время)"
                    type="datetime-local"
                    value={newTask.deadline}
                    onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                  />
                </div>
                {employees.length > 0 && (
                  <Select
                    label="Назначить исполнителя (опционально)"
                    value={newTask.assignedToId}
                    onChange={(e) => setNewTask({ ...newTask, assignedToId: e.target.value })}
                    options={[
                      { value: '', label: 'Не назначено' },
                      ...employees.map((emp) => ({
                        value: emp.id,
                        label: `${emp.firstName} ${emp.lastName}${emp.email ? ` (${emp.email})` : ''}`,
                      })),
                    ]}
                  />
                )}
                <div className="flex items-center gap-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    Создать задачу
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowCreateModal(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </DashboardLayout>
  );
}
