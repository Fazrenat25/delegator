import { Suspense } from 'react';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400">Загрузка...</p>
      </div>
    </div>
  }>{children}</Suspense>;
}
