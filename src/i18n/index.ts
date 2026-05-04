import { create } from 'zustand';
import { en } from './en';
import { fr } from './fr';
import { ar } from './ar';
import { Lang } from '../types';

const translations = { en, fr, ar };

interface I18nStore {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

export const useI18nStore = create<I18nStore>((set) => ({
  lang: (localStorage.getItem('lang') as Lang) || 'en',
  setLang: (lang: Lang) => {
    localStorage.setItem('lang', lang);
    set({ lang });
  },
}));

export function useTranslation() {
  const { lang, setLang } = useI18nStore();

  const t = (key: keyof typeof en) => {
    return translations[lang][key] || translations['en'][key] || key;
  };

  return { t, lang, setLang };
}
