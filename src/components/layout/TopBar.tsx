import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

export const TopBar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  return (
    <header className="h-16 bg-white border-b flex items-center justify-between px-4 sm:px-6 sticky top-0 z-10">
      <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">{t('admin.portal' as any) as string}</h2>
      <div className="flex items-center gap-4 ms-auto">
        <LanguageSwitcher />
        <div className="flex items-center gap-2 border-s ps-4 ms-2">
          <div className="w-8 h-8 rounded-full bg-[rgb(var(--color-primary-light))] flex items-center justify-center text-white font-bold">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">{user?.email}</span>
        </div>
      </div>
    </header>
  );
};
