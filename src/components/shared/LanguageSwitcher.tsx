import { useTranslation } from '../../i18n';
import { Lang } from '../../types';

export const LanguageSwitcher = () => {
  const { lang, setLang } = useTranslation();

  const languages: { code: Lang; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'fr', label: 'FR' },
    { code: 'ar', label: 'AR' }
  ];

  return (
    <div className="flex gap-2 bg-white/50 backdrop-blur-sm p-1 rounded-lg border">
      {languages.map((l) => (
        <button
          key={l.code}
          onClick={() => setLang(l.code)}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
            lang === l.code ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-600 hover:bg-white/60'
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
};
