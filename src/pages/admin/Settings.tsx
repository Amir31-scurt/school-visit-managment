import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useTranslation } from '../../i18n';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

export const Settings = () => {
  const { settings, loading, updateSettings } = useSettings();
  const { t } = useTranslation();
  const [capacity, setCapacity] = useState({ maxSchoolsPerDay: 3, maxStudentsPerDay: 150 });
  const [langTab, setLangTab] = useState<'en' | 'fr' | 'ar' | 'wo'>('en');
  const [templates, setTemplates] = useState({ 
    en: { confirmation: '', rejection: '' }, 
    fr: { confirmation: '', rejection: '' }, 
    ar: { confirmation: '', rejection: '' },
    wo: { confirmation: '', rejection: '' } 
  });

  useEffect(() => {
    if (settings) {
      setCapacity(settings.capacity);
      setTemplates(settings.messageTemplates);
    }
  }, [settings]);

  if (loading) return <div>Loading...</div>;

  const handleSaveCapacity = async () => {
    await updateSettings({ capacity });
    toast.success(t('toast.capacitySaved' as any) as string);
  };

  const handleSaveTemplates = async () => {
    await updateSettings({ messageTemplates: templates });
    toast.success(t('toast.templatesSaved' as any) as string);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold">{t('nav.settings' as any) as string}</h1>

      <Card>
        <h2 className="text-xl font-semibold mb-4">{t('admin.capacitySettings' as any) as string}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Input
            label={t('admin.maxSchools' as any) as string}
            type="number"
            value={capacity.maxSchoolsPerDay}
            onChange={(e) => setCapacity({ ...capacity, maxSchoolsPerDay: Number(e.target.value) })}
          />
          <Input
            label={t('admin.maxStudents' as any) as string}
            type="number"
            value={capacity.maxStudentsPerDay}
            onChange={(e) => setCapacity({ ...capacity, maxStudentsPerDay: Number(e.target.value) })}
          />
        </div>
        <Button onClick={handleSaveCapacity}>{t('admin.save' as any) as string}</Button>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold mb-4">{t('admin.messageTemplates' as any) as string}</h2>
        
        <div className="flex border-b mb-6 overflow-x-auto">
          {(['en', 'fr', 'ar', 'wo'] as const).map(l => (
            <button
              key={l}
              onClick={() => setLangTab(l)}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${
                langTab === l ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {l === 'en' ? 'English' : l === 'fr' ? 'Français' : l === 'wo' ? 'Wolof' : 'العربية'}
            </button>
          ))}
        </div>

        <div className="space-y-6" dir={langTab === 'ar' ? 'rtl' : 'ltr'}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.confirmationMessage' as any) as string}</label>
            <textarea
              value={templates[langTab].confirmation}
              onChange={(e) => setTemplates({ ...templates, [langTab]: { ...templates[langTab], confirmation: e.target.value } })}
              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-start"
              rows={4}
              dir="auto"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">{t('admin.rejectionMessage' as any) as string}</label>
            <textarea
              value={templates[langTab].rejection}
              onChange={(e) => setTemplates({ ...templates, [langTab]: { ...templates[langTab], rejection: e.target.value } })}
              className="w-full rounded-md border border-gray-300 p-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-start"
              rows={4}
              dir="auto"
            />
          </div>
          <div className="bg-gray-50 p-4 rounded-lg border text-sm text-gray-600 font-mono" dir="ltr">
            Variables: {`{{contactPerson}} {{schoolName}} {{confirmedDate}} {{confirmedTime}} {{numberOfStudents}} {{preferredDate}}`}
          </div>
          <Button onClick={handleSaveTemplates}>{t('admin.save' as any) as string}</Button>
        </div>
      </Card>
    </div>
  );
};
