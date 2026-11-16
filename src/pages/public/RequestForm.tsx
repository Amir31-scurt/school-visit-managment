import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '../../i18n';
import { startOfDay, parseISO, isBefore, getDay } from 'date-fns';
import { submitPublicRequest } from '../../hooks/useRequests';
import { LanguageSwitcher } from '../../components/shared/LanguageSwitcher';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import logo from '../../assets/logo.png';
import toast from 'react-hot-toast';
import { CheckCircle2, Info, Calendar, Building2, MessageSquareText, ArrowRight } from 'lucide-react';

export const RequestForm = () => {
  const { t, lang } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const todayISO = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      schoolName: '',
      contactPerson: '',
      phone: '',
      email: '',
      numberOfStudents: '' as unknown as number,
      preferredDate: '',
      preferredTime: '',
      communicationLanguage: 'fr',
      notes: '',
    },
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    clearErrors();
  }, [lang, clearErrors]);

  const selectedDate = watch('preferredDate');
  const notesValue = watch('notes') || '';

  const computeTimeBounds = (dateStr?: string) => {
    try {
      if (!dateStr) return { min: '09:00', max: '17:00' };
      const d = parseISO(dateStr);
      const day = getDay(d); // 0 Sun .. 6 Sat
      if (day === 0 || day === 6) return { min: '10:00', max: '18:00' };
      return { min: '09:00', max: '17:00' };
    } catch {
      return { min: '09:00', max: '17:00' };
    }
  };
  const timeBounds = computeTimeBounds(selectedDate);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    let formattedPhone = data.phone.replace(/[\s\-\(\)]/g, '');

    if (!formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('00')) {
        formattedPhone = '+' + formattedPhone.slice(2);
      } else if (formattedPhone.startsWith('221') && formattedPhone.length === 12) {
        formattedPhone = '+' + formattedPhone;
      } else if (
        formattedPhone.length === 9 &&
        (formattedPhone.startsWith('7') || formattedPhone.startsWith('3'))
      ) {
        formattedPhone = '+221' + formattedPhone;
      }
    }

    try {
      await submitPublicRequest({
        ...data,
        phone: formattedPhone,
        numberOfStudents: Number(data.numberOfStudents),
        preferredDate: new Date(data.preferredDate),
      });
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error(error);
      toast.error(t('toast.error' as any) as string);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div
        className="min-h-screen bg-[rgb(var(--color-bg))] flex flex-col items-center justify-center p-4 sm:p-6"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        <div className="w-full max-w-md bg-[rgb(var(--color-surface))] rounded-[var(--radius-lg)] border border-[rgb(var(--color-border))] shadow-sm p-8 text-center">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 size={28} aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))] mb-2">
            {t('form.success.title' as any)}
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-muted))] leading-relaxed mb-8">
            {t('form.success.subtitle' as any)}
          </p>
          <Button
            onClick={() => setIsSuccess(false)}
            variant="outline"
            size="lg"
            className="w-full"
          >
            {t('form.success.again' as any)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[rgb(var(--color-bg))] flex flex-col py-6 sm:py-10 px-4 sm:px-6"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <header className="max-w-2xl w-full mx-auto flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Museum Logo" className="h-11 sm:h-12 w-auto object-contain" />
        </div>
        <LanguageSwitcher />
      </header>

      <main className="max-w-2xl w-full mx-auto bg-[rgb(var(--color-surface))] rounded-[var(--radius-lg)] border border-[rgb(var(--color-border))] shadow-sm overflow-hidden">
        <div className="bg-[rgb(var(--color-primary))] px-6 py-7 sm:px-8 sm:py-8 text-white border-b border-emerald-950/20">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {t('form.title' as any)}
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-xl">
            {t('form.subtitle' as any)}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8 space-y-8" noValidate>
          {/* Section 1: School & Contact */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))] pb-2 border-b border-[rgb(var(--color-border))] w-full">
              <Building2 size={14} aria-hidden="true" />
              <span>{t('admin.school' as any) as string} &amp; {t('admin.contact' as any) as string}</span>
            </legend>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('form.schoolName' as any) as string}
                requiredMark
                autoComplete="organization"
                {...register('schoolName', {
                  required: t('form.error.schoolRequired' as any) as string,
                  minLength: {
                    value: 3,
                    message: t('form.error.tooShort' as any) as string,
                  },
                })}
                error={errors.schoolName?.message as string}
              />
              <Input
                label={t('form.contactPerson' as any) as string}
                requiredMark
                autoComplete="name"
                {...register('contactPerson', {
                  required: t('form.error.contactRequired' as any) as string,
                })}
                error={errors.contactPerson?.message as string}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label={t('form.phone' as any) as string}
                requiredMark
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+221 77 000 00 00"
                {...register('phone', {
                  required: t('form.error.phoneRequired' as any) as string,
                  pattern: {
                    value: /^[0-9+\-\s()]{8,}$/,
                    message: t('form.error.invalidPhone' as any) as string,
                  },
                })}
                error={errors.phone?.message as string}
              />
              <Input
                label={t('form.email' as any) as string}
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="contact@ecole.sn"
                {...register('email', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('form.error.invalidEmail' as any) as string,
                  },
                })}
                error={errors.email?.message as string}
              />
            </div>
          </fieldset>

          {/* Section 2: Visit Schedule */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))] pb-2 border-b border-[rgb(var(--color-border))] w-full">
              <Calendar size={14} aria-hidden="true" />
              <span>{t('admin.date' as any) as string} &amp; {t('form.numberOfStudents' as any) as string}</span>
            </legend>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label={t('form.numberOfStudents' as any) as string}
                requiredMark
                type="number"
                inputMode="numeric"
                min={1}
                max={1000}
                {...register('numberOfStudents', {
                  required: t('form.error.required' as any) as string,
                  min: {
                    value: 1,
                    message: t('form.error.minStudents' as any) as string,
                  },
                  max: {
                    value: 1000,
                    message: t('form.error.maxStudents' as any) as string,
                  },
                  valueAsNumber: true,
                })}
                error={errors.numberOfStudents?.message as string}
              />
              <Input
                label={t('form.preferredDate' as any) as string}
                requiredMark
                type="date"
                min={todayISO}
                {...register('preferredDate', {
                  required: t('form.error.dateRequired' as any) as string,
                  validate: (val: string) => {
                    if (!val) return t('form.error.dateRequired' as any) as string;
                    const selected = parseISO(val);
                    if (isBefore(startOfDay(selected), startOfDay(new Date())))
                      return t('form.error.pastDate' as any) as string;
                    if (getDay(selected) === 1)
                      return t('form.error.closedMonday' as any) as string;
                    return true;
                  },
                })}
                error={errors.preferredDate?.message as string}
              />
              <Input
                label={t('form.preferredTime' as any) as string}
                type="time"
                min={timeBounds.min}
                max={timeBounds.max}
                hint={t('form.timeInfo' as any) as string}
                {...register('preferredTime', {
                  validate: (val: string) => {
                    if (!val) return true;
                    const toMinutes = (s: string) => {
                      const [hh, mm] = s.split(':').map(Number);
                      return hh * 60 + mm;
                    };
                    const v = toMinutes(val);
                    const min = toMinutes(timeBounds.min);
                    const max = toMinutes(timeBounds.max);
                    if (v < min || v > max) return t('form.error.invalidTime' as any) as string;
                    return true;
                  },
                })}
                error={errors.preferredTime?.message as string}
              />
            </div>
          </fieldset>

          {/* Section 3: Communication & Notes */}
          <fieldset className="space-y-4">
            <legend className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))] pb-2 border-b border-[rgb(var(--color-border))] w-full">
              <MessageSquareText size={14} aria-hidden="true" />
              <span>{t('form.communicationLanguage' as any) as string}</span>
            </legend>

            <Select
              label={t('form.communicationLanguage' as any) as string}
              {...register('communicationLanguage')}
              options={[
                { value: 'fr', label: 'Français' },
                { value: 'en', label: 'English' },
                { value: 'ar', label: 'العربية' },
                { value: 'fr', label: 'Wolof' },
              ]}
            />

            <div className="w-full">
              <div className="flex justify-between items-baseline mb-1.5">
                <label
                  htmlFor="visit-notes"
                  className="block text-sm font-medium text-[rgb(var(--color-text))]"
                >
                  {t('form.notes' as any) as string}
                </label>
                <span className="text-xs text-[rgb(var(--color-text-muted))] tabular-nums">
                  {notesValue.length}/500
                </span>
              </div>
              <textarea
                id="visit-notes"
                {...register('notes')}
                dir="auto"
                className="flex w-full rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] bg-white px-3.5 py-2.5 text-sm text-[rgb(var(--color-text))] placeholder:text-zinc-400 transition-colors hover:border-zinc-400 focus:outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/15 text-start"
                rows={3}
                maxLength={500}
              />
            </div>
          </fieldset>

          <div className="bg-[rgb(var(--color-primary-soft))] border border-emerald-200/80 text-emerald-900 px-4 py-3.5 rounded-[var(--radius-sm)] flex items-start gap-3 text-sm">
            <Info size={18} className="text-emerald-700 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="leading-relaxed">{t('form.notice' as any) as string}</p>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            loading={isSubmitting}
          >
            <span>{t('form.submit' as any) as string}</span>
            {!isSubmitting && <ArrowRight size={18} className="rtl:rotate-180" aria-hidden="true" />}
          </Button>
        </form>
      </main>
    </div>
  );
};
