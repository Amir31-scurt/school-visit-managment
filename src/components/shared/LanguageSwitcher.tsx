import { useTranslation } from '../../i18n';
import { Lang } from '../../types';
import { Globe } from 'lucide-react';

export const LanguageSwitcher = () => {
  const { lang, setLang } = useTranslation();

  const languages: { code: Lang; label: string }[] = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' },
  ];

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-0.5 bg-[rgb(var(--color-surface-muted))] p-1 rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))]"
    >
      <Globe size={14} className="text-[rgb(var(--color-text-muted))] mx-1.5 hidden sm:block" aria-hidden="true" />
      {languages.map((l) => {
        const active = lang === l.code;
        return (
          <button
            key={l.code}
            type="button"
            aria-pressed={active}
            onClick={() => setLang(l.code)}
            className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold transition-all min-h-[28px] cursor-pointer ${
              active
                ? 'bg-white shadow-xs text-[rgb(var(--color-primary))]'
                : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
};
