'use client';

import { useEffect, useState } from 'react';
import {
  MessageCircle,
  Search,
  Filter,
  X,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Trash2,
} from 'lucide-react';

interface Reply {
  id: string;
  fromAdmin: boolean;
  message: string;
  createdAt: string;
}

interface Message {
  id: string;
  userId: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  replies: Reply[];
  user: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

export default function AdminSupportPage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [replyText, setReplyText] = useState('');
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [statusFilter]);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set('status', statusFilter);

      const response = await fetch(`/api/admin/support-messages?${params}`);
      const data = await response.json();

      if (data.success) {
        setMessages(data.data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) return;

    // Проверяем статус обращения
    const message = messages.find(m => m.id === messageId);
    if (message?.status === 'CLOSED') {
      alert('Нельзя ответить на закрытое обращение');
      return;
    }

    setSending(true);
    try {
      const response = await fetch('/api/admin/support-messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          reply: replyText.trim(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        loadMessages();
        setReplyText('');
        setSelectedMessageId(data.data.message.id);
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(false);
    }
  };

  const handleCloseMessage = async (messageId: string) => {
    try {
      const response = await fetch('/api/admin/support-messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, status: 'CLOSED' }),
      });

      const data = await response.json();
      if (data.success) {
        loadMessages();
        if (selectedMessageId === messageId) {
          setSelectedMessageId(data.data.message.id);
        }
      }
    } catch (error) {
      console.error('Error closing message:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это сообщение?')) return;
    
    try {
      const response = await fetch(`/api/admin/support-messages?messageId=${messageId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        loadMessages();
        if (selectedMessageId === messageId) {
          setSelectedMessageId(null);
        }
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = search
    ? messages.filter(m =>
        m.user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        m.user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        m.user.username.toLowerCase().includes(search.toLowerCase()) ||
        m.message.toLowerCase().includes(search.toLowerCase())
      )
    : messages;

  const openMessages = messages.filter(m => m.status === 'OPEN').length;
  const inProgressMessages = messages.filter(m => m.status === 'IN_PROGRESS').length;
  const closedMessages = messages.filter(m => m.status === 'CLOSED').length;

  const statusColors: Record<string, string> = {
    OPEN: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    IN_PROGRESS: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    CLOSED: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
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

  const selectedMessage = messages.find(m => m.id === selectedMessageId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Обращения поддержки</h1>
          <p className="text-slate-400">Управление обращениями пользователей</p>
        </div>
        <button
          onClick={loadMessages}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl text-white transition-colors flex items-center gap-2"
          title="Обновить список"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Обновить
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-sm p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white">{openMessages}</p>
              <p className="text-xs text-emerald-400">Новые</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm p-4">
          <div className="flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-white">{inProgressMessages}</p>
              <p className="text-xs text-blue-400">В работе</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-500/30 bg-slate-500/10 backdrop-blur-sm p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-8 h-8 text-slate-400" />
            <div>
              <p className="text-2xl font-bold text-white">{closedMessages}</p>
              <p className="text-xs text-slate-400">Закрыто</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по пользователю или сообщению..."
            className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
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
            <option value="OPEN">Открытые</option>
            <option value="IN_PROGRESS">В работе</option>
            <option value="CLOSED">Закрытые</option>
          </select>
        </div>
      </div>

      {/* Messages List */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                Загрузка...
              </div>
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Сообщения не найдены</p>
            </div>
          ) : (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => {
                  setSelectedMessageId(msg.id);
                  setReplyText('');
                }}
                className={`rounded-xl border cursor-pointer transition-all ${
                  selectedMessageId === msg.id
                    ? 'border-violet-500/50 bg-violet-500/10'
                    : 'border-slate-800 bg-slate-800/20 hover:border-slate-700'
                }`}
              >
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-white">
                          {msg.user.firstName[0]}
                          {msg.user.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-white truncate">
                            {msg.user.firstName} {msg.user.lastName}
                          </p>
                          <span className={`px-2 py-0.5 rounded-full border text-xs font-semibold flex items-center gap-1 flex-shrink-0 ${statusColors[msg.status]}`}>
                            {statusIcons[msg.status]}
                            {statusLabels[msg.status]}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 truncate">@{msg.user.username}</p>
                        <p className="text-xs text-slate-500 mt-1 truncate">
                          {msg.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Selected Message Detail */}
        <div className="lg:sticky lg:top-6">
          {selectedMessage ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-800/20 backdrop-blur-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                    <span className="text-lg font-bold text-white">
                      {selectedMessage.user?.firstName?.[0] || '?'}
                      {selectedMessage.user?.lastName?.[0] || '?'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      {selectedMessage.user?.firstName || 'Неизвестный'} {selectedMessage.user?.lastName || ''}
                    </h3>
                    <p className="text-slate-400 text-sm">@{selectedMessage.user?.username || 'unknown'}</p>
                    <p className="text-slate-500 text-xs">
                      {new Date(selectedMessage.createdAt).toLocaleDateString('ru-RU', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Удалить"
                >
                  <Trash2 className="w-5 h-5 text-red-400" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Сообщение пользователя */}
                <div>
                  <p className="text-sm text-slate-400 mb-2">Обращение:</p>
                  <div className="bg-gradient-to-br from-violet-500/10 to-violet-600/10 border border-violet-500/30 rounded-xl p-4">
                    <p className="text-slate-200">{selectedMessage.message}</p>
                  </div>
                </div>

                {/* Ответы */}
                {selectedMessage.replies && selectedMessage.replies.length > 0 && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Переписка:</p>
                    <div className="space-y-3">
                      {selectedMessage.replies.map((reply) => (
                        <div key={reply.id} className={`flex items-start gap-3 ${reply.fromAdmin ? 'justify-start' : 'justify-end'}`}>
                          {reply.fromAdmin ? (
                            <>
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              </div>
                              <div className="flex-1">
                                <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg rounded-tl-none p-3">
                                  <p className="text-xs text-violet-400 font-semibold mb-1">Вы (Админ)</p>
                                  <p className="text-slate-200 text-sm">{reply.message}</p>
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
                              <div className="flex-1">
                                <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg rounded-tr-none p-3">
                                  <p className="text-xs text-amber-400 font-semibold mb-1">Пользователь</p>
                                  <p className="text-slate-200 text-sm">{reply.message}</p>
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
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-white">
                                  {selectedMessage.user?.firstName?.[0] || '?'}
                                </span>
                              </div>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Форма ответа */}
                {selectedMessage.status !== 'CLOSED' && (
                  <div>
                    <p className="text-sm text-slate-400 mb-2">Ответить:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleReply(selectedMessage.id)}
                        placeholder="Напишите ответ..."
                        className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50"
                      />
                      <button
                        onClick={() => handleReply(selectedMessage.id)}
                        disabled={sending || !replyText.trim()}
                        className="px-4 py-3 bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {sending ? (
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Send className="w-5 h-5" />
                            Отправить
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {selectedMessage.status === 'CLOSED' && (
                  <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl text-center">
                    <p className="text-slate-400 text-sm">Обращение закрыто</p>
                    <p className="text-slate-500 text-xs mt-1">Ответы недоступны</p>
                  </div>
                )}

                {selectedMessage.status !== 'CLOSED' && (
                  <button
                    onClick={() => handleCloseMessage(selectedMessage.id)}
                    className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Закрыть обращение
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-800 bg-slate-800/20 backdrop-blur-sm p-12 text-center">
              <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-30" />
              <p className="text-slate-400">Выберите обращение для просмотра</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
