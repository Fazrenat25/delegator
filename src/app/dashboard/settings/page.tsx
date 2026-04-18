'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Save, Lock, User, Bell, Palette, Shield, UserCircle, Mail, Hash } from 'lucide-react';

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  companyId: string | null;
}

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    taskNotifications: true,
    deadlineNotifications: true,
  });

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (sessionData.success) {
          setUser(sessionData.data.user);
          setProfileData({
            firstName: sessionData.data.user.firstName,
            lastName: sessionData.data.user.lastName,
            email: sessionData.data.user.email || '',
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (data.success) {
        // Обновляем данные пользователя
        setUser(prev => prev ? { ...prev, email: profileData.email || undefined } : null);
        alert('Профиль успешно обновлён');
      } else {
        alert(data.error || 'Ошибка обновления профиля');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Ошибка обновления профиля');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('Пароль должен быть не менее 6 символов');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/settings/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Пароль успешно изменён');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        alert(data.error || 'Ошибка изменения пароля');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Ошибка изменения пароля');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationsToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
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
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Настройки</h1>
          <p className="text-slate-500">Управление профилем и параметрами системы</p>
        </div>

        {/* Settings Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Account Info */}
          <Card className="lg:col-span-1 order-first">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Информация
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5">
                {/* Avatar + Role */}
                <div className="flex flex-col items-center p-4 bg-gradient-to-br from-slate-800/60 to-slate-800/40 rounded-xl border border-slate-700/50">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-emerald-500/25 mb-3">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <p className="font-semibold text-white text-center">
                    {user.firstName} {user.lastName}
                  </p>
                  <Badge variant={user.role === 'DIRECTOR' ? 'premium' : 'default'} size="sm" className="mt-2">
                    {user.role === 'DIRECTOR' ? 'Директор' : 'Сотрудник'}
                  </Badge>
                </div>

                {/* Info Items */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20">
                      <UserCircle className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Логин</p>
                      <p className="font-semibold text-white truncate">{user.username}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-emerald-500/20">
                      <Mail className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Email</p>
                      <p className="font-medium text-slate-300 truncate text-sm">{user.email || 'Не указан'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-lg">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-500/20">
                      <Hash className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">ID пользователя</p>
                      <p className="font-mono text-slate-400 text-sm truncate">{user.id}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Settings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                Профиль
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Имя"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    required
                  />
                  <Input
                    label="Фамилия"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    required
                  />
                </div>
                <Input
                  label="Email (необязательно)"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="example@mail.com"
                />
                <div className="flex items-center gap-3 pt-4">
                  <Button type="submit" variant="primary" disabled={saving}>
                    <Save size={18} className="mr-2" />
                    {saving ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-emerald-400" />
              Изменение пароля
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="Текущий пароль"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Новый пароль"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  required
                  minLength={6}
                />
                <Input
                  label="Подтверждение пароля"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="flex items-center gap-3 pt-4">
                <Button type="submit" variant="primary" disabled={saving}>
                  <Lock size={18} className="mr-2" />
                  {saving ? 'Изменение...' : 'Изменить пароль'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-emerald-400" />
              Уведомления
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg">
              <div>
                <p className="font-medium text-white">Email уведомления</p>
                <p className="text-sm text-slate-500">Получать уведомления на email</p>
              </div>
              <button
                onClick={() => handleNotificationsToggle('emailNotifications')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.emailNotifications ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-slate-800/50 backdrop-blur-sm rounded-full transition-transform ${
                    notifications.emailNotifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg">
              <div>
                <p className="font-medium text-white">Уведомления о задачах</p>
                <p className="text-sm text-slate-500">Новые задачи и изменения статуса</p>
              </div>
              <button
                onClick={() => handleNotificationsToggle('taskNotifications')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.taskNotifications ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-slate-800/50 backdrop-blur-sm rounded-full transition-transform ${
                    notifications.taskNotifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg">
              <div>
                <p className="font-medium text-white">Напоминания о дедлайнах</p>
                <p className="text-sm text-slate-500">Уведомления о приближающихся сроках</p>
              </div>
              <button
                onClick={() => handleNotificationsToggle('deadlineNotifications')}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  notifications.deadlineNotifications ? 'bg-amber-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-slate-800/50 backdrop-blur-sm rounded-full transition-transform ${
                    notifications.deadlineNotifications ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-emerald-400" />
              Внешний вид
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg">
                <div>
                  <p className="font-medium text-white">Тёмная тема</p>
                  <p className="text-sm text-slate-500">Использовать тёмную тему оформления</p>
                </div>
                <Badge variant="default" size="sm">Скоро</Badge>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-800/40 rounded-lg">
                <div>
                  <p className="font-medium text-white">Компактный режим</p>
                  <p className="text-sm text-slate-500">Уменьшить размеры элементов</p>
                </div>
                <Badge variant="default" size="sm">Скоро</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
