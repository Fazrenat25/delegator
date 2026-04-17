'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Send, Users, MessageSquare, ArrowLeft, UserCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

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
  role: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  receiver?: {
    id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
}

export default function ChatPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<Employee | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [generalRoomId, setGeneralRoomId] = useState<string | null>(null);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const prevUnreadCountsRef = useRef<Record<string, number>>({});

  // Функция воспроизведения звука
  const playNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, ctx.currentTime);
      oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.12);
      oscillator.frequency.setValueAtTime(880, ctx.currentTime + 0.24);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.45);
    } catch (e) {
      console.error('Error playing notification sound:', e);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        console.log('Loading chat data...');
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        console.log('Session:', sessionData);

        if (sessionData.success) {
          setUser(sessionData.data.user);

          // Загружаем сотрудников
          const employeesRes = await fetch('/api/chat/users');
          const employeesData = await employeesRes.json();
          console.log('Employees:', employeesData);
          if (employeesData.success) {
            setEmployees(employeesData.data || []);
          }

          // Загружаем общую комнату
          const generalRes = await fetch('/api/chat/general');
          const generalData = await generalRes.json();
          console.log('General room:', generalData);
          if (generalData.success) {
            setGeneralRoomId(generalData.data.id);
            // Загружаем сообщения общей комнаты
            await loadMessages(generalData.data.id, null);
          } else {
            console.error('Failed to load general room:', generalData.error);
          }

          // Загружаем непрочитанные сообщения
          await loadUnreadCounts();
        } else {
          console.error('Not authenticated:', sessionData);
          router.push('/login');
        }
      } catch (error) {
        console.error('Error loading chat:', error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Polling для новых сообщений (каждые 3 секунды)
  useEffect(() => {
    if (!generalRoomId && !selectedUserId) return;

    const interval = setInterval(() => {
      if (selectedUserId) {
        loadMessages(null, selectedUserId);
      } else if (generalRoomId) {
        loadMessages(generalRoomId, null);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [generalRoomId, selectedUserId]);

  // Отслеживание новых непрочитанных сообщений для звукового уведомления
  useEffect(() => {
    const prev = prevUnreadCountsRef.current;

    for (const [key, count] of Object.entries(unreadCounts)) {
      const prevCount = prev[key] || 0;
      // Если счётчик непрочитанных увеличился — воспроизводим звук
      if (count > prevCount) {
        playNotificationSound();
        break;
      }
    }

    prevUnreadCountsRef.current = { ...unreadCounts };
  }, [unreadCounts]);

  // Polling для непрочитанных сообщений (каждые 3 секунды)
  useEffect(() => {
    const interval = setInterval(() => {
      loadUnreadCounts();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUnreadCounts = async () => {
    try {
      const response = await fetch('/api/messages/unread');
      const data = await response.json();
      if (data.success) {
        setUnreadCounts(data.data);
      }
    } catch (error) {
      console.error('Error loading unread counts:', error);
    }
  };

  const loadMessages = async (roomId: string | null, userId: string | null) => {
    try {
      const params = new URLSearchParams();
      if (roomId) params.append('roomId', roomId);
      if (userId) params.append('userId', userId);

      console.log('Loading messages with params:', params.toString());
      const response = await fetch(`/api/messages?${params.toString()}`);
      const data = await response.json();
      console.log('Messages:', data);

      if (data.success) {
        setMessages(data.data || []);
      } else {
        console.error('Failed to load messages:', data.error);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSelectUser = async (employee: Employee) => {
    setSelectedUser(employee);
    setSelectedUserId(employee.id);
    // Отмечаем сообщения как прочитанные
    try {
      await fetch('/api/messages/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId: employee.id }),
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
    // Сбрасываем счетчик непрочитанных для этого пользователя
    setUnreadCounts(prev => ({ ...prev, [employee.id]: 0 }));
    loadMessages(null, employee.id);
  };

  const handleBackToGeneral = () => {
    setSelectedUser(null);
    setSelectedUserId(null);
    if (generalRoomId) {
      loadMessages(generalRoomId, null);
    }
  };

  const getPositionLabel = (position?: string | null) => {
    const positions: Record<string, string> = {
      MANAGER: 'Менеджер',
      DEVELOPER: 'Разработчик',
      DESIGNER: 'Дизайнер',
      ANALYST: 'Аналитик',
      TESTER: 'Тестировщик',
      HR: 'HR-менеджер',
      ACCOUNTANT: 'Бухгалтер',
      SALESMAN: 'Менеджер по продажам',
      SUPPORT: 'Специалист поддержки',
      INTERN: 'Стажёр',
    };
    return position ? positions[position] || 'Сотрудник' : 'Сотрудник';
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageContent.trim()) return;

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: messageContent,
          roomId: selectedUserId ? null : generalRoomId,
          receiverId: selectedUserId,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessageContent('');
        // Перезагружаем сообщения
        if (selectedUserId) {
          loadMessages(null, selectedUserId);
        } else if (generalRoomId) {
          loadMessages(generalRoomId, null);
        }
      } else {
        alert(data.error || 'Ошибка отправки сообщения');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка отправки сообщения');
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-900/50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Загрузка чата...</p>
        </div>
      </div>
    );
  }

  if (!generalRoomId) {
    return (
      <div className="min-h-screen bg-slate-900/50 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p className="text-lg mb-4">Не удалось загрузить общую комнату</p>
          <Button onClick={() => window.location.reload()}>Обновить страницу</Button>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="h-[calc(100vh-140px)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Sidebar - список сотрудников */}
          <Card className="lg:col-span-1 flex flex-col h-full overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 bg-slate-900/50">
              <h2 className="font-semibold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                Чаты
              </h2>
            </div>

            {/* Общий чат */}
            <button
              onClick={handleBackToGeneral}
              className={`w-full p-4 flex items-center gap-3 hover:bg-slate-700/50 transition-colors border-b border-slate-700/50 ${
                !selectedUserId ? 'bg-emerald-500/10 border-emerald-500/30' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="font-medium text-white">Общий чат</p>
                <p className="text-xs text-slate-500">Все сотрудники</p>
              </div>
            </button>

            {/* Список сотрудников */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
                Личные сообщения
              </div>
              {employees.map((employee) => {
                const unreadCount = unreadCounts[employee.id] || 0;
                return (
                  <button
                    key={employee.id}
                    onClick={() => handleSelectUser(employee)}
                    className={`w-full p-3 flex items-center gap-3 hover:bg-slate-700/50 transition-colors relative ${
                      selectedUserId === employee.id ? 'bg-emerald-500/10' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-500 to-slate-600 flex items-center justify-center text-white font-semibold flex-shrink-0 text-sm">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                    <div className="text-left flex-1 min-w-0">
                      <p className="font-medium text-white truncate">
                        {employee.firstName} {employee.lastName}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {getPositionLabel(employee.position)}
                      </p>
                    </div>
                    {unreadCount > 0 && (
                      <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold text-white bg-emerald-500/100 rounded-full">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Chat area */}
          <Card className="lg:col-span-3 flex flex-col h-full overflow-hidden">
            {/* Chat header */}
            <div className="p-4 border-b border-slate-700/50 bg-slate-900/50 flex items-center gap-3">
              {selectedUser && (
                <Button variant="ghost" size="sm" onClick={handleBackToGeneral} className="lg:hidden">
                  <ArrowLeft size={16} />
                </Button>
              )}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                selectedUser 
                  ? 'bg-gradient-to-br from-slate-500 to-slate-600' 
                  : 'bg-gradient-to-br from-emerald-500 to-teal-600'
              }`}>
                {selectedUser ? (
                  <span className="text-white font-semibold text-sm">
                    {selectedUser.firstName[0]}{selectedUser.firstName[0]}
                  </span>
                ) : (
                  <MessageSquare className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : 'Общий чат'}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedUser ? getPositionLabel(selectedUser.position) : 'Все сотрудники компании'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-800/50">
              {messages.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>Сообщений пока нет</p>
                  <p className="text-sm">Отправьте первое сообщение!</p>
                </div>
              ) : (
                messages.map((message, index) => {
                  const isOwn = message.senderId === user.id;
                  const showName = index === 0 || messages[index - 1]?.senderId !== message.senderId;

                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${isOwn ? 'order-1' : 'order-2'}`}>
                        {showName && !isOwn && (
                          <p className="text-xs text-slate-500 mb-1 ml-1">
                            {message.sender?.firstName} {message.sender?.lastName}
                          </p>
                        )}
                        <div
                          className={`px-4 py-2 rounded-2xl ${
                            isOwn
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-md'
                              : 'bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-white rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <p className={`text-xs text-slate-400 mt-1 ${isOwn ? 'text-right mr-1' : 'ml-1'}`}>
                          {new Date(message.createdAt).toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="p-4 border-t border-slate-700/50 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <Input
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder="Введите сообщение..."
                  className="flex-1"
                />
                <Button type="submit" variant="primary" disabled={!messageContent.trim()}>
                  <Send size={18} className="mr-2" />
                  Отправить
                </Button>
              </form>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
