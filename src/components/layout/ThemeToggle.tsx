'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
      title={theme === 'light' ? 'Тёмная тема' : 'Светлая тема'}
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5 text-slate-400" />
      ) : (
        <Sun className="w-5 h-5 text-slate-400" />
      )}
    </button>
  );
}
