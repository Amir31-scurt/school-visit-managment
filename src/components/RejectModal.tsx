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
        preferredDate: request.preferredDate ? dateFnsFormat(request.preferredDate.toDate(), 'PPP', { locale: dateLocales[lang] }) : '',
        reason: reason || ''
      });
      setMessage(filled);
    }
  }, [lang, request, settings, reason]);

  if (!request) return null;

  const onSubmit = async (data: any, action: 'whatsapp' | 'email' | 'none') => {
    try {
      await rejectRequest(request.id, data.reason, user?.uid || '');
      
      if (action === 'whatsapp') {
        openWhatsApp(request.phone, message);
      }
      if (action === 'email') {
        if (request.email) {
          window.open(`mailto:${request.email}?subject=Visit Update&body=${encodeURIComponent(message)}`);
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
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${t('admin.rejectVisit' as any) as string} ${request.schoolName}`}>
      <form>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.rejectionReason' as any) as string}</label>
            <textarea {...register('reason')} dir="auto" className="w-full rounded-md border p-2 text-sm text-start" rows={2} />
          </div>

          <div className="border-t pt-4 mt-4">
            <h4 className="font-semibold mb-2">Message Preview</h4>
            <div className="flex gap-2 mb-2">
              {(['en', 'fr', 'ar'] as const).map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 text-xs rounded-full ${lang === l ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}
                >
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              className="w-full rounded-md border p-2 text-sm text-gray-700 bg-gray-50 h-24 text-start"
              dir="auto"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 mt-6">
          <Button type="button" onClick={handleSubmit((d) => onSubmit(d, 'whatsapp'))} className="bg-green-600 hover:bg-green-700">{t('admin.sendWhatsapp' as any) as string}</Button>
          <Button type="button" onClick={handleSubmit((d) => onSubmit(d, 'email'))} variant="secondary">{t('admin.sendEmail' as any) as string}</Button>
          <div className="flex gap-2 mt-2">
            <Button type="button" onClick={handleSubmit((d) => onSubmit(d, 'none'))} variant="danger" className="flex-1">{t('admin.justReject' as any) as string}</Button>
            <Button type="button" onClick={onClose} variant="ghost" className="flex-1">{t('admin.cancel' as any) as string}</Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
