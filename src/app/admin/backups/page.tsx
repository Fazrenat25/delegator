'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/app/admin/layout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import {
  Database,
  Plus,
  Trash2,
  Download,
  RotateCcw,
  Clock,
  CheckCircle,
  AlertCircle,
  HardDrive,
  Loader2,
} from 'lucide-react';

interface Backup {
  id: string;
  filename: string;
  filesize: number;
  createdAt: string;
  status: 'COMPLETED' | 'RESTORING' | 'FAILED';
  note: string | null;
  fileExists: boolean;
}

export default function BackupsPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoring, setRestoring] = useState<string | null>(null);
  const [restoreConfirm, setRestoreConfirm] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        if (!sessionData.success || sessionData.data.user.role !== 'ADMIN') {
          router.push('/login');
          return;
        }
        setUser(sessionData.data.user);
        await loadBackups();
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const loadBackups = async () => {
    try {
      const res = await fetch('/api/admin/backups');
      const data = await res.json();
      if (data.success) {
        setBackups(data.data);
      }
    } catch (error) {
      console.error('Error loading backups:', error);
    }
  };

  const handleCreateBackup = async () => {
    setCreating(true);
    try {
      const res = await fetch('/api/admin/backups', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadBackups();
      } else {
        alert(data.error || 'Ошибка создания бэкапа');
      }
    } catch (error) {
      console.error('Error creating backup:', error);
      alert('Ошибка создания бэкапа');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteBackup = async (id: string) => {
    if (!confirm('Удалить этот бэкап?')) return;
    try {
      const res = await fetch(`/api/admin/backups?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await loadBackups();
      } else {
        alert(data.error || 'Ошибка удаления бэкапа');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      alert('Ошибка удаления бэкапа');
    }
  };

  const handleRestoreBackup = async (id: string) => {
    if (!confirm('ВНИМАНИЕ: Это перезапишет текущую базу данных. Продолжить?')) return;
    setRestoreConfirm(null);
    setRestoring(id);
    try {
      const res = await fetch('/api/admin/backups/restore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backupId: id }),
      });
      const data = await res.json();
      if (data.success) {
        alert('База данных успешно восстановлена!');
        await loadBackups();
      } else {
        alert(data.error || 'Ошибка восстановления');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      alert('Ошибка восстановления базы данных');
    } finally {
      setRestoring(null);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' Б';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' КБ';
    return (bytes / (1024 * 1024)).toFixed(1) + ' МБ';
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'RESTORING':
        return <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />;
      case 'FAILED':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'COMPLETED': return 'Готов';
      case 'RESTORING': return 'Восстановление...';
      case 'FAILED': return 'Ошибка';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 text-violet-500 animate-spin" />
          <p className="text-slate-400">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Database className="w-8 h-8 text-violet-400" />
              Бэкапы базы данных
            </h1>
            <p className="text-slate-400 mt-1">Управление резервными копиями базы данных</p>
          </div>
          <Button
            onClick={handleCreateBackup}
            disabled={creating}
            variant="primary"
            className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700"
          >
            {creating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Создание...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 mr-2" />
                Создать бэкап
              </>
            )}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card className="p-4 bg-slate-900/50 border-slate-800">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-violet-400" />
              <div>
                <p className="text-2xl font-bold text-white">{backups.length}</p>
                <p className="text-sm text-slate-400">Всего бэкапов</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-slate-900/50 border-slate-800">
            <div className="flex items-center gap-3">
              <HardDrive className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatFileSize(backups.reduce((sum, b) => sum + b.filesize, 0))}
                </p>
                <p className="text-sm text-slate-400">Общий размер</p>
              </div>
            </div>
          </Card>
          <Card className="p-4 bg-slate-900/50 border-slate-800">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-sm font-medium text-white">
                  {backups.length > 0 ? formatDate(backups[0].createdAt) : '—'}
                </p>
                <p className="text-sm text-slate-400">Последний бэкап</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Backups list */}
        <Card className="bg-slate-900/50 border-slate-800">
          <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-semibold text-white">Список бэкапов</h2>
          </div>

          {backups.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg mb-2">Бэкапов пока нет</p>
              <p className="text-sm">Создайте первый бэкап, нажав кнопку выше</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-slate-800/30 transition-colors"
                >
                  {/* Icon & Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      backup.status === 'COMPLETED' ? 'bg-emerald-500/20' :
                      backup.status === 'RESTORING' ? 'bg-amber-500/20' : 'bg-red-500/20'
                    }`}>
                      {getStatusIcon(backup.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-white truncate">{backup.filename}</p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          backup.status === 'COMPLETED' ? 'bg-emerald-500/20 text-emerald-400' :
                          backup.status === 'RESTORING' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {getStatusLabel(backup.status)}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
                        <span>{formatDate(backup.createdAt)}</span>
                        <span>{formatFileSize(backup.filesize)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {backup.status === 'COMPLETED' && backup.fileExists && (
                      <>
                        <button
                          onClick={() => setRestoreConfirm(backup.id)}
                          disabled={restoring !== null}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm disabled:opacity-50"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Восстановить
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup.id)}
                          disabled={restoring !== null}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {backup.status === 'FAILED' && (
                      <button
                        onClick={() => handleDeleteBackup(backup.id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Restore confirmation modal */}
        {restoreConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full bg-slate-900 border-slate-700">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-6 h-6 text-amber-400" />
                  <h3 className="text-lg font-semibold text-white">Подтверждение восстановления</h3>
                </div>
                <p className="text-slate-300 mb-2">
                  Вы уверены, что хотите восстановить базу данных из этого бэкапа?
                </p>
                <p className="text-red-400 text-sm mb-6">
                  ⚠️ Все текущие данные будут заменены данными из бэкапа!
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleRestoreBackup(restoreConfirm)}
                    variant="primary"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 flex-1"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Восстановить
                  </Button>
                  <Button
                    onClick={() => setRestoreConfirm(null)}
                    variant="ghost"
                    className="flex-1"
                  >
                    Отмена
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
