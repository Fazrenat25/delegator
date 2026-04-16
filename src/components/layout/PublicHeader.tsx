'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, User, Shield } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: string;
}

export function PublicHeader() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.success) {
          setIsLoggedIn(true);
          setUser(data.data.user);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking session:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setIsLoggedIn(false);
    setUser(null);
    router.push('/');
  };

  return (
    <header className="border-b border-slate-800/50 sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group inline-flex">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:shadow-emerald-500/40 transition-all">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Delegon</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-4">
            {loading ? (
              <div className="w-20 h-10 bg-slate-800 rounded-lg animate-pulse"></div>
            ) : isLoggedIn && user ? (
              <div className="flex items-center gap-3">
                {/* Admin Panel Link */}
                {user.role === 'ADMIN' ? (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-violet-500 to-violet-600 text-white font-medium rounded-lg hover:from-violet-600 hover:to-violet-700 transition-all shadow-lg shadow-violet-500/25 text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    Админ-панель
                  </Link>
                ) : (
                  /* Dashboard Button for non-admin users */
                  <Link
                    href="/dashboard"
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 text-sm sm:text-base"
                  >
                    Личный кабинет
                  </Link>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
                  title="Выйти"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-slate-400 hover:text-white transition-colors font-medium text-sm"
                >
                  Войти
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg hover:from-emerald-400 hover:to-teal-500 transition-all shadow-lg shadow-emerald-500/25 text-sm sm:text-base"
                >
                  Регистрация
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
