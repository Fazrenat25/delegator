'use client';

import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface NavItem {
  href?: string;
  onClick?: () => void;
  label: string;
  icon: ReactNode;
}

interface SidebarProps {
  items: NavItem[];
  user: {
    firstName: string;
    lastName: string;
    role: string;
  };
  collapsed?: boolean;
  hasUnreadChat?: boolean;
}

export function Sidebar({ items, user, collapsed = false, hasUnreadChat = false }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-y-auto`}>
      {/* Logo */}
      <div className="border-b border-slate-700/50" style={{ height: '73px' }}>
        <Link href="/" className={`flex items-center ${collapsed ? 'justify-center px-4' : 'gap-3 px-6'} h-full hover:bg-slate-800/50 transition-colors`}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                Delegon
              </h1>
              <p className="text-xs text-slate-400">Система делегирования</p>
            </div>
          )}
        </Link>
      </div>

      {/* User Info */}
      {!collapsed && (
        <Link href="/dashboard/settings" className="block px-4 py-4 border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div>
              <p className="font-medium text-sm hover:text-emerald-400 transition-colors">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-slate-400">
                {user.role === 'DIRECTOR' ? 'Директор' : 'Сотрудник'}
              </p>
            </div>
          </div>
        </Link>
      )}
      {collapsed && (
        <Link href="/dashboard/settings" className="block px-4 py-4 border-b border-slate-700/50 hover:bg-slate-800/50 transition-colors text-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold mx-auto">
            {user.firstName[0]}{user.lastName[0]}
          </div>
        </Link>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1">
        {items.map((item) => {
          const isActive = item.href ? pathname === item.href : false;
          const isChat = item.href === '/dashboard/chat';
          const showUnreadIndicator = isChat && hasUnreadChat;

          const content = (
            <>
              <span className={cn('w-5 h-5 flex-shrink-0', isActive ? 'text-emerald-400' : 'text-slate-400')}>
                {item.icon}
              </span>
              {!collapsed && (
                <div className="flex items-center gap-2 flex-1">
                  <span>{item.label}</span>
                  {showUnreadIndicator && (
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse flex-shrink-0"></span>
                  )}
                </div>
              )}
              {collapsed && showUnreadIndicator && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              )}
            </>
          );

          if (item.onClick) {
            return (
              <button
                key={item.label}
                onClick={item.onClick}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                  'text-sm font-medium',
                  collapsed ? 'justify-center' : '',
                  'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                )}
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href || '/'}
              title={collapsed ? item.label : ''}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200',
                'text-sm font-medium',
                collapsed ? 'justify-center' : '',
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                  : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
              )}
            >
              {content}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 border-t border-slate-700/50">
          <p className="text-xs text-slate-500 text-center">
            © 2026 Delegon. Все права защищены.
          </p>
        </div>
      )}
    </aside>
  );
}
