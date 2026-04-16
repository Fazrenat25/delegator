'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Search, UserPlus, Trash2, Edit, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { Select } from '@/components/ui/Select';
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

interface Employee {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  position?: string | null;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  assignedToId: string | null;
}

export default function EmployeesPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [employeeTasks, setEmployeeTasks] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [newEmployee, setNewEmployee] = useState({
    firstName: '',
    lastName: '',
    password: '',
    position: 'MANAGER',
  });

  const [editEmployeeData, setEditEmployeeData] = useState({
    firstName: '',
    lastName: '',
    position: 'MANAGER',
  });

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData.success) {
          setUser(sessionData.data.user);

          const employeesRes = await fetch('/api/employees');
          const employeesData = await employeesRes.json();
          if (employeesData.success) {
            const employeesList = employeesData.data || [];
            setEmployees(employeesList);

            // Загружаем задачи для каждого сотрудника
            const tasksPromises = employeesList.map(async (employee: Employee) => {
              const tasksRes = await fetch(`/api/tasks?assignedTo=${employee.id}`);
              const tasksData = await tasksRes.json();
              if (tasksData.success) {
                return { employeeId: employee.id, tasks: tasksData.data || [] };
              }
              return { employeeId: employee.id, tasks: [] };
            });

            const tasksResults = await Promise.all(tasksPromises);
            const tasksMap: Record<string, Task[]> = {};
            tasksResults.forEach(({ employeeId, tasks }) => {
              tasksMap[employeeId] = tasks;
            });
            setEmployeeTasks(tasksMap);
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading employees:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  // Определение статуса занятости сотрудника
  const getEmployeeStatus = (employeeId: string) => {
    const tasks = employeeTasks[employeeId] || [];
    const activeTask = tasks.find(task => task.status === 'IN_PROGRESS');
    
    if (activeTask) {
      return { status: 'busy' as const, task: activeTask };
    }
    return { status: 'idle' as const, task: null };
  };

  // Клик по статусу сотрудника
  const handleStatusClick = (employee: Employee) => {
    const { status, task } = getEmployeeStatus(employee.id);
    
    if (status === 'busy' && task) {
      // Переход к задаче
      router.push(`/dashboard/tasks/${task.id}`);
    } else {
      // Создание новой задачи для сотрудника
      router.push(`/dashboard/tasks/new?assignedTo=${employee.id}`);
    }
  };

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    // Генерируем логин из имени и фамилии (транслит)
    const generateUsername = (firstName: string, lastName: string) => {
      const translit: Record<string, string> = {
        'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
        'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
        'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
        'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
        'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
        'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
        'э': 'e', 'ю': 'yu', 'я': 'ya'
      };
      
      const transliterate = (str: string) => 
        str.toLowerCase().split('').map(c => translit[c] || c).join('');
      
      const first = transliterate(firstName).replace(/[^a-z]/g, '');
      const last = transliterate(lastName).replace(/[^a-z]/g, '');
      
      return `${last}_${first}`;
    };

    const username = generateUsername(newEmployee.firstName, newEmployee.lastName);

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password: newEmployee.password,
          firstName: newEmployee.firstName,
          lastName: newEmployee.lastName,
          position: newEmployee.position,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEmployees([data.data, ...employees]);
        setShowAddModal(false);
        setNewEmployee({
          firstName: '',
          lastName: '',
          password: '',
          position: 'MANAGER',
        });
      } else {
        alert(data.error || 'Ошибка добавления сотрудника');
      }
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Ошибка добавления сотрудника');
    }
  };

  const handleDeleteEmployee = async (id: string, username: string) => {
    if (!confirm(`Вы уверены, что хотите удалить сотрудника ${username}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/employees?id=${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setEmployees(employees.filter(emp => emp.id !== id));
      } else {
        alert(data.error || 'Ошибка удаления сотрудника');
      }
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Ошибка удаления сотрудника');
    }
  };

  const handleEditClick = (employee: Employee) => {
    setEditingEmployee(employee);
    setEditEmployeeData({
      firstName: employee.firstName,
      lastName: employee.lastName,
      position: employee.position || 'MANAGER',
    });
    setShowEditModal(true);
  };

  const handleEditEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingEmployee) return;

    try {
      const response = await fetch(`/api/employees?id=${editingEmployee.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: editEmployeeData.firstName,
          lastName: editEmployeeData.lastName,
          position: editEmployeeData.position,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setEmployees(employees.map(emp =>
          emp.id === editingEmployee.id ? { ...emp, ...data.data } : emp
        ));
        setShowEditModal(false);
        setEditingEmployee(null);
      } else {
        alert(data.error || 'Ошибка обновления сотрудника');
      }
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Ошибка обновления сотрудника');
    }
  };

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Сотрудники</h1>
            <p className="text-sm sm:text-base text-slate-500">Управление командой вашей компании</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} variant="primary">
            <Plus size={20} className="mr-2" />
            Добавить сотрудника
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Всего сотрудников</p>
                  <p className="text-3xl font-bold text-white">{employees.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <UserPlus className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Активных</p>
                  <p className="text-3xl font-bold text-emerald-600">{employees.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-400 mb-1">Новых за месяц</p>
                  <p className="text-3xl font-bold text-amber-600">
                    {employees.filter(e => new Date(e.createdAt).getMonth() === new Date().getMonth()).length}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <Input
                placeholder="Поиск сотрудников..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Employees List */}
        <Card>
          <CardHeader>
            <CardTitle>
              Команда ({filteredEmployees.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredEmployees.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Сотрудники не найдены</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEmployees.map((employee) => (
                  <div
                    key={employee.id}
                    className="p-5 bg-slate-50 rounded-xl border border-slate-700/50 hover:border-slate-600 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-semibold">
                          {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">
                            {employee.firstName} {employee.lastName}
                          </h3>
                          <Badge variant="default" size="sm">{getPositionLabel(employee.position)}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Статус занятости - кликабельный */}
                    <button
                      onClick={() => handleStatusClick(employee)}
                      className="w-full mb-4 p-3 rounded-lg border transition-all duration-200 hover:shadow-md group"
                    >
                      {(() => {
                        const { status, task } = getEmployeeStatus(employee.id);
                        if (status === 'busy') {
                          return (
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
                                <div className="absolute inset-0 w-3 h-3 rounded-full bg-amber-500 animate-ping opacity-75"></div>
                              </div>
                              <div className="flex-1 text-left">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-semibold text-amber-700">Занят</p>
                                  <ArrowRight className="w-3 h-3 text-amber-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <p className="text-xs text-amber-600 truncate" title={task?.title}>
                                  {task?.title}
                                </p>
                              </div>
                            </div>
                          );
                        }
                        return (
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                            <div className="flex-1 text-left">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-emerald-700">Простаивает</p>
                                <Plus className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                              </div>
                              <p className="text-xs text-emerald-600">Нажмите, чтобы создать задачу</p>
                            </div>
                          </div>
                        );
                      })()}
                    </button>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {employee.username}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Добавлен: {formatDate(employee.createdAt)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/employees/${employee.id}/statistics`}>
                        <Button variant="outline" size="sm" className="flex-1">
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Статистика
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditClick(employee)}>
                        <Edit size={16} className="mr-1" />
                        Изменить
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteEmployee(employee.id, employee.username)}>
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-md my-8">
            <CardHeader>
              <CardTitle>Добавить сотрудника</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddEmployee} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Имя"
                    value={newEmployee.firstName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Фамилия"
                    value={newEmployee.lastName}
                    onChange={(e) => setNewEmployee({ ...newEmployee, lastName: e.target.value })}
                    required
                  />
                </div>
                <Select
                  label="Должность"
                  value={newEmployee.position}
                  onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                  options={[
                    { value: 'MANAGER', label: 'Менеджер' },
                    { value: 'DEVELOPER', label: 'Разработчик' },
                    { value: 'DESIGNER', label: 'Дизайнер' },
                    { value: 'ANALYST', label: 'Аналитик' },
                    { value: 'TESTER', label: 'Тестировщик' },
                    { value: 'HR', label: 'HR-специалист' },
                    { value: 'ACCOUNTANT', label: 'Бухгалтер' },
                    { value: 'SALESMAN', label: 'Менеджер по продажам' },
                    { value: 'SUPPORT', label: 'Специалист поддержки' },
                    { value: 'INTERN', label: 'Стажер' },
                  ]}
                />
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Логин
                  </label>
                  <p className="text-sm text-slate-500">
                    {newEmployee.firstName && newEmployee.lastName ? (
                      <span className="font-mono">
                        {(() => {
                          const translit: Record<string, string> = {
                            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd',
                            'е': 'e', 'ё': 'yo', 'ж': 'zh', 'з': 'z', 'и': 'i',
                            'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n',
                            'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't',
                            'у': 'u', 'ф': 'f', 'х': 'h', 'ц': 'ts', 'ч': 'ch',
                            'ш': 'sh', 'щ': 'sch', 'ъ': '', 'ы': 'y', 'ь': '',
                            'э': 'e', 'ю': 'yu', 'я': 'ya'
                          };
                          const transliterate = (str: string) => 
                            str.toLowerCase().split('').map(c => translit[c] || c).join('');
                          const first = transliterate(newEmployee.firstName).replace(/[^a-z]/g, '');
                          const last = transliterate(newEmployee.lastName).replace(/[^a-z]/g, '');
                          return `${last}_${first}`;
                        })()}
                      </span>
                    ) : (
                      <span className="text-slate-400">Будет сформирован автоматически</span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Логин формируется из фамилии и имени</p>
                </div>
                <Input
                  label="Пароль"
                  type="password"
                  value={newEmployee.password}
                  onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  required
                  placeholder="Минимум 6 символов"
                  minLength={6}
                />
                <div className="flex items-center gap-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    <UserPlus size={18} className="mr-2" />
                    Добавить
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAddModal(false)}
                  >
                    Отмена
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Edit Employee Modal */}
      {showEditModal && editingEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <Card className="w-full max-w-md my-8">
            <CardHeader>
              <CardTitle>Редактировать сотрудника</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEditEmployee} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Имя"
                    value={editEmployeeData.firstName}
                    onChange={(e) => setEditEmployeeData({ ...editEmployeeData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Фамилия"
                    value={editEmployeeData.lastName}
                    onChange={(e) => setEditEmployeeData({ ...editEmployeeData, lastName: e.target.value })}
                    required
                  />
                </div>
                <Select
                  label="Должность"
                  value={editEmployeeData.position}
                  onChange={(e) => setEditEmployeeData({ ...editEmployeeData, position: e.target.value })}
                  options={[
                    { value: 'MANAGER', label: 'Менеджер' },
                    { value: 'DEVELOPER', label: 'Разработчик' },
                    { value: 'DESIGNER', label: 'Дизайнер' },
                    { value: 'ANALYST', label: 'Аналитик' },
                    { value: 'TESTER', label: 'Тестировщик' },
                    { value: 'HR', label: 'HR-специалист' },
                    { value: 'ACCOUNTANT', label: 'Бухгалтер' },
                    { value: 'SALESMAN', label: 'Менеджер по продажам' },
                    { value: 'SUPPORT', label: 'Специалист поддержки' },
                    { value: 'INTERN', label: 'Стажер' },
                  ]}
                />
                <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700/50">
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">
                    Логин
                  </label>
                  <p className="text-sm text-slate-400 font-mono">
                    {editingEmployee.username}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Логин нельзя изменить</p>
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <Button type="submit" variant="primary" className="flex-1">
                    <Edit size={18} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingEmployee(null);
                    }}
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
