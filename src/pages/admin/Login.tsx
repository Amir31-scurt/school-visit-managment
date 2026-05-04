import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from '../../i18n';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import logo from '../../assets/logo.png';
import toast from 'react-hot-toast';

export const Login = () => {
  const { login } = useAuth();
  const { t } = useTranslation();
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
    } catch (err: any) {
      toast.error(t('toast.error' as any) as string);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border">
        <div className="text-center mb-8">
          <img src={logo} alt="Logo" className="h-16 object-contain mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900">{t('admin.login' as any) as string}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label={t('admin.email' as any) as string}
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            label={t('admin.password' as any) as string}
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? (t('admin.loading' as any) as string) : t('admin.signIn' as any) as string}
          </Button>
        </form>
      </div>
    </div>
  );
};
