import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  return new Date(date).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'LOW':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'MEDIUM':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'HIGH':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'URGENT':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'PENDING':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    case 'IN_PROGRESS':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'COMPLETED':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'CANCELLED':
      return 'bg-red-100 text-red-700 border-red-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export function getRoleColor(role: string): string {
  switch (role) {
    case 'DIRECTOR':
      return 'bg-gradient-to-r from-amber-600 to-amber-800 text-white';
    case 'EMPLOYEE':
      return 'bg-gradient-to-r from-slate-600 to-slate-800 text-white';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
