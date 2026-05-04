import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from '../../i18n';
import { submitPublicRequest } from '../../hooks/useRequests';
import { LanguageSwitcher } from '../../components/shared/LanguageSwitcher';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import logo from '../../assets/logo.png';
import { Lang } from '../../types';
import toast from 'react-hot-toast';

export const RequestForm = () => {
  const { t, lang } = useTranslation();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, clearErrors, formState: { errors } } = useForm();

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    clearErrors();
  }, [lang, clearErrors]);

  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      await submitPublicRequest({
        ...data,
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
      <div className="min-h-screen flex flex-col items-center justify-center p-6" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center border">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('form.success.title' as any)}</h2>
          <p className="text-gray-600 mb-8">{t('form.success.subtitle' as any)}</p>
          <Button onClick={() => setIsSuccess(false)} variant="secondary" className="w-full">
            {t('form.success.again' as any)}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col py-10 px-4 sm:px-6 lg:px-8" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl w-full mx-auto flex justify-between items-center mb-8">
        <img src={logo} alt="Logo" className="h-16 object-contain" />
        <LanguageSwitcher />
      </div>

      <div className="max-w-2xl w-full mx-auto bg-white rounded-2xl shadow-xl border overflow-hidden">
        <div className="bg-[rgb(var(--color-primary))] p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">{t('form.title' as any)}</h2>
          <p className="text-primary-100 opacity-90">{t('form.subtitle' as any)}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('form.schoolName' as any) as string}
              {...register('schoolName', { 
                required: t('form.error.schoolRequired' as any) as string,
                minLength: { value: 3, message: t('form.error.tooShort' as any) as string }
              })}
              error={errors.schoolName?.message as string}
            />
            <Input
              label={t('form.contactPerson' as any) as string}
              {...register('contactPerson', { required: t('form.error.contactRequired' as any) as string })}
              error={errors.contactPerson?.message as string}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label={t('form.phone' as any) as string}
              type="tel"
              {...register('phone', { 
                required: t('form.error.phoneRequired' as any) as string,
                pattern: { value: /^[0-9+\-\s()]+$/, message: t('form.error.invalidPhone' as any) as string },
                minLength: { value: 8, message: t('form.error.tooShort' as any) as string } 
              })}
              error={errors.phone?.message as string}
            />
            <Input
              label={t('form.email' as any) as string}
              type="email"
              {...register('email', {
                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: t('form.error.invalidEmail' as any) as string }
              })}
              error={errors.email?.message as string}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Input
              label={t('form.numberOfStudents' as any) as string}
              type="number"
              {...register('numberOfStudents', { 
                required: t('form.error.required' as any) as string, 
                min: { value: 1, message: t('form.error.minStudents' as any) as string },
                valueAsNumber: true
              })}
              error={errors.numberOfStudents?.message as string}
            />
            <Input
              label={t('form.preferredDate' as any) as string}
              type="date"
              {...register('preferredDate', { required: t('form.error.dateRequired' as any) as string })}
              error={errors.preferredDate?.message as string}
            />
            <Input
              label={t('form.preferredTime' as any) as string}
              type="time"
              {...register('preferredTime')}
            />
          </div>

          <Select
            label={t('form.communicationLanguage' as any) as string}
            {...register('communicationLanguage')}
            options={[
              { value: 'en', label: 'English' },
              { value: 'fr', label: 'Français' },
              { value: 'ar', label: 'العربية' },
            ]}
          />

          <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('form.notes' as any) as string}</label>
            <textarea
              {...register('notes')}
              dir="auto"
              className="flex w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-primary))] text-start"
              rows={3}
              maxLength={500}
            />
          </div>

          <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-sm">
            ℹ️ {t('form.notice' as any) as string}
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? '...' : t('form.submit' as any) as string}
          </Button>
        </form>
      </div>
    </div>
  );
};
