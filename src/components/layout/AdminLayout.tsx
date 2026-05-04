import { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Menu, X } from 'lucide-react';


export const AdminLayout = () => {
  const { user, loading } = useAuth();
  const { lang } = useTranslation();
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  if (loading) {
    return <div className="h-screen flex items-center justify-center">{t('admin.loading' as any) as string}</div>;
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
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="relative w-[260px] h-full flex flex-col bg-[rgb(var(--color-primary))]">
            <button onClick={() => setMobileMenuOpen(false)} className="absolute top-4 end-4 text-white">
              <X size={24} />
            </button>
            <Sidebar />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center bg-white border-b sticky top-0 z-10">
          <button 
            className="p-4 text-gray-600 md:hidden hover:bg-gray-50"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>
          <div className="flex-1">
            <TopBar />
          </div>
        </div>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
