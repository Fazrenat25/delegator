'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MessageCircle, AlertCircle, Clock, CheckCircle, Send, X } from 'lucide-react';

interface Reply {
  id: string;
  fromAdmin: boolean;
  message: string;
  createdAt: string;
}

interface MessageThread {
  id: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
}

interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
  role: string;
  companyId: string | null;
}

export default function SupportTicketsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedThread, setSelectedThread] = useState<MessageThread | null>(null);
  const [replyToReply, setReplyToReply] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [expandedThreads, setExpandedThreads] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newExpanded = new Set<string>();
    threads.forEach(thread => {
      if (thread.status !== 'CLOSED') {
        newExpanded.add(thread.id);
      }
    });
    setExpandedThreads(newExpanded);
  }, [threads]);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();

        if (!sessionData.success) {
          router.push('/login');
          return;
        }

        setUser(sessionData.data.user);
        await loadMessages();
      } catch (error) {
        console.error('Error loading data:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/support-messages');
      const data = await response.json();
      if (data.success) {
        const rawMessages = data.data.messages || [];
        const sortedMessages = [...rawMessages].sort((a: MessageThread, b: MessageThread) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setThreads(sortedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    try {
      const response = await fetch('/api/support-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: newMessage.trim() }),
      });

      const data = await response.json();
      if (data.success) {
        setNewMessage('');
        await loadMessages();
      } else {
        alert('Ошибка отправки: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Ошибка отправки сообщения');
    } finally {
      setSending(false);
    }
  };

  const handleReplyToSupport = async (threadId: string) => {
    if (!replyToReply.trim()) return;

    // Проверяем статус обращения
    const thread = threads.find(t => t.id === threadId);
    if (thread?.status === 'CLOSED') {
      alert('Нельзя ответить на закрытое обращение');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/support-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: replyToReply.trim(),
          replyToId: threadId,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReplyToReply('');
        setReplyingToId(null);
        await loadMessages();
      } else {
        alert('Ошибка отправки: ' + data.error);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Ошибка отправки ответа');
    } finally {
      setSending(false);
    }
  };

  const toggleThread = (threadId: string) => {
    setExpandedThreads(prev => {
      const next = new Set(prev);
      if (next.has(threadId)) {
        next.delete(threadId);
      } else {
        next.add(threadId);
      }
      return next;
    });
  };

  const statusColors: Record<string, string> = {
    OPEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    CLOSED: 'bg-slate-800/400/10 text-slate-400 border-slate-500/30',
  };

  const statusLabels: Record<string, string> = {
    OPEN: 'Открыто',
    IN_PROGRESS: 'В работе',
    CLOSED: 'Закрыто',
  };

  const statusIcons: Record<string, React.ReactNode> = {
    OPEN: <AlertCircle className="w-4 h-4" />,
    IN_PROGRESS: <Clock className="w-4 h-4" />,
    CLOSED: <CheckCircle className="w-4 h-4" />,
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

  const openCount = threads.filter(t => t.status === 'OPEN').length;
  const inProgressCount = threads.filter(t => t.status === 'IN_PROGRESS').length;
  const closedCount = threads.filter(t => t.status === 'CLOSED').length;

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Ваши обращения</h1>
          <p className="text-slate-500">Обращения в техническую поддержку</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm p-4">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">{openCount}</p>
                <p className="text-xs text-emerald-400">Открыто</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-2xl font-bold text-white">{inProgressCount}</p>
                <p className="text-xs text-blue-400">В работе</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-slate-500/30 bg-slate-800/400/10 backdrop-blur-sm p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-slate-400" />
              <div>
                <p className="text-2xl font-bold text-white">{closedCount}</p>
                <p className="text-xs text-slate-400">Закрыто</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm shadow-sm">
              <div className="p-6 border-b border-slate-700/50">
                <h2 className="text-lg font-bold text-white">История обращений</h2>
              </div>
              <div className="divide-y divide-slate-100">
                {loading ? (
                  <div className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      Загрузка...
                    </div>
                  </div>
                ) : threads.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>У вас пока нет обращений</p>
                    <p className="text-sm mt-2">Создайте первое обращение справа</p>
                  </div>
                ) : (
                  threads.map((thread) => {
                    const isExpanded = expandedThreads.has(thread.id);
                    const isClosed = thread.status === 'CLOSED';
                    
                    return (
                      <div
                        key={thread.id}
                        onClick={() => setSelectedThread(selectedThread?.id === thread.id ? null : thread)}
                        className={`p-4 cursor-pointer transition-colors ${
                          selectedThread?.id === thread.id ? 'bg-slate-900/50' : 'hover:bg-slate-900/50'
                        } ${isClosed && !isExpanded ? 'border-l-4 border-slate-400 bg-slate-800/50' : ''}`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3 flex-wrap">
                              <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold flex items-center gap-1 ${statusColors[thread.status]}`}>
                                {statusIcons[thread.status]}
                                {statusLabels[thread.status]}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(thread.createdAt).toLocaleDateString('ru-RU', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                              {isClosed && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleThread(thread.id);
                                  }}
                                  className="text-xs text-slate-500 hover:text-slate-300 flex items-center gap-1 ml-auto"
                                >
                                  {isExpanded ? (
                                    <>
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                      </svg>
                                      Свернуть
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                      </svg>
                                      Развернуть
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            
                            {isClosed && !isExpanded ? (
                              <div className="flex items-center gap-3 p-3 bg-slate-800/50 border border-slate-700/50 rounded-lg">
                                <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="w-4 h-4 text-slate-500" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-slate-300">Обращение закрыто</p>
                                  <p className="text-xs text-slate-500">Нажмите "Развернуть" чтобы просмотреть переписку</p>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                                      <span className="text-xs font-bold text-white">
                                        {user.firstName[0]}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="bg-amber-50 border border-amber-200 rounded-lg rounded-tl-none p-3">
                                        <p className="text-xs text-cyan-600 font-semibold mb-1">Вы</p>
                                        <p className="text-white text-sm">{thread.message}</p>
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {thread.replies && thread.replies.map((reply) => (
                                    <div key={reply.id} className="flex items-start gap-3">
                                      {reply.fromAdmin ? (
                                        <>
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1">
                                            <div className="bg-violet-50 border border-violet-200 rounded-lg rounded-tl-none p-3">
                                              <p className="text-xs text-violet-600 font-semibold mb-1">Поддержка</p>
                                              <p className="text-white text-sm">{reply.message}</p>
                                              <p className="text-xs text-slate-500 mt-1">
                                                {new Date(reply.createdAt).toLocaleDateString('ru-RU', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                                })}
                                              </p>
                                            </div>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                                            <span className="text-xs font-bold text-white">
                                              {user.firstName[0]}
                                            </span>
                                          </div>
                                          <div className="flex-1">
                                            <div className="bg-amber-50 border border-amber-200 rounded-lg rounded-tl-none p-3">
                                              <p className="text-xs text-cyan-600 font-semibold mb-1">Вы</p>
                                              <p className="text-white text-sm">{reply.message}</p>
                                              <p className="text-xs text-slate-500 mt-1">
                                                {new Date(reply.createdAt).toLocaleDateString('ru-RU', {
                                                  day: 'numeric',
                                                  month: 'long',
                                                  hour: '2-digit',
                                                  minute: '2-digit',
                                                })}
                                              </p>
                                            </div>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                
                                {thread.status !== 'CLOSED' && (
                                  replyingToId === thread.id ? (
                                    <div className="mt-3 ml-11">
                                      <textarea
                                        value={replyToReply}
                                        onChange={(e) => setReplyToReply(e.target.value)}
                                        placeholder="Ваш ответ..."
                                        rows={3}
                                        className="w-full px-3 py-2 bg-slate-800/50 backdrop-blur-sm border border-amber-300 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-2"
                                      />
                                      <div className="flex items-center gap-2">
                                        <button
                                          onClick={() => handleReplyToSupport(thread.id)}
                                          disabled={sending || !replyToReply.trim()}
                                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                                        >
                                          {sending ? (
                                            <>
                                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                              Отправить...
                                            </>
                                          ) : (
                                            <>
                                              <Send className="w-3 h-3" />
                                              Отправить
                                            </>
                                          )}
                                        </button>
                                        <button
                                          onClick={() => {
                                            setReplyToReply('');
                                            setReplyingToId(null);
                                          }}
                                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-300 text-xs font-semibold rounded-lg transition-colors"
                                        >
                                          Отмена
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setReplyingToId(thread.id);
                                      }}
                                      className="mt-3 ml-11 text-xs text-cyan-600 hover:text-amber-700 font-semibold flex items-center gap-1"
                                    >
                                      <MessageCircle className="w-3 h-3" />
                                      Продолжить обращение
                                    </button>
                                  )
                                )}
                              </>
                            )}
                          </div>
                          <div className="flex-shrink-0">
                            {selectedThread?.id === thread.id ? (
                              <X className="w-5 h-5 text-slate-400" />
                            ) : (
                              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-amber-500" />
                Создать новое обращение
              </h2>
              <form onSubmit={handleSubmit}>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Опишите вашу проблему или вопрос..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800/40 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none mb-4"
                  required
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25"
                >
                  {sending ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Отправка...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Отправить обращение
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
