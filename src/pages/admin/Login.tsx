import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { LanguageSwitcher } from '../../components/shared/LanguageSwitcher';
import logo from '../../assets/logo.png';
import toast from 'react-hot-toast';
import { Lock } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const { t, lang } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin/dashboard');
    } catch {
      toast.error(t('toast.error' as any) as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--color-bg))] py-12 px-4 sm:px-6"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="absolute top-5 end-5">
        <LanguageSwitcher />
      </div>

      <div className="max-w-md w-full bg-[rgb(var(--color-surface))] p-7 sm:p-8 rounded-[var(--radius-lg)] border border-[rgb(var(--color-border))] shadow-sm">
        <div className="text-center mb-7">
          <img src={logo} alt="Museum Logo" className="h-14 w-auto object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))]">
            {t('admin.login' as any) as string}
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
            {t('admin.portal' as any) as string}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label={t('admin.email' as any) as string}
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={t('admin.password' as any) as string}
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="pt-2">
            <Button type="submit" className="w-full" size="lg" loading={loading}>
              <Lock size={16} aria-hidden="true" />
              <span>{t('admin.signIn' as any) as string}</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
