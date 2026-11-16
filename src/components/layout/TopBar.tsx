import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { LanguageSwitcher } from '../shared/LanguageSwitcher';

export const TopBar = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <header className="h-16 bg-[rgb(var(--color-surface))] flex items-center justify-between px-4 sm:px-6">
      <h2 className="text-base sm:text-lg font-semibold text-[rgb(var(--color-text))] hidden sm:block truncate">
        {t('admin.portal' as any) as string}
      </h2>
      <div className="flex items-center gap-3 sm:gap-4 ms-auto">
        <LanguageSwitcher />
        <div className="flex items-center gap-2.5 border-s border-[rgb(var(--color-border))] ps-3 sm:ps-4">
          <div
            aria-hidden="true"
            className="w-8 h-8 rounded-full bg-[rgb(var(--color-primary))] flex items-center justify-center text-white text-xs font-bold shrink-0"
          >
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <span className="text-sm font-medium text-[rgb(var(--color-text))] hidden md:block max-w-[200px] truncate">
            {user?.email}
          </span>
        </div>
      </div>
    </header>
  );
};
