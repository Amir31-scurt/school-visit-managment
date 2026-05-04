import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { LayoutDashboard, Inbox, Calendar as CalendarIcon, History, Settings, LogOut } from 'lucide-react';
import logo from '../../assets/logo.png';

export const Sidebar = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <LayoutDashboard size={20} />, label: t('nav.dashboard') },
    { to: '/admin/requests', icon: <Inbox size={20} />, label: t('nav.requests') },
    { to: '/admin/calendar', icon: <CalendarIcon size={20} />, label: t('nav.calendar') },
    { to: '/admin/visits', icon: <History size={20} />, label: t('nav.visits') },
    { to: '/admin/settings', icon: <Settings size={20} />, label: t('nav.settings') },
  ];

  return (
    <aside className="w-[var(--sidebar-width)] bg-[rgb(var(--color-primary))] text-white h-screen flex flex-col shrink-0 sticky top-0">
      <div className="p-6 border-b border-white/10 flex items-center justify-center">
        <img src={logo} alt="Logo" className="h-12 object-contain bg-white/10 p-2 rounded-xl backdrop-blur-sm" />
      </div>
      <nav className="flex-1 py-6 flex flex-col gap-2 px-4">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? 'bg-white/10 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {item.icon}
            {item.label as React.ReactNode}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          {t('admin.logout') as React.ReactNode}
        </button>
      </div>
    </aside>
  );
};
