import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Menu, X, Loader2 } from 'lucide-react';

export const AdminLayout = () => {
  const { user, loading } = useAuth();
  const { lang, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-[rgb(var(--color-bg))] text-[rgb(var(--color-text-muted))]">
        <Loader2 size={28} className="animate-spin text-[rgb(var(--color-primary))]" />
        <span className="text-sm font-medium">{t('admin.loading' as any) as string}</span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-[rgb(var(--color-bg))]" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <div
            className="fixed inset-0 bg-zinc-950/50 backdrop-blur-[2px]"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[var(--sidebar-width)] h-full flex flex-col bg-[rgb(var(--color-primary))] shadow-2xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close navigation menu"
              className="absolute top-3.5 end-3 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full z-10"
            >
              <X size={20} />
            </button>
            <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))] sticky top-0 z-20">
          <button
            type="button"
            aria-label="Open navigation menu"
            className="p-4 text-[rgb(var(--color-text))] md:hidden hover:bg-[rgb(var(--color-surface-muted))] min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <TopBar />
          </div>
        </div>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
