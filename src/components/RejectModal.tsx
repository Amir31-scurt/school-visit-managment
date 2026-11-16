import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useSettings } from '../hooks/useSettings';
import { rejectRequest } from '../hooks/useRequests';
import { useAuth } from '../hooks/useAuth';
import { VisitRequest } from '../types';
import { fillTemplate, defaultTemplates } from '../lib/messageTemplates';
import { openWhatsApp } from '../lib/whatsapp';
import toast from 'react-hot-toast';
import { useTranslation } from '../i18n';
import { format as dateFnsFormat } from 'date-fns';
import { enUS, fr, ar } from 'date-fns/locale';
import { MessageCircle, Mail, Copy, Check } from 'lucide-react';

const dateLocales = { en: enUS, fr, ar };

interface Props {
  isOpen: boolean;
  onClose: () => void;
  request: VisitRequest | null;
}

export const RejectModal = ({ isOpen, onClose, request }: Props) => {
  const { settings } = useSettings();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [lang, setLang] = useState<'en' | 'fr' | 'ar'>('en');
  const [message, setMessage] = useState('');
  const [submittingAction, setSubmittingAction] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm();
  const reason = watch('reason');

  useEffect(() => {
    if (request) {
      setLang(request.communicationLanguage);
    }
  }, [request]);

  useEffect(() => {
    if (request && settings) {
      const tpl = settings.messageTemplates[lang]?.rejection || defaultTemplates[lang].rejection;
      const filled = fillTemplate(tpl, {
        contactPerson: request.contactPerson,
        schoolName: request.schoolName,
        preferredDate: request.preferredDate
          ? dateFnsFormat(request.preferredDate.toDate(), 'PPP', { locale: dateLocales[lang] })
          : '',
        reason: reason || '',
      });
      setMessage(filled);
    }
  }, [lang, request, settings, reason]);

  if (!request) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Copy failed');
    }
  };

  const onSubmit = async (data: any, action: 'whatsapp' | 'email' | 'none') => {
    setSubmittingAction(action);
    try {
      await rejectRequest(request.id, data.reason, user?.uid || '');

      if (action === 'whatsapp') {
        openWhatsApp(request.phone, message);
      }
      if (action === 'email') {
        if (request.email) {
          window.open(
            `mailto:${request.email}?subject=Visit Update&body=${encodeURIComponent(message)}`
          );
        } else {
          toast.error(t('toast.noEmail' as any) as string);
        }
      }

      toast.success(t('toast.rejected' as any) as string);
      onClose();
      reset();
    } catch (err) {
      console.error(err);
      toast.error(t('toast.error' as any) as string);
    } finally {
      setSubmittingAction(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${t('admin.rejectVisit' as any) as string} ${request.schoolName}`}
      subtitle={request.contactPerson}
    >
      <form className="space-y-4">
        <div>
          <label
            htmlFor="reject-reason"
            className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1.5 text-start"
          >
            {t('admin.rejectionReason' as any) as string}
          </label>
          <textarea
            id="reject-reason"
            {...register('reason')}
            dir="auto"
            className="w-full rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] bg-white p-2.5 text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/15 text-start"
            rows={2}
          />
        </div>

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

        <div className="flex flex-col gap-2 pt-2">
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
              variant="danger"
              loading={submittingAction === 'none'}
              disabled={!!submittingAction}
              onClick={handleSubmit((d) => onSubmit(d, 'none'))}
            >
              <span>{t('admin.justReject' as any) as string}</span>
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
        </div>
      </form>
    </Modal>
  );
};
