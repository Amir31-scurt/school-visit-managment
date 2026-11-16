import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard,
  Inbox,
  Calendar as CalendarIcon,
  History,
  Settings,
  LogOut,
} from 'lucide-react';
import logo from '../../assets/logo.png';
import { useRequests } from '../../hooks/useRequests';

export const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { requests: pending } = useRequests({ status: 'pending' });
  const pendingCount = pending.length;

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      icon: <LayoutDashboard size={18} aria-hidden="true" />,
      label: t('nav.dashboard'),
    },
    {
      to: '/admin/requests',
      icon: <Inbox size={18} aria-hidden="true" />,
      label: t('nav.requests'),
      badge: pendingCount > 0 ? pendingCount : undefined,
    },
    {
      to: '/admin/calendar',
      icon: <CalendarIcon size={18} aria-hidden="true" />,
      label: t('nav.calendar'),
    },
    {
      to: '/admin/visits',
      icon: <History size={18} aria-hidden="true" />,
      label: t('nav.visits'),
    },
    {
      to: '/admin/settings',
      icon: <Settings size={18} aria-hidden="true" />,
      label: t('nav.settings'),
    },
  ];

  return (
    <aside className="w-[var(--sidebar-width)] bg-[rgb(var(--color-primary))] text-white h-screen flex flex-col shrink-0 sticky top-0 border-e border-emerald-950/20">
      <div className="px-5 h-16 border-b border-white/10 flex items-center gap-3">
        <div className="bg-white/95 p-1.5 rounded-lg shrink-0">
          <img src={logo} alt="Museum Logo" className="h-8 w-auto object-contain" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold tracking-tight text-white truncate">
            {t('admin.portal' as any) as string}
          </p>
          <p className="text-[11px] text-emerald-200/80 truncate">School Visits</p>
        </div>
      </div>

      <nav aria-label="Admin Navigation" className="flex-1 py-4 flex flex-col gap-1 px-3 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[var(--radius-sm)] text-sm transition-colors min-h-[42px] ${
                isActive
                  ? 'bg-white/15 text-white font-semibold shadow-xs'
                  : 'text-emerald-100/80 hover:bg-white/10 hover:text-white font-medium'
              }`
            }
          >
            <span className="flex items-center gap-3 min-w-0">
              {item.icon}
              <span className="truncate">{item.label as React.ReactNode}</span>
            </span>
            {item.badge !== undefined && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-400 text-zinc-950 tabular-nums">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-medium text-emerald-100/80 hover:text-white hover:bg-white/10 rounded-[var(--radius-sm)] transition-colors min-h-[42px] cursor-pointer"
        >
          <LogOut size={18} aria-hidden="true" />
          <span>{t('admin.logout') as React.ReactNode}</span>
        </button>
      </div>
    </aside>
  );
};
