'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, X, Edit } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isHtml, setIsHtml] = useState(false);
  const [creating, setCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/blog');
      const data = await response.json();
      if (data.success) {
        setPosts(data.data.posts || []);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setCreating(true);
    try {
      const url = editingPost ? `/api/admin/blog?postId=${editingPost.id}` : '/api/admin/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), content: content.trim() }),
      });

      const data = await response.json();
      if (data.success) {
        setTitle('');
        setContent('');
        setIsHtml(false);
        setShowModal(false);
        setEditingPost(null);
        loadPosts();
      } else {
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      console.error('Error creating/updating post:', error);
      alert('Ошибка сохранения поста');
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content);
    setIsHtml(/<[a-z][\s\S]*>/i.test(post.content)); // Определяем, содержит ли HTML
    setShowModal(true);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот пост?')) return;

    try {
      const response = await fetch(`/api/admin/blog?postId=${postId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        loadPosts();
      } else {
        alert('Ошибка: ' + data.error);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Ошибка удаления поста');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Блог</h1>
          <p className="text-slate-400">Управление постами блога</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/25"
        >
          <Plus className="w-5 h-5" />
          Добавить
        </button>
      </div>

      {/* Posts List */}
      <div className="grid gap-4">
        {loading ? (
          <div className="py-12 text-center text-slate-400">
            <div className="flex items-center justify-center gap-3">
              <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
              Загрузка...
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="py-12 text-center text-slate-400">
            <p>Постов пока нет</p>
          </div>
        ) : (
          posts.map((post) => (
            <div
              key={post.id}
              className="rounded-xl border border-slate-800 bg-slate-800/20 backdrop-blur-sm p-6 hover:border-slate-700 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">{post.title}</h3>
                  <div
                    className="text-slate-300 mb-4 line-clamp-3 prose prose-invert prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                  />
                  <p className="text-sm text-slate-500">
                    {new Date(post.createdAt).toLocaleDateString('ru-RU', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 hover:bg-emerald-500/10 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Edit className="w-5 h-5 text-emerald-400" />
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingPost ? 'Редактировать пост' : 'Создать пост'}
                </h3>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingPost(null);
                    setTitle('');
                    setContent('');
                    setIsHtml(false);
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Название
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Введите название поста"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-300">
                      Текст
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isHtml}
                        onChange={(e) => setIsHtml(e.target.checked)}
                        className="w-4 h-4 rounded border-slate-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/50"
                      />
                      <span className="text-sm text-slate-400">HTML формат</span>
                    </label>
                  </div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={isHtml ? "Введите HTML код поста" : "Введите текст поста"}
                    rows={8}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all resize-none font-mono text-sm"
                    required
                  />
                  {isHtml && (
                    <p className="text-xs text-slate-500 mt-2">
                      Используйте HTML теги для форматирования текста
                    </p>
                  )}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingPost(null);
                      setTitle('');
                      setContent('');
                      setIsHtml(false);
                    }}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-xl transition-all"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !title.trim() || !content.trim()}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/25"
                  >
                    {creating ? 'Сохранение...' : (editingPost ? 'Сохранить' : 'Создать')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
