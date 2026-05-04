import { useTranslation } from '../../i18n';
import { useDashboardStats, useRequests } from '../../hooks/useRequests';
import { Card } from '../../components/ui/Card';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { startOfWeek, isSameDay } from 'date-fns';
import { Users, School, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDateFormat } from '../../hooks/useDateFormat';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { formatDate, formatTime } = useDateFormat();
  const { totalSchools, totalStudents, visitsToday, upcomingVisits, loading } = useDashboardStats();
  const { requests } = useRequests();
  const navigate = useNavigate();

  if (loading) return <div>{t('admin.loading' as any) as string}</div>;

  const today = new Date();

  const pendingRequests = requests.filter(r => r.status === 'pending').slice(0, 5);
  const todaysVisits = requests.filter(r => r.status === 'approved' && r.confirmedDate && isSameDay(r.confirmedDate.toDate(), today));

  const statCards = [
    { title: t('admin.totalSchools' as any), value: totalSchools, icon: <School size={24} className="text-emerald-600" />, bg: 'bg-emerald-100' },
    { title: t('admin.totalStudents' as any), value: totalStudents, icon: <Users size={24} className="text-green-600" />, bg: 'bg-green-100' },
    { title: t('admin.visitsToday' as any), value: visitsToday, icon: <CalendarIcon size={24} className="text-orange-600" />, bg: 'bg-orange-100' },
    { title: t('admin.upcomingVisits' as any), value: upcomingVisits, icon: <Clock size={24} className="text-purple-600" />, bg: 'bg-purple-100' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="flex items-center gap-4">
            <div className={`p-4 rounded-xl ${stat.bg}`}>{stat.icon}</div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{stat.title as React.ReactNode}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">{t('admin.recentRequests' as any) as string}</h3>
            <button onClick={() => navigate('/admin/requests')} className="text-sm text-emerald-600 hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="pb-3 font-medium text-start">{t('admin.school' as any) as string}</th>
                  <th className="pb-3 font-medium text-start">{t('admin.date' as any) as string}</th>
                  <th className="pb-3 font-medium text-start">{t('form.numberOfStudents' as any) as string}</th>
                  <th className="pb-3 font-medium text-start">{t('admin.status' as any) as string}</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pendingRequests.map(r => (
                  <tr key={r.id}>
                    <td className="py-3 font-medium text-start">{r.schoolName}</td>
                    <td className="py-3 text-start">{r.preferredDate ? formatDate(r.preferredDate.toDate(), 'PP') : '-'}</td>
                    <td className="py-3 text-start">{r.numberOfStudents}</td>
                    <td className="py-3 text-start"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {pendingRequests.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-500">{t('admin.calendar.noVisits' as any) as string}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-4">{t('admin.visitsToday' as any) as string}</h3>
          {todaysVisits.length > 0 ? (
            <div className="space-y-4">
              {todaysVisits.map(v => (
                <div key={v.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border">
                  <div>
                    <p className="font-medium" dir="auto">{v.schoolName}</p>
                    <p className="text-xs text-gray-500">{v.numberOfStudents} {t('admin.students' as any) as string}</p>
                  </div>
                  <div className="text-sm font-semibold bg-white px-2 py-1 rounded shadow-sm border">
                    {formatTime(v.confirmedTime)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
              <CalendarIcon className="mx-auto text-gray-400 mb-2" />
              {t('admin.noVisits' as any) as string}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};
