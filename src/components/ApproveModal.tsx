import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './ui/Modal';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { CapacityWarning } from './shared/CapacityWarning';
import { useSettings } from '../hooks/useSettings';
import { useRequestsByDate, approveRequest } from '../hooks/useRequests';
import { useAuth } from '../hooks/useAuth';
import { VisitRequest } from '../types';
import { fillTemplate, defaultTemplates } from '../lib/messageTemplates';
import { openWhatsApp } from '../lib/whatsapp';
import toast from 'react-hot-toast';
import { useTranslation } from '../i18n';
import { format as dateFnsFormat } from 'date-fns';
import { enUS, fr, ar } from 'date-fns/locale';
import { MessageCircle, Mail, Copy, Check, Users, Phone } from 'lucide-react';

const dateLocales = { en: enUS, fr, ar };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: VisitRequest | null;
}

export const ApproveModal = ({ isOpen, onClose, request }: Props) => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [lang, setLang] = useState<'en' | 'fr' | 'ar'>('en');
  const [tariff, setTariff] = useState<'900' | '700'>('900');
  const [message, setMessage] = useState('');
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const dateStr = watch('confirmedDate');
  const timeStr = watch('confirmedTime');
  const studentsVal = watch('numberOfStudents');
  const parsedDate = dateStr ? new Date(dateStr) : new Date();

  const requestsOnDate = useRequestsByDate(parsedDate);

  useEffect(() => {
    if (request) {
      setLang(request.communicationLanguage);
      if (request.preferredDate) {
        const d = request.preferredDate.toDate();
        setValue('confirmedDate', d.toISOString().split('T')[0]);
      }
      setValue('confirmedTime', request.preferredTime || '');
      setValue('numberOfStudents', request.numberOfStudents);
      setValue('internalNotes', request.internalNotes || '');
    }
  }, [request, setValue]);

  useEffect(() => {
    if (request && settings) {
      const tpl =
        settings.messageTemplates[lang]?.confirmation ||
        defaultTemplates[lang].confirmation;
      const filled = fillTemplate(tpl, {
        contactPerson: request.contactPerson,
        schoolName: request.schoolName,
        confirmedDate: dateStr
          ? dateFnsFormat(new Date(dateStr + 'T00:00:00'), 'PPP', { locale: dateLocales[lang] })
          : '',
        confirmedTime: timeStr || '',
        numberOfStudents: studentsVal || request.numberOfStudents,
        preferredDate: request.preferredDate
          ? dateFnsFormat(request.preferredDate.toDate(), 'PPP', {
              locale: dateLocales[lang],
            })
          : '',
        tariff,
      });
      setMessage(filled);
    }
  }, [lang, request, settings, dateStr, timeStr, tariff, studentsVal]);

  if (!request) return null;

  const currentSchools = requestsOnDate.length;
  const currentStudents = requestsOnDate.reduce(
    (acc, r) => acc + Number(r.numberOfStudents || 0),
    0
  );

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Copy failed');
    }
  };

  const onSubmit = async (
    data: any,
    action: 'whatsapp' | 'email' | 'both' | 'just_approve'
  ) => {
    setSubmittingAction(action);
    try {
      const confirmedDate = new Date(data.confirmedDate + 'T00:00:00');
      await approveRequest(
        request.id,
        confirmedDate,
        data.confirmedTime,
        data.internalNotes,
        user?.uid || '',
        Number(data.numberOfStudents)
      );

      if (action === 'whatsapp' || action === 'both') {
        openWhatsApp(request.phone, message);
      }
      if (action === 'email' || action === 'both') {
        if (request.email) {
          window.open(
            `mailto:${request.email}?subject=Visit Confirmation&body=${encodeURIComponent(message)}`
          );
        } else {
          toast.error(t('toast.noEmail' as any) as string);
        }
      }

      toast.success(t('toast.approved' as any) as string);
      onClose();
      reset();
    } catch (err) {
      console.error(err);
      toast.error(t('toast.error' as any) as string);
    } finally {
      setSubmittingAction(null);
    }
  };

  const isPending = request.status === 'pending';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        isPending
          ? `${t('admin.approveVisit' as any) as string} ${request.schoolName}`
          : `${t('admin.viewDetails' as any) as string} — ${request.schoolName}`
      }
      subtitle={request.contactPerson}
    >
      {/* Request context strip */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 px-3.5 py-2.5 mb-4 rounded-[var(--radius-sm)] bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-xs text-[rgb(var(--color-text-muted))]">
        <span className="inline-flex items-center gap-1.5 font-medium text-[rgb(var(--color-text))]">
          <Phone size={13} aria-hidden="true" />
          <span dir="ltr">{request.phone}</span>
        </span>
        <span className="inline-flex items-center gap-1.5 font-medium text-[rgb(var(--color-text))]">
          <Users size={13} aria-hidden="true" />
          <span>{request.numberOfStudents} {t('admin.students' as any) as string}</span>
        </span>
      </div>

      <form className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label={t('admin.confirmedDate' as any) as string}
            type="date"
            {...register('confirmedDate', { required: 'Date is required' })}
            error={errors.confirmedDate?.message as string}
            disabled={!isPending}
          />
          <Input
            label={t('admin.confirmedTime' as any) as string}
            type="time"
            {...register('confirmedTime', { required: 'Time is required' })}
            error={errors.confirmedTime?.message as string}
            disabled={!isPending}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <Input
            label={t('form.numberOfStudents' as any) as string}
            type="number"
            inputMode="numeric"
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
            })}
            error={errors.numberOfStudents?.message as string}
            disabled={!isPending}
          />

          <div className="flex flex-col">
            <span className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 text-start">
              Tarif (FCFA)
            </span>
            <div
              role="group"
              aria-label="Tarif FCFA"
              className="flex bg-[rgb(var(--color-surface-muted))] p-1 rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] min-h-[42px]"
            >
              {(['900', '700'] as const).map((v) => (
                <button
                  key={v}
                  type="button"
                  disabled={!isPending}
                  aria-pressed={tariff === v}
                  onClick={() => setTariff(v)}
                  className={`flex-1 py-1 text-sm font-semibold rounded-[6px] transition-all cursor-pointer disabled:cursor-not-allowed ${
                    tariff === v
                      ? 'bg-white shadow-xs text-[rgb(var(--color-primary))]'
                      : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </div>

        {isPending && (
          <CapacityWarning
            currentSchools={currentSchools}
            currentStudents={currentStudents}
            maxSchools={settings?.capacity.maxSchoolsPerDay || 3}
            maxStudents={settings?.capacity.maxStudentsPerDay || 150}
          />
        )}

        <div>
          <label
            htmlFor="approve-internal-notes"
            className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 text-start"
          >
            {t('admin.internalNotes' as any) as string}
          </label>
          <textarea
            id="approve-internal-notes"
            {...register('internalNotes')}
            dir="auto"
            className="w-full rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] bg-white p-2.5 text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/15 disabled:bg-[rgb(var(--color-surface-muted))] text-start"
            rows={2}
            disabled={!isPending}
          />
        </div>

        {isPending && (
          <div className="border-t border-[rgb(var(--color-border))] pt-4">
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-1.5">
                {(['fr', 'en', 'ar'] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    aria-pressed={lang === l}
                    onClick={() => setLang(l)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full transition-colors cursor-pointer ${
                      lang === l
                        ? 'bg-[rgb(var(--color-primary-soft))] text-[rgb(var(--color-primary))] border border-emerald-200'
                        : 'bg-[rgb(var(--color-surface-muted))] text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
                    }`}
                  >
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] px-2 py-1 rounded hover:bg-[rgb(var(--color-surface-muted))] transition-colors cursor-pointer"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              aria-label="Message preview"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] p-3 text-sm text-[rgb(var(--color-text))] bg-[rgb(var(--color-bg))]/60 h-28 focus:outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/15 text-start leading-relaxed"
              dir="auto"
            />
          </div>
        )}

        <div className="flex flex-col gap-2 pt-2">
          {isPending ? (
            <>
              <Button
                type="button"
                size="lg"
                loading={submittingAction === 'whatsapp'}
                disabled={!!submittingAction}
                onClick={handleSubmit((d) => onSubmit(d, 'whatsapp'))}
                className="w-full bg-[#15803D] hover:bg-[#166534]"
              >
                <MessageCircle size={18} aria-hidden="true" />
                <span>{t('admin.sendWhatsapp' as any) as string}</span>
              </Button>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  loading={submittingAction === 'email'}
                  disabled={!!submittingAction}
                  onClick={handleSubmit((d) => onSubmit(d, 'email'))}
                >
                  <Mail size={15} aria-hidden="true" />
                  <span>{t('admin.sendEmail' as any) as string}</span>
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  loading={submittingAction === 'just_approve'}
                  disabled={!!submittingAction}
                  onClick={handleSubmit((d) => onSubmit(d, 'just_approve'))}
                >
                  <span>{t('admin.justApprove' as any) as string}</span>
                </Button>
              </div>
              <Button
                type="button"
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="w-full text-[rgb(var(--color-text-muted))]"
              >
                {t('admin.cancel' as any) as string}
              </Button>
            </>
          ) : (
            <Button type="button" onClick={onClose} variant="outline" className="w-full">
              {t('admin.cancel' as any) as string}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};
