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
import { fillTemplate } from '../lib/messageTemplates';
import { openWhatsApp, buildWhatsAppLink } from '../lib/whatsapp';
import toast from 'react-hot-toast';
import { useTranslation } from '../i18n';
import { useDateFormat } from '../hooks/useDateFormat';
import { format as dateFnsFormat } from 'date-fns';
import { enUS, fr, ar } from 'date-fns/locale';

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
  const { formatDate } = useDateFormat();
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [lang, setLang] = useState<'en' | 'fr' | 'ar' | 'wo'>('en');
  const [tariff, setTariff] = useState<'900' | '700'>('900');
  const [message, setMessage] = useState('');
  
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm();
  
  const dateStr = watch('confirmedDate');
  const timeStr = watch('confirmedTime');
  const parsedDate = dateStr ? new Date(dateStr) : new Date();
  
  const requestsOnDate = useRequestsByDate(parsedDate);

  useEffect(() => {
    if (request) {
      setLang(request.communicationLanguage);
      if (request.preferredDate) {
        // try to prefill date
        const d = request.preferredDate.toDate();
        setValue('confirmedDate', d.toISOString().split('T')[0]);
      }
      setValue('confirmedTime', request.preferredTime || '');
      setValue('numberOfStudents', request.numberOfStudents);
    }
  }, [request, setValue]);

  useEffect(() => {
    if (request && settings) {
      const tpl = settings.messageTemplates[lang]?.confirmation || '';
      const filled = fillTemplate(tpl, {
        contactPerson: request.contactPerson,
        schoolName: request.schoolName,
        confirmedDate: dateStr ? dateFnsFormat(new Date(dateStr), 'PPP', { locale: dateLocales[lang] }) : '',
        confirmedTime: timeStr,
        numberOfStudents: watch('numberOfStudents') || request.numberOfStudents,
        preferredDate: request.preferredDate ? dateFnsFormat(request.preferredDate.toDate(), 'PPP', { locale: dateLocales[lang as 'en' | 'fr' | 'ar'] || fr }) : '',
        tariff: tariff
      });
      setMessage(filled);
    }
  }, [lang, request, settings, dateStr, timeStr, tariff, watch('numberOfStudents')]);

  if (!request) return null;

  const currentSchools = requestsOnDate.length;
  const currentStudents = requestsOnDate.reduce((acc, r) => acc + Number(r.numberOfStudents || 0), 0);

  const onSubmit = async (data: any, action: 'whatsapp' | 'email' | 'both' | 'just_approve') => {
    try {
      const confirmedDate = new Date(data.confirmedDate);
      await approveRequest(request.id, confirmedDate, data.confirmedTime, data.internalNotes, user?.uid || '', Number(data.numberOfStudents));
      
      if (action === 'whatsapp' || action === 'both') {
        openWhatsApp(request.phone, message);
      }
      if (action === 'email' || action === 'both') {
        if (request.email) {
          window.open(`mailto:${request.email}?subject=Visit Confirmation&body=${encodeURIComponent(message)}`);
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
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={request.status === 'pending' ? `${t('admin.approveVisit' as any) as string} ${request.schoolName}` : `${t('admin.viewDetails' as any) as string} - ${request.schoolName}`}>
      <form>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label={t('admin.confirmedDate' as any) as string} 
              type="date" 
              {...register('confirmedDate', { required: 'Date is required' })} 
              error={errors.confirmedDate?.message as string} 
              disabled={request.status !== 'pending'}
            />
            <Input 
              label={t('admin.confirmedTime' as any) as string} 
              type="time" 
              {...register('confirmedTime', { required: 'Time is required' })} 
              error={errors.confirmedTime?.message as string} 
              disabled={request.status !== 'pending'}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              label={t('form.numberOfStudents' as any) as string} 
              type="number" 
              {...register('numberOfStudents', { required: 'Required', min: 1 })} 
              error={errors.numberOfStudents?.message as string} 
              disabled={request.status !== 'pending'}
            />
            <div className="flex flex-col">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tarif (FCFA)</label>
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {(['900', '700'] as const).map(v => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setTariff(v)}
                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${tariff === v ? 'bg-white shadow text-emerald-600' : 'text-gray-500'}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {request.status === 'pending' && (
            <CapacityWarning 
              currentSchools={currentSchools} 
              currentStudents={currentStudents} 
              maxSchools={settings?.capacity.maxSchoolsPerDay || 3} 
              maxStudents={settings?.capacity.maxStudentsPerDay || 150} 
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.internalNotes' as any) as string}</label>
            <textarea {...register('internalNotes')} dir="auto" className="w-full rounded-md border p-2 text-sm disabled:bg-gray-50 text-start" rows={2} disabled={request.status !== 'pending'} />
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
          {request.status === 'pending' ? (
            <>
              <Button type="button" onClick={handleSubmit((d) => onSubmit(d, 'whatsapp'))} className="bg-green-600 hover:bg-green-700">{t('admin.sendWhatsapp' as any) as string}</Button>
              <Button type="button" onClick={handleSubmit((d) => onSubmit(d, 'email'))} variant="secondary">{t('admin.sendEmail' as any) as string}</Button>
              <div className="flex gap-2 mt-2">
                <Button type="button" onClick={handleSubmit((d) => onSubmit(d, 'just_approve'))} variant="ghost" className="flex-1">{t('admin.justApprove' as any) as string}</Button>
                <Button type="button" onClick={onClose} variant="ghost" className="flex-1">{t('admin.cancel' as any) as string}</Button>
              </div>
            </>
          ) : (
            <Button type="button" onClick={onClose} className="w-full">{t('admin.cancel' as any) as string}</Button>
          )}
        </div>
      </form>
    </Modal>
  );
};
