import { format as dateFnsFormat, parse } from 'date-fns';
import { enUS, fr, ar } from 'date-fns/locale';
import { useTranslation } from '../i18n';

const locales = {
  en: enUS,
  fr: fr,
  ar: ar
};

export const useDateFormat = () => {
  const { lang } = useTranslation();
  
  const formatDate = (date: Date | number | undefined | null, formatStr: string) => {
    if (!date) return '-';
    return dateFnsFormat(date, formatStr, { locale: locales[lang] });
  };

  const formatTime = (timeStr: string | undefined | null) => {
    if (!timeStr) return '-';
    try {
      const parsed = parse(timeStr, 'HH:mm', new Date());
      return dateFnsFormat(parsed, 'p', { locale: locales[lang] });
    } catch {
      return timeStr; // fallback if invalid
    }
  };

  return { formatDate, formatTime, lang };
};
