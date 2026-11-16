import { useState, useEffect } from 'react';
import { useSettings } from '../../hooks/useSettings';
import { useTranslation } from '../../i18n';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Skeleton } from '../../components/ui/Skeleton';
import { defaultTemplates } from '../../lib/messageTemplates';
import toast from 'react-hot-toast';
import { Save, RotateCcw } from 'lucide-react';

const TEMPLATE_VARIABLES = [
  '{{contactPerson}}',
  '{{schoolName}}',
  '{{confirmedDate}}',
  '{{confirmedTime}}',
  '{{numberOfStudents}}',
  '{{preferredDate}}',
  '{{tariff}}',
];

export const Settings = () => {
  const { settings, loading, updateSettings } = useSettings();
  const { t } = useTranslation();
  const [capacity, setCapacity] = useState({ maxSchoolsPerDay: 3, maxStudentsPerDay: 150 });
  const [langTab, setLangTab] = useState<'en' | 'fr' | 'ar'>('fr');
  const [savingCapacity, setSavingCapacity] = useState(false);
  const [savingTemplates, setSavingTemplates] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const [templates, setTemplates] = useState({
    en: { confirmation: '', rejection: '' },
    fr: { confirmation: '', rejection: '' },
    ar: { confirmation: '', rejection: '' },
  });

  useEffect(() => {
    if (settings) {
      setCapacity(settings.capacity);
      setTemplates(settings.messageTemplates);
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl" aria-busy="true">
        <Skeleton className="h-8 w-40" />
        <Card className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </Card>
        <Card className="space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-48 w-full" />
        </Card>
      </div>
    );
  }

  const handleSaveCapacity = async () => {
    setSavingCapacity(true);
    try {
      await updateSettings({ capacity });
      toast.success(t('toast.capacitySaved' as any) as string);
    } finally {
      setSavingCapacity(false);
    }
  };

  const handleSaveTemplates = async () => {
    setSavingTemplates(true);
    try {
      await updateSettings({ messageTemplates: templates });
      toast.success(t('toast.templatesSaved' as any) as string);
    } finally {
      setSavingTemplates(false);
    }
  };

  const handleCopyVar = async (v: string) => {
    try {
      await navigator.clipboard.writeText(v);
      toast.success(`Copied ${v}`);
    } catch {
      // ignore
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))]">
        {t('nav.settings' as any) as string}
      </h1>

      <Card>
        <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
          {t('admin.capacitySettings' as any) as string}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          <Input
            label={t('admin.maxSchools' as any) as string}
            type="number"
            inputMode="numeric"
            min={1}
            value={capacity.maxSchoolsPerDay}
            onChange={(e) => setCapacity({ ...capacity, maxSchoolsPerDay: Number(e.target.value) })}
          />
          <Input
            label={t('admin.maxStudents' as any) as string}
            type="number"
            inputMode="numeric"
            min={1}
            value={capacity.maxStudentsPerDay}
            onChange={(e) => setCapacity({ ...capacity, maxStudentsPerDay: Number(e.target.value) })}
          />
        </div>
        <Button onClick={handleSaveCapacity} loading={savingCapacity}>
          <Save size={16} aria-hidden="true" />
          <span>{t('admin.save' as any) as string}</span>
        </Button>
      </Card>

      <Card className="p-0 overflow-hidden">
        <div className="px-5 sm:px-6 pt-5 sm:pt-6 border-b border-[rgb(var(--color-border))]">
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
            {t('admin.messageTemplates' as any) as string}
          </h2>
          <div className="flex gap-1" role="tablist" aria-label="Template language">
            {(['fr', 'en', 'ar'] as const).map((l) => {
              const active = langTab === l;
              return (
                <button
                  key={l}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setLangTab(l)}
                  className={`px-4 py-2.5 font-medium text-sm border-b-2 transition-colors cursor-pointer ${
                    active
                      ? 'border-[rgb(var(--color-primary))] text-[rgb(var(--color-primary))] font-semibold'
                      : 'border-transparent text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
                  }`}
                >
                  {l === 'en' ? 'English' : l === 'fr' ? 'Français' : 'العربية'}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5" dir={langTab === 'ar' ? 'rtl' : 'ltr'}>
          <div>
            <label
              htmlFor="tpl-confirmation"
              className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1.5"
            >
              {t('admin.confirmationMessage' as any) as string}
            </label>
            <textarea
              id="tpl-confirmation"
              value={templates[langTab].confirmation}
              onChange={(e) =>
                setTemplates({
                  ...templates,
                  [langTab]: { ...templates[langTab], confirmation: e.target.value },
                })
              }
              className="w-full rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] bg-white p-3 text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/15 text-start leading-relaxed"
              rows={4}
              dir="auto"
            />
          </div>

          <div>
            <label
              htmlFor="tpl-rejection"
              className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1.5"
            >
              {t('admin.rejectionMessage' as any) as string}
            </label>
            <textarea
              id="tpl-rejection"
              value={templates[langTab].rejection}
              onChange={(e) =>
                setTemplates({
                  ...templates,
                  [langTab]: { ...templates[langTab], rejection: e.target.value },
                })
              }
              className="w-full rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))] bg-white p-3 text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-[rgb(var(--color-primary))] focus:ring-2 focus:ring-[rgb(var(--color-primary))]/15 text-start leading-relaxed"
              rows={4}
              dir="auto"
            />
          </div>

          <div
            className="bg-[rgb(var(--color-bg))] p-3.5 rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))]"
            dir="ltr"
          >
            <p className="text-xs font-medium text-[rgb(var(--color-text-muted))] mb-2">
              Click a variable to copy:
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TEMPLATE_VARIABLES.map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleCopyVar(v)}
                  className="px-2 py-1 rounded bg-white border border-[rgb(var(--color-border))] text-xs font-mono text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-primary))] hover:text-[rgb(var(--color-primary))] transition-colors cursor-pointer"
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button onClick={handleSaveTemplates} loading={savingTemplates}>
              <Save size={16} aria-hidden="true" />
              <span>{t('admin.save' as any) as string}</span>
            </Button>

            {!confirmReset ? (
              <Button variant="outline" onClick={() => setConfirmReset(true)}>
                <RotateCcw size={15} aria-hidden="true" />
                <span>Reset to defaults</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 px-3 py-1.5 rounded-[var(--radius-sm)]">
                <span className="text-xs font-medium text-red-900">Overwrite templates?</span>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    setTemplates(defaultTemplates);
                    setConfirmReset(false);
                    toast.success('Templates reset to defaults (save to apply)');
                  }}
                >
                  Confirm
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setConfirmReset(false)}>
                  {t('admin.cancel' as any) as string}
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};
