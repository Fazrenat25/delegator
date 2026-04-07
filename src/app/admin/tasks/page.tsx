'use client';

import { useEffect, useState } from 'react';
import {
  CheckSquare,
  Search,
  Filter,
  X,
  Trash2,
  Calendar,
  User,
  Building,
  ChevronDown,
  ChevronRight,
  FolderOpen,
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  deadline: string | null;
  createdAt: string;
  company: {
    id: string;
    name: string;
    plan: string;
    planActive: boolean;
    planEndDate?: string | null;
  };
  createdBy: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  };
  assignedTo: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface CompanyGroup {
  companyId: string;
  companyName: string;
  companyPlan: string;
  companyPlanActive: boolean;
  tasks: Task[];
}

export default function AdminTasksPage() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());
  const [searchCompany, setSearchCompany] = useState('');

  useEffect(() => {
    loadTasks();
  }, [statusFilter, priorityFilter]);

  const loadTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);
      if (priorityFilter) params.set('priority', priorityFilter);

      const response = await fetch(`/api/admin/tasks?${params}`);
      const data = await response.json();

      if (data.success) {
        setTasks(data.data.tasks);
        // Разворачиваем все компании по умолчанию при первой загрузке
        const companies = new Set<string>(data.data.tasks.map((t: Task) => t.company.id));
        setExpandedCompanies(companies);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/admin/tasks?taskId=${taskId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        loadTasks();
      }
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleCompany = (companyId: string) => {
    setExpandedCompanies(prev => {
      const next = new Set(prev);
      if (next.has(companyId)) {
        next.delete(companyId);
      } else {
        next.add(companyId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const companies = new Set(tasks.map(t => t.company.id));
    setExpandedCompanies(companies);
  };

  const collapseAll = () => {
    setExpandedCompanies(new Set());
  };

  // Группировка задач по компаниям с информацией о тарифе
  const groupedTasks: CompanyGroup[] = (() => {
    const groups = new Map<string, CompanyGroup>();
    
    tasks.forEach(task => {
      const plan = task.company.plan || 'FREE';
      const isActive = task.company.planActive ?? true;

      if (!groups.has(task.company.id)) {
        groups.set(task.company.id, {
          companyId: task.company.id,
          companyName: task.company.name,
          companyPlan: plan,
          companyPlanActive: isActive,
          tasks: [],
        });
      }
      groups.get(task.company.id)!.tasks.push(task);
    });

    return Array.from(groups.values()).sort((a, b) => 
      a.companyName.localeCompare(b.companyName)
    );
  })();

  // Фильтрация компаний по поиску
  const filteredGroups = searchCompany
    ? groupedTasks.filter(g => 
        g.companyName.toLowerCase().includes(searchCompany.toLowerCase())
      )
    : groupedTasks;

  const statusColors: Record<string, string> = {
    PENDING: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    CANCELLED: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  const priorityColors: Record<string, string> = {
    LOW: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    MEDIUM: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    HIGH: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    URGENT: 'bg-red-500/10 text-red-400 border-red-500/30',
  };

  const statusLabels: Record<string, string> = {
    PENDING: 'Ожидает',
    IN_PROGRESS: 'В работе',
    COMPLETED: 'Завершено',
    CANCELLED: 'Отменено',
  };

  const priorityLabels: Record<string, string> = {
    LOW: 'Низкий',
    MEDIUM: 'Средний',
    HIGH: 'Высокий',
    URGENT: 'Срочно',
  };

  const planColors: Record<string, string> = {
    FREE: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    TEAM: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    BUSINESS: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  };

  const planLabels: Record<string, string> = {
    FREE: 'FREE',
    TEAM: 'TEAM',
    BUSINESS: 'BUSINESS',
  };

  // Подсчёт статистики по всем задачам
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    cancelled: tasks.filter(t => t.status === 'CANCELLED').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Все задачи</h1>
          <p className="text-slate-400">Просмотр и управление задачами по компаниям</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
          >
            <ChevronDown className="w-4 h-4" />
            Развернуть все
          </button>
          <button
            onClick={collapseAll}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
          >
            <ChevronRight className="w-4 h-4" />
            Свернуть все
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={searchCompany}
            onChange={(e) => setSearchCompany(e.target.value)}
            placeholder="Поиск компании..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          />
          {searchCompany && (
            <button
              onClick={() => setSearchCompany('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="">Все статусы</option>
            <option value="PENDING">Ожидает</option>
            <option value="IN_PROGRESS">В работе</option>
            <option value="COMPLETED">Завершено</option>
            <option value="CANCELLED">Отменено</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/50"
          >
            <option value="">Все приоритеты</option>
            <option value="LOW">Низкий</option>
            <option value="MEDIUM">Средний</option>
            <option value="HIGH">Высокий</option>
            <option value="URGENT">Срочно</option>
          </select>
        </div>
        {(statusFilter || priorityFilter || searchCompany) && (
          <button
            onClick={() => {
              setStatusFilter('');
              setPriorityFilter('');
              setSearchCompany('');
            }}
            className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Сбросить
          </button>
        )}
      </div>

      {/* Stats */}
      {!loading && tasks.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="rounded-xl border border-slate-700 bg-slate-800/30 backdrop-blur-sm p-4 text-center">
            <p className="text-2xl font-bold text-white mb-1">{stats.total}</p>
            <p className="text-xs font-medium text-slate-400">Всего</p>
          </div>
          {['PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => {
            const count = tasks.filter((t) => t.status === status).length;
            return (
              <div
                key={status}
                className={`rounded-xl border ${statusColors[status]} backdrop-blur-sm p-4 text-center`}
              >
                <p className="text-2xl font-bold text-white mb-1">{count}</p>
                <p className="text-xs font-medium">{statusLabels[status]}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Companies Groups */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              Загрузка...
            </div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>{searchCompany ? 'Компании не найдены' : 'Задачи не найдены'}</p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isExpanded = expandedCompanies.has(group.companyId);
            const companyStats = {
              total: group.tasks.length,
              pending: group.tasks.filter(t => t.status === 'PENDING').length,
              inProgress: group.tasks.filter(t => t.status === 'IN_PROGRESS').length,
              completed: group.tasks.filter(t => t.status === 'COMPLETED').length,
            };

            return (
              <div
                key={group.companyId}
                className="rounded-2xl border border-slate-800 bg-slate-800/20 backdrop-blur-sm overflow-hidden"
              >
                {/* Company Header */}
                <button
                  onClick={() => toggleCompany(group.companyId)}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-800/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-white">{group.companyName}</h3>
                        <span
                          className={`px-2 py-1 rounded-lg border text-xs font-semibold ${
                            planColors[group.companyPlan]
                          }`}
                        >
                          {planLabels[group.companyPlan]}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">
                        {group.tasks.length} задач
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {/* Mini stats */}
                    <div className="hidden md:flex items-center gap-3 mr-4">
                      <span className="px-2 py-1 rounded-lg bg-slate-700 text-xs text-slate-300">
                        {companyStats.pending} ожидает
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-xs text-blue-400">
                        {companyStats.inProgress} в работе
                      </span>
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-xs text-emerald-400">
                        {companyStats.completed} завершено
                      </span>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>
                </button>

                {/* Tasks List */}
                {isExpanded && (
                  <div className="border-t border-slate-800 p-4 space-y-3 bg-slate-900/30">
                    {group.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-xl border border-slate-800 bg-slate-800/50 p-5 hover:border-slate-700 transition-all"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <h4 className="text-lg font-bold text-white">{task.title}</h4>
                              <span
                                className={`px-2 py-1 rounded-lg border text-xs font-semibold ${
                                  statusColors[task.status]
                                }`}
                              >
                                {statusLabels[task.status]}
                              </span>
                              <span
                                className={`px-2 py-1 rounded-lg border text-xs font-semibold ${
                                  priorityColors[task.priority]
                                }`}
                              >
                                {priorityLabels[task.priority]}
                              </span>
                            </div>

                            <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                              {task.description}
                            </p>

                            <div className="flex flex-wrap items-center gap-4 text-sm">
                              <div className="flex items-center gap-2 text-slate-400">
                                <User className="w-4 h-4" />
                                <span>Создал:</span>
                                <span className="text-white font-medium">
                                  {task.createdBy.firstName} {task.createdBy.lastName}
                                </span>
                              </div>
                              {task.assignedTo && (
                                <div className="flex items-center gap-2 text-slate-400">
                                  <User className="w-4 h-4" />
                                  <span>Исполнитель:</span>
                                  <span className="text-white font-medium">
                                    {task.assignedTo.firstName} {task.assignedTo.lastName}
                                  </span>
                                </div>
                              )}
                              {task.deadline && (
                                <div className="flex items-center gap-2 text-slate-400">
                                  <Calendar className="w-4 h-4" />
                                  <span>Дедлайн:</span>
                                  <span
                                    className={
                                      new Date(task.deadline) < new Date()
                                        ? 'text-red-400 font-semibold'
                                        : 'text-white font-medium'
                                    }
                                  >
                                    {new Date(task.deadline).toLocaleDateString('ru-RU', {
                                      day: 'numeric',
                                      month: 'long',
                                      year: 'numeric',
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {deleteConfirm === task.id ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleDelete(task.id)}
                                  className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                  Да
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                  Нет
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(task.id)}
                                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors group"
                                title="Удалить"
                              >
                                <Trash2 className="w-4 h-4 text-red-400 group-hover:text-red-300" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
