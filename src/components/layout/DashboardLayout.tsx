'use client';

import { ReactNode, useState, useEffect, useRef } from 'react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Sidebar } from './Sidebar';
import { ThemeToggle } from './ThemeToggle';
import { Bell, LogOut, Menu, X, ChevronLeft, ChevronRight, Crown, Star, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { useRouter } from 'next/navigation';

interface DashboardLayoutProps {
  children: ReactNode;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email?: string;
    role: string;
  };
}

export function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    taskId?: string | null;
  }>>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasUnreadChatMessages, setHasUnreadChatMessages] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<'FREE' | 'TEAM' | 'BUSINESS'>('FREE');
  const [subscriptionData, setSubscriptionData] = useState<{
    plan: string;
    isActive: boolean;
    endDate?: string | null;
    daysRemaining?: number;
  } | null>(null);

  // Закрытие уведомлений при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showNotifications && notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  const loadNotifications = async () => {
    try {
      const response = await fetch('/api/notifications');
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data.notifications || []);
        setUnreadCount(data.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const loadUnreadChatMessages = async () => {
    try {
      const response = await fetch('/api/messages/unread');
      const data = await response.json();
      if (data.success) {
        const unreadMap = data.data || {};
        const hasUnread = Object.values(unreadMap).some((count) => typeof count === 'number' && count > 0);
        setHasUnreadChatMessages(hasUnread);
      }
    } catch (error) {
      console.error('Error loading unread chat messages:', error);
    }
  };

  const checkDeadlines = async () => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkDeadlines: true }),
      });
      // После проверки дедлайнов обновляем уведомления
      await loadNotifications();
    } catch (error) {
      console.error('Error checking deadlines:', error);
    }
  };

  useEffect(() => {
    loadNotifications();
    loadUnreadChatMessages();
    checkDeadlines();
    // Обновляем уведомления каждые 30 секунд
    const notificationInterval = setInterval(loadNotifications, 30000);
    // Проверяем непрочитанные сообщения чата каждые 3 секунды
    const chatInterval = setInterval(loadUnreadChatMessages, 3000);
    // Проверяем дедлайны каждые 10 минут (чтобы точно поймать смену часа)
    const deadlineInterval = setInterval(checkDeadlines, 10 * 60 * 1000);
    return () => {
      clearInterval(notificationInterval);
      clearInterval(chatInterval);
      clearInterval(deadlineInterval);
    };
  }, []);

  // Загрузка тарифа из API
  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const response = await fetch('/api/subscription');
        const data = await response.json();
        if (data.success && data.data) {
          setCurrentPlan(data.data.plan);
          
          // Вычисляем оставшиеся дни
          let daysRemaining: number | undefined;
          if (data.data.endDate) {
            const endDate = new Date(data.data.endDate);
            const now = new Date();
            const diffTime = endDate.getTime() - now.getTime();
            daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
          }
          
          setSubscriptionData({
            plan: data.data.plan,
            isActive: data.data.isActive,
            endDate: data.data.endDate,
            daysRemaining,
          });
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      }
    };

    loadSubscription();
  }, []);

  const handleNotificationClick = async (id?: string) => {
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, markAllAsRead: !id }),
      });
      await loadNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationNavigate = async (notification: {
    id: string;
    type: string;
    taskId?: string | null;
  }) => {
    // Помечаем как прочитанное
    await handleNotificationClick(notification.id);
    
    // Переходим к задаче если есть taskId
    if (notification.taskId) {
      router.push(`/dashboard/tasks/${notification.taskId}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'TASK_ASSIGNED':
        return '📋';
      case 'TASK_STATUS_CHANGED':
        return '🔄';
      case 'TASK_COMPLETED':
        return '✅';
      case 'TASK_COMMENT':
        return '💬';
      default:
        return '🔔';
    }
  };

  const formatNotificationTime = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffMs = now.getTime() - notificationDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин. назад`;
    if (diffHours < 24) return `${diffHours} ч. назад`;
    if (diffDays < 7) return `${diffDays} дн. назад`;
    return notificationDate.toLocaleDateString('ru-RU');
  };

  const directorNavItems = [
    { href: '/dashboard', label: 'Дашборд', icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { href: '/dashboard/tasks', label: 'Задачи', icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
    { href: '/dashboard/employees', label: 'Сотрудники', icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg> },
    { href: '/dashboard/chat', label: 'Чат', icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { href: '/dashboard/support', label: 'Обращения', icon: <MessageCircle className="w-5 h-5" /> },
    { href: '/dashboard/statistics', label: 'Статистика', icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { onClick: () => setShowPricingModal(true), label: 'Ваш Тариф', icon: <Crown className="w-5 h-5" /> },
  ];

  const employeeNavItems = [
    { href: '/dashboard', label: 'Дашборд', icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
    { href: '/dashboard/my-tasks', label: 'Мои задачи', icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg> },
    { href: '/dashboard/chat', label: 'Чат', icon: <svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { href: '/dashboard/support', label: 'Обращения', icon: <MessageCircle className="w-5 h-5" /> },
  ];

  const navItems = user.role === 'DIRECTOR' ? directorNavItems : employeeNavItems;

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      sessionStorage.clear();
      localStorage.clear();
      await router.push('/login');
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 transform transition-all duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-72'}`}>
        <Sidebar items={navItems} user={{ firstName: user.firstName, lastName: user.lastName, role: user.role }} collapsed={sidebarCollapsed} hasUnreadChat={hasUnreadChatMessages} />
      </div>
      
      {/* Collapse toggle button - only show on lg screens */}
      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        className={`hidden lg:flex fixed z-50 w-6 h-6 items-center justify-center bg-slate-800 border-2 border-slate-700 rounded-full text-slate-300 hover:text-white hover:bg-slate-700 transition-all shadow-md hover:shadow-lg`}
        style={{
          left: sidebarCollapsed ? '92px' : '280px',
          top: '40px',
          transform: 'translateX(-50%)',
        }}
        title={sidebarCollapsed ? 'Развернуть меню' : 'Свернуть меню'}
      >
        {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>

      {/* Main Content */}
      <main className={`${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} min-h-screen`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50" style={{ height: '73px' }}>
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                  {user.role === 'DIRECTOR' ? 'Панель директора' : 'Панель сотрудника'}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 hidden sm:block">
                  Добро пожаловать, {user.firstName}!
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4 relative">
              {/* Theme Toggle */}
              <ThemeToggle />
              
              {/* Notifications */}
              <div ref={notificationsRef} className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-300 hover:text-white transition-colors"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-800"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800/95 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50 overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
                      <h3 className="font-semibold text-white">Уведомления</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => handleNotificationClick()}
                          className="text-xs text-amber-400 hover:text-amber-300 font-medium"
                        >
                          Прочитать все
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-8 text-center text-slate-400 text-sm">
                          Нет уведомлений
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            onClick={() => handleNotificationNavigate(notification)}
                            className={`px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/50 cursor-pointer transition-colors ${
                              !notification.read ? 'bg-amber-500/10' : ''
                            }`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="text-xl">{getNotificationIcon(notification.type)}</span>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm ${!notification.read ? 'font-semibold text-white' : 'text-slate-300'}`}>
                                  {notification.title}
                                </p>
                                <p className="text-xs text-slate-400 mt-1">{notification.message}</p>
                                <p className="text-xs text-slate-500 mt-2">
                                  {formatNotificationTime(notification.createdAt)}
                                </p>
                              </div>
                              {!notification.read && (
                                <span className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0 mt-1"></span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:flex">
                <LogOut size={16} className="mr-2" />
                Выйти
              </Button>
              <button
                onClick={handleLogout}
                className="sm:hidden p-2 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>

      {/* Pricing Modal */}
      {showPricingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-hidden" onClick={() => setShowPricingModal(false)}>
          <div className="relative w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowPricingModal(false)}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-lg z-10"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 shadow-2xl max-h-[85vh] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/30 rounded-full mb-4">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span className="text-amber-300 text-sm font-semibold">Ваш текущий тариф</span>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {currentPlan === 'FREE' && 'FREE'}
                  {currentPlan === 'TEAM' && 'TEAM'}
                  {currentPlan === 'BUSINESS' && 'BUSINESS'}
                </h2>
                <p className="text-slate-400">
                  {currentPlan === 'FREE' && 'До 5 человек в команде'}
                  {currentPlan === 'TEAM' && 'До 15 человек в команде'}
                  {currentPlan === 'BUSINESS' && 'До 50 человек в команде'}
                </p>
              </div>

              {/* Current Plan Info */}
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Пользователей</p>
                  <p className="text-2xl font-bold text-white">
                    {currentPlan === 'FREE' && '5'}
                    {currentPlan === 'TEAM' && '15'}
                    {currentPlan === 'BUSINESS' && '50'}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Цена</p>
                  <p className="text-2xl font-bold text-white">
                    {currentPlan === 'FREE' && '$0'}
                    {currentPlan === 'TEAM' && '$29'}
                    {currentPlan === 'BUSINESS' && '$79'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentPlan === 'FREE' && 'навсегда'}
                    {currentPlan === 'TEAM' && '/месяц'}
                    {currentPlan === 'BUSINESS' && '/месяц'}
                  </p>
                </div>
                <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                  <p className="text-sm text-slate-400 mb-1">Статус</p>
                  {subscriptionData?.daysRemaining !== undefined && subscriptionData.daysRemaining > 0 ? (
                    <div>
                      <p className="text-lg font-semibold text-emerald-400">Активен</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {subscriptionData.daysRemaining} дн. осталось
                      </p>
                    </div>
                  ) : (
                    <p className="text-lg font-semibold text-emerald-400">Активен</p>
                  )}
                </div>
              </div>

              {/* Days Remaining Progress Bar - для TEAM и BUSINESS */}
              {(currentPlan === 'TEAM' || currentPlan === 'BUSINESS') && subscriptionData?.daysRemaining !== undefined && (
                <div className="mb-8 p-4 bg-gradient-to-r from-slate-800/50 to-slate-800/30 rounded-xl border border-slate-700">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        subscriptionData.daysRemaining > 7 
                          ? 'bg-emerald-500' 
                          : subscriptionData.daysRemaining > 3 
                            ? 'bg-amber-500' 
                            : 'bg-red-500'
                      } animate-pulse`}></div>
                      <span className="text-sm font-medium text-slate-300">
                        До окончания подписки
                      </span>
                    </div>
                    <span className={`text-2xl font-bold ${
                      subscriptionData.daysRemaining > 7 
                        ? 'text-emerald-400' 
                        : subscriptionData.daysRemaining > 3 
                          ? 'text-amber-400' 
                          : 'text-red-400'
                    }`}>
                      {subscriptionData.daysRemaining} дн.
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="relative h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full rounded-full transition-all duration-500 ${
                        subscriptionData.daysRemaining > 7 
                          ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                          : subscriptionData.daysRemaining > 3 
                            ? 'bg-gradient-to-r from-amber-500 to-amber-400' 
                            : 'bg-gradient-to-r from-red-500 to-red-400'
                      }`}
                      style={{ 
                        width: `${subscriptionData.endDate ? Math.min(100, (subscriptionData.daysRemaining / 7) * 100) : 100}%` 
                      }}
                    />
                  </div>
                  
                  {/* Info text */}
                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      {subscriptionData.daysRemaining > 7 
                        ? 'Подписка активна' 
                        : subscriptionData.daysRemaining > 3 
                          ? 'Скоро окончание' 
                          : 'Требуется продление'
                      }
                    </span>
                    {subscriptionData.endDate && (
                      <span className="text-slate-500">
                        Окончание: {new Date(subscriptionData.endDate).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-white mb-4">Возможности тарифа:</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {(currentPlan === 'FREE' || currentPlan === 'TEAM' || currentPlan === 'BUSINESS') && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-sm">Базовые задачи</span>
                    </div>
                  )}
                  {(currentPlan === 'FREE' || currentPlan === 'TEAM' || currentPlan === 'BUSINESS') && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-sm">Уведомления</span>
                    </div>
                  )}
                  {(currentPlan === 'FREE' || currentPlan === 'TEAM' || currentPlan === 'BUSINESS') && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-sm">Корпоративный чат</span>
                    </div>
                  )}
                  {(currentPlan === 'TEAM' || currentPlan === 'BUSINESS') && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-sm">Контроль задач</span>
                    </div>
                  )}
                  {(currentPlan === 'TEAM' || currentPlan === 'BUSINESS') && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-sm">Статусы и дедлайны</span>
                    </div>
                  )}
                  {(currentPlan === 'TEAM' || currentPlan === 'BUSINESS') && (
                    <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                      <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-slate-300 text-sm">Панель руководителя</span>
                    </div>
                  )}
                  {currentPlan === 'BUSINESS' && (
                    <>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-300 text-sm">Автоматизация</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-300 text-sm">Аналитика</span>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-lg">
                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-slate-300 text-sm">Интеграции (API)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Upgrade Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                {currentPlan === 'FREE' && (
                  <>
                    <a
                      href="/checkout?plan=TEAM"
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 text-center"
                    >
                      <Star className="w-4 h-4" />
                      Перейти на TEAM ($29/мес)
                    </a>
                    <a
                      href="/checkout?plan=BUSINESS"
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 text-center"
                    >
                      <Crown className="w-4 h-4" />
                      Перейти на BUSINESS ($79/мес)
                    </a>
                  </>
                )}
                {currentPlan === 'TEAM' && (
                  <>
                    <button
                      onClick={() => {
                        setCurrentPlan('FREE');
                        setShowPricingModal(false);
                      }}
                      className="flex-1 py-3 px-6 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                    >
                      Перейти на FREE
                    </button>
                    <a
                      href="/checkout?plan=BUSINESS"
                      className="flex-1 py-3 px-6 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-semibold rounded-xl hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 text-center"
                    >
                      <Crown className="w-4 h-4" />
                      Перейти на BUSINESS ($79/мес)
                    </a>
                  </>
                )}
                {currentPlan === 'BUSINESS' && (
                  <>
                    <button
                      onClick={() => {
                        setCurrentPlan('FREE');
                        setShowPricingModal(false);
                      }}
                      className="flex-1 py-3 px-6 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                    >
                      Перейти на FREE
                    </button>
                    <button
                      onClick={() => {
                        setCurrentPlan('TEAM');
                        setShowPricingModal(false);
                      }}
                      className="flex-1 py-3 px-6 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                    >
                      Перейти на TEAM
                    </button>
                  </>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 pt-6 border-t border-slate-700 text-center">
                <p className="text-sm text-slate-400">
                  Нужно больше информации?{' '}
                  <a href="/pricing" target="_blank" className="text-amber-500 hover:text-amber-400 font-medium">
                    Посмотреть все тарифы
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </ThemeProvider>
  );
}
