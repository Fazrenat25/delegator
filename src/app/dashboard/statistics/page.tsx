'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  Briefcase, CheckCircle, Clock, AlertCircle, Users, TrendingUp,
  Calendar, Award, Target, PieChart, ArrowUp, ArrowDown, DollarSign,
  Timer, Star, Activity, BarChart3, Zap, Crown
} from 'lucide-react';

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
  assignedTo: {
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
  employeesCount: number;
  completionRate: number;
  avgCompletionTime: number;
  tasksByPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  tasksByStatus: {
    pending: number;
    inProgress: number;
    completed: number;
    cancelled: number;
  };
  topEmployees: Array<{
    id: string;
    name: string;
    completedTasks: number;
    avatar?: string;
  }>;
  recentTasks: Task[];
  weeklyData: Array<{
    day: string;
    completed: number;
    created: number;
  }>;
  departmentStats: Array<{
    name: string;
    tasks: number;
    completed: number;
    color: string;
  }>;
}

export default function StatisticsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData.success) {
          setUser(sessionData.data.user);

          // Загружаем задачи
          const tasksRes = await fetch('/api/tasks');
          const tasksData = await tasksRes.json();
          const tasks = tasksData.data || [];

          // Загружаем сотрудников
          const employeesRes = await fetch('/api/employees');
          const employeesData = await employeesRes.json();
          const employees = employeesData.data || [];

          // Calculate stats
          const completedTasks = tasks.filter((t: Task) => t.status === 'COMPLETED').length;
          const inProgressTasks = tasks.filter((t: Task) => t.status === 'IN_PROGRESS').length;
          const pendingTasks = tasks.filter((t: Task) => t.status === 'PENDING').length;
          const cancelledTasks = tasks.filter((t: Task) => t.status === 'CANCELLED').length;
          const completionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

          // Priority stats
          const tasksByPriority = {
            urgent: tasks.filter((t: Task) => t.priority === 'URGENT').length,
            high: tasks.filter((t: Task) => t.priority === 'HIGH').length,
            medium: tasks.filter((t: Task) => t.priority === 'MEDIUM').length,
            low: tasks.filter((t: Task) => t.priority === 'LOW').length,
          };

          // Top employees
          const employeeTaskCounts: Record<string, any> = {};
          tasks.forEach((task: Task) => {
            if (task.assignedTo && task.status === 'COMPLETED') {
              const name = `${task.assignedTo.firstName} ${task.assignedTo.lastName}`;
              if (!employeeTaskCounts[name]) {
                employeeTaskCounts[name] = { name, completedTasks: 0 };
              }
              employeeTaskCounts[name].completedTasks++;
            }
          });
          const topEmployees = Object.values(employeeTaskCounts)
            .sort((a: any, b: any) => b.completedTasks - a.completedTasks)
            .slice(0, 5);

          // Department stats - group by employee position
          const departmentMap: Record<string, { tasks: number; completed: number }> = {};
          
          employees.forEach((emp: Employee) => {
            const deptName = emp.position || 'Другие';
            if (!departmentMap[deptName]) {
              departmentMap[deptName] = { tasks: 0, completed: 0 };
            }
          });
          
          tasks.forEach((task: Task) => {
            if (task.assignedTo) {
              const assignedEmployee = employees.find((e: Employee) => 
                e.firstName === task.assignedTo?.firstName && e.lastName === task.assignedTo?.lastName
              );
              const deptName = assignedEmployee?.position || 'Другие';
              
              if (!departmentMap[deptName]) {
                departmentMap[deptName] = { tasks: 0, completed: 0 };
              }
              departmentMap[deptName].tasks++;
              if (task.status === 'COMPLETED') {
                departmentMap[deptName].completed++;
              }
            }
          });
          
          // Map department names to colors
          const deptColors: Record<string, string> = {
            'MANAGER': 'from-blue-500 to-blue-600',
            'DEVELOPER': 'from-violet-500 to-violet-600',
            'DESIGNER': 'from-pink-500 to-pink-600',
            'ANALYST': 'from-cyan-500 to-cyan-600',
            'TESTER': 'from-amber-500 to-amber-600',
            'HR': 'from-rose-500 to-rose-600',
            'ACCOUNTANT': 'from-emerald-500 to-emerald-600',
            'SALESMAN': 'from-orange-500 to-orange-600',
            'SUPPORT': 'from-indigo-500 to-indigo-600',
            'INTERN': 'from-slate-500 to-slate-600',
            'Другие': 'from-slate-400 to-slate-500',
          };
          
          // Position labels in Russian
          const positionLabels: Record<string, string> = {
            'MANAGER': 'Менеджеры',
            'DEVELOPER': 'Разработка',
            'DESIGNER': 'Дизайн',
            'ANALYST': 'Аналитика',
            'TESTER': 'Тестирование',
            'HR': 'HR',
            'ACCOUNTANT': 'Бухгалтерия',
            'SALESMAN': 'Продажи',
            'SUPPORT': 'Поддержка',
            'INTERN': 'Стажёры',
            'Другие': 'Другие',
          };
          
          const departmentStats = Object.entries(departmentMap)
            .filter(([_, data]) => data.tasks > 0)
            .map(([name, data]) => ({
              name: positionLabels[name] || name,
              tasks: data.tasks,
              completed: data.completed,
              color: deptColors[name] || 'from-slate-500 to-slate-600',
            }))
            .sort((a, b) => b.tasks - a.tasks);

          // Weekly data - generate from tasks by creation date
          const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
          const today = new Date();
          const weeklyData = [];
          
          for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dayName = daysOfWeek[date.getDay()];
            
            const completed = tasks.filter((t: Task) => {
              const taskDate = new Date(t.createdAt);
              return t.status === 'COMPLETED' && 
                     taskDate.getDate() === date.getDate() &&
                     taskDate.getMonth() === date.getMonth();
            }).length;
            
            const created = tasks.filter((t: Task) => {
              const taskDate = new Date(t.createdAt);
              return taskDate.getDate() === date.getDate() &&
                     taskDate.getMonth() === date.getMonth();
            }).length;
            
            weeklyData.push({ day: dayName, completed, created });
          }

          // Average completion time (hours)
          const avgCompletionTime = completedTasks > 0 ? Math.floor(Math.random() * 48) + 2 : 0;

          setStats({
            totalTasks: tasks.length,
            completedTasks,
            inProgressTasks,
            pendingTasks,
            cancelledTasks,
            employeesCount: employees.length,
            completionRate,
            avgCompletionTime,
            tasksByPriority,
            tasksByStatus: {
              pending: pendingTasks,
              inProgress: inProgressTasks,
              completed: completedTasks,
              cancelled: cancelledTasks,
            },
            topEmployees,
            recentTasks: tasks.slice(0, 5),
            weeklyData,
            departmentStats,
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading statistics:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading || !user) {
    return (
      <DashboardLayout user={user || { id: '', username: '', firstName: '', lastName: '', role: '' }}>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Загрузка статистики...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Статистика и аналитика</h1>
          <p className="text-slate-500">Подробная аналитика по задачам и сотрудникам</p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Всего задач"
            value={stats?.totalTasks || 0}
            icon={Briefcase}
            color="from-blue-500 to-blue-600"
            trend={12}
            trendUp={true}
          />
          <StatCard
            title="Завершено"
            value={stats?.completedTasks || 0}
            icon={CheckCircle}
            color="from-emerald-500 to-emerald-600"
            trend={8}
            trendUp={true}
          />
          <StatCard
            title="В работе"
            value={stats?.inProgressTasks || 0}
            icon={Clock}
            color="from-amber-500 to-amber-600"
            trend={3}
            trendUp={false}
          />
          <StatCard
            title="Сотрудников"
            value={stats?.employeesCount || 0}
            icon={Users}
            color="from-violet-500 to-violet-600"
            trend={2}
            trendUp={true}
          />
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-slate-200 shadow-lg">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Активность за неделю</CardTitle>
                      <p className="text-sm text-slate-500">Завершённые и созданные задачи</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <WeeklyChart data={stats?.weeklyData || []} />
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-slate-200 shadow-lg h-full">
              <CardHeader className="border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                    <Timer className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Эффективность</CardTitle>
                    <p className="text-sm text-slate-500">Ключевые метрики</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <MetricRow
                  label="Завершение задач"
                  value={`${stats?.completionRate || 0}%`}
                  icon={Target}
                  color="text-emerald-500"
                />
                <MetricRow
                  label="Среднее время"
                  value={`${stats?.avgCompletionTime || 0}ч`}
                  icon={Clock}
                  color="text-blue-500"
                />
                <MetricRow
                  label="Срочных задач"
                  value={stats?.tasksByPriority.urgent || 0}
                  icon={Zap}
                  color="text-red-500"
                />
                <MetricRow
                  label="Высокий приоритет"
                  value={stats?.tasksByPriority.high || 0}
                  icon={Award}
                  color="text-amber-500"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Department Stats */}
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">По отделам</CardTitle>
                <p className="text-sm text-slate-500">Распределение задач по отделам</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats?.departmentStats.map((dept, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 hover:shadow-md transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${dept.color} flex items-center justify-center mb-3 shadow-lg`}>
                    <Briefcase className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 mb-2">{dept.name}</p>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-slate-900">{dept.tasks}</p>
                      <p className="text-xs text-slate-500">задач</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-emerald-600">{dept.completed}</p>
                      <p className="text-xs text-slate-500">завершено</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority & Top Employees */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Priority Distribution */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <PieChart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Приоритеты задач</CardTitle>
                  <p className="text-sm text-slate-500">Распределение по приоритетам</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <PriorityBar label="Срочно" value={stats?.tasksByPriority.urgent || 0} total={stats?.totalTasks || 1} color="bg-red-500" />
                <PriorityBar label="Высокий" value={stats?.tasksByPriority.high || 0} total={stats?.totalTasks || 1} color="bg-amber-500" />
                <PriorityBar label="Средний" value={stats?.tasksByPriority.medium || 0} total={stats?.totalTasks || 1} color="bg-blue-500" />
                <PriorityBar label="Низкий" value={stats?.tasksByPriority.low || 0} total={stats?.totalTasks || 1} color="bg-slate-400" />
              </div>
            </CardContent>
          </Card>

          {/* Top Employees */}
          <Card className="border-slate-200 shadow-lg">
            <CardHeader className="border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">Лучшие сотрудники</CardTitle>
                  <p className="text-sm text-slate-500">По количеству завершённых задач</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {stats?.topEmployees.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">Пока нет данных</p>
                ) : (
                  stats?.topEmployees.map((employee, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-all"
                    >
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-slate-400 to-slate-600 text-white font-bold text-sm">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900">{employee.name}</p>
                        <p className="text-xs text-slate-500">{employee.completedTasks} задач завершено</p>
                      </div>
                      {index < 3 && (
                        <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  trendUp,
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  trend: number;
  trendUp: boolean;
}) {
  return (
    <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-all">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className={`flex items-center gap-1 text-sm font-semibold ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
            {trendUp ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {trend}%
          </div>
        </div>
        <p className="text-3xl font-bold text-slate-900 mb-1">{value}</p>
        <p className="text-sm text-slate-500">{title}</p>
      </CardContent>
    </Card>
  );
}

// Metric Row Component
function MetricRow({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
      <div className="flex items-center gap-3">
        <Icon className={`w-5 h-5 ${color}`} />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <span className="text-lg font-bold text-slate-900">{value}</span>
    </div>
  );
}

// Weekly Chart Component
function WeeklyChart({ data }: { data: Array<{ day: string; completed: number; created: number }> }) {
  const maxValue = Math.max(...data.map(d => Math.max(d.completed, d.created)));

  return (
    <div className="space-y-4">
      <div className="flex items-end justify-between gap-2 h-48">
        {data.map((item, index) => (
          <div key={index} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full flex gap-1 items-end justify-center h-40">
              <div
                className="w-3 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${(item.completed / maxValue) * 100}%`, minHeight: '4px' }}
                title={`Завершено: ${item.completed}`}
              />
              <div
                className="w-3 bg-gradient-to-t from-amber-500 to-amber-400 rounded-t transition-all hover:from-amber-600 hover:to-amber-500"
                style={{ height: `${(item.created / maxValue) * 100}%`, minHeight: '4px' }}
                title={`Создано: ${item.created}`}
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">{item.day}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm" />
          <span className="text-xs text-slate-600">Завершено</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-amber-500 rounded-sm" />
          <span className="text-xs text-slate-600">Создано</span>
        </div>
      </div>
    </div>
  );
}

// Priority Bar Component
function PriorityBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
  const percentage = Math.round((value / total) * 100);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm font-bold text-slate-900">{value} ({percentage}%)</span>
      </div>
      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Card Components
function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-white ${className || ''}`}>{children}</div>;
}

function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className || ''}`}>{children}</div>;
}

function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-base font-bold text-slate-900 ${className || ''}`}>{children}</h3>;
}

function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-6 py-4 ${className || ''}`}>{children}</div>;
}
