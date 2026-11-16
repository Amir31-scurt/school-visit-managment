import { useTranslation } from '../../i18n';
import { useDashboardStats, useRequests } from '../../hooks/useRequests';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { isSameDay } from 'date-fns';
import { Users, School, Calendar as CalendarIcon, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDateFormat } from '../../hooks/useDateFormat';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { formatDate, formatTime } = useDateFormat();
  const { totalSchools, totalStudents, visitsToday, upcomingVisits, loading } = useDashboardStats();
  const { requests } = useRequests();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading dashboard">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-7 w-16" />
              </div>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 space-y-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-40 w-full" />
          </Card>
          <Card className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-40 w-full" />
          </Card>
        </div>
      </div>
    );
  }

  const today = new Date();
  const pendingRequests = requests.filter((r) => r.status === 'pending').slice(0, 5);
  const todaysVisits = requests.filter(
    (r) => r.status === 'approved' && r.confirmedDate && isSameDay(r.confirmedDate.toDate(), today)
  );

  const statCards = [
    {
      title: t('admin.totalSchools' as any),
      value: totalSchools,
      icon: <School size={22} className="text-emerald-700" aria-hidden="true" />,
      bg: 'bg-emerald-50 border border-emerald-200/70',
    },
    {
      title: t('admin.totalStudents' as any),
      value: totalStudents,
      icon: <Users size={22} className="text-teal-700" aria-hidden="true" />,
      bg: 'bg-teal-50 border border-teal-200/70',
    },
    {
      title: t('admin.visitsToday' as any),
      value: visitsToday,
      icon: <CalendarIcon size={22} className="text-amber-700" aria-hidden="true" />,
      bg: 'bg-amber-50 border border-amber-200/70',
    },
    {
      title: t('admin.upcomingVisits' as any),
      value: upcomingVisits,
      icon: <Clock size={22} className="text-zinc-700" aria-hidden="true" />,
      bg: 'bg-zinc-100 border border-zinc-200/80',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((stat, i) => (
          <Card key={i} className="flex items-center gap-4 p-5">
            <div className={`p-3 rounded-xl shrink-0 ${stat.bg}`}>{stat.icon}</div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-[rgb(var(--color-text-muted))] truncate">
                {stat.title as React.ReactNode}
              </p>
              <p className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))] tabular-nums mt-0.5">
                {stat.value}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          <div className="flex justify-between items-center px-5 py-4 border-b border-[rgb(var(--color-border))]">
            <h2 className="text-base font-semibold text-[rgb(var(--color-text))]">
              {t('admin.recentRequests' as any) as string}
            </h2>
            <button
              type="button"
              onClick={() => navigate('/admin/requests')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
            >
              <span>View all</span>
              <ArrowRight size={14} className="rtl:rotate-180" aria-hidden="true" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-start text-sm">
              <thead>
                <tr className="border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]/60 text-xs uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  <th className="px-5 py-3 font-semibold text-start">{t('admin.school' as any) as string}</th>
                  <th className="px-5 py-3 font-semibold text-start">{t('admin.date' as any) as string}</th>
                  <th className="px-5 py-3 font-semibold text-start">{t('form.numberOfStudents' as any) as string}</th>
                  <th className="px-5 py-3 font-semibold text-start">{t('admin.status' as any) as string}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgb(var(--color-border))]">
                {pendingRequests.map((r) => (
                  <tr
                    key={r.id}
                    onClick={() => navigate('/admin/requests')}
                    className="hover:bg-[rgb(var(--color-bg))]/60 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 font-medium text-[rgb(var(--color-text))] text-start">
                      {r.schoolName}
                    </td>
                    <td className="px-5 py-3.5 text-[rgb(var(--color-text-muted))] text-start whitespace-nowrap">
                      {r.preferredDate ? formatDate(r.preferredDate.toDate(), 'PP') : '-'}
                    </td>
                    <td className="px-5 py-3.5 text-[rgb(var(--color-text))] tabular-nums text-start">
                      {r.numberOfStudents}
                    </td>
                    <td className="px-5 py-3.5 text-start">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
                {pendingRequests.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-5 py-10 text-center text-sm text-[rgb(var(--color-text-muted))]">
                      {t('admin.calendar.noVisits' as any) as string}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-0 overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-[rgb(var(--color-border))]">
            <h2 className="text-base font-semibold text-[rgb(var(--color-text))]">
              {t('admin.visitsToday' as any) as string}
            </h2>
          </div>
          <div className="p-5 flex-1">
            {todaysVisits.length > 0 ? (
              <div className="space-y-3">
                {todaysVisits.map((v) => (
                  <div
                    key={v.id}
                    className="flex justify-between items-center gap-3 p-3.5 bg-[rgb(var(--color-bg))] rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))]"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-sm text-[rgb(var(--color-text))] truncate" dir="auto">
                        {v.schoolName}
                      </p>
                      <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5 tabular-nums">
                        {v.numberOfStudents} {t('admin.students' as any) as string}
                      </p>
                    </div>
                    <span className="text-xs font-semibold bg-white text-[rgb(var(--color-primary))] px-2.5 py-1 rounded-md border border-[rgb(var(--color-border))] tabular-nums shrink-0">
                      {formatTime(v.confirmedTime)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 px-4 text-[rgb(var(--color-text-muted))] border border-dashed border-[rgb(var(--color-border))] rounded-[var(--radius-sm)] bg-[rgb(var(--color-bg))]/40">
                <CalendarIcon size={24} className="mx-auto text-zinc-400 mb-2" aria-hidden="true" />
                <p className="text-sm">{t('admin.noVisits' as any) as string}</p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
