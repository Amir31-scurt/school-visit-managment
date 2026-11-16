import { useState } from 'react';
import { useRequests } from '../../hooks/useRequests';
import { useTranslation } from '../../i18n';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Input } from '../../components/ui/Input';
import { Search, History, Users, Calendar, Clock } from 'lucide-react';
import { useDateFormat } from '../../hooks/useDateFormat';

export const Visits = () => {
  const { t } = useTranslation();
  const { formatDate, formatTime } = useDateFormat();
  const [searchQuery, setSearchQuery] = useState('');

  const { requests, loading } = useRequests({ searchQuery, sortBy: 'date' });

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))]">
        {t('admin.visitsHistory' as any) as string}
      </h1>

      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]/60 flex flex-wrap gap-3 items-center justify-between">
          <div className="relative w-full sm:w-72">
            <Search
              className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={16}
              aria-hidden="true"
            />
            <Input
              aria-label={t('admin.searchSchool' as any) as string}
              placeholder={t('admin.searchSchool' as any) as string}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ps-9"
            />
          </div>
          {!loading && (
            <span className="text-xs font-medium text-[rgb(var(--color-text-muted))] tabular-nums">
              {requests.length} visits
            </span>
          )}
        </div>

        {loading ? (
          <div className="p-5 space-y-3" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <History size={32} className="mx-auto text-zinc-400 mb-3" aria-hidden="true" />
            <p className="text-sm font-medium text-[rgb(var(--color-text))]">
              {t('admin.noRequests' as any) as string}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-[rgb(var(--color-border))]">
              {requests.map((r) => (
                <div key={r.id} className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm text-[rgb(var(--color-text))]">
                      {r.schoolName}
                    </h3>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[rgb(var(--color-text-muted))]">
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} aria-hidden="true" />
                      {r.confirmedDate
                        ? formatDate(r.confirmedDate.toDate(), 'PP')
                        : r.preferredDate
                        ? formatDate(r.preferredDate.toDate(), 'PP')
                        : '-'}
                    </span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Clock size={13} aria-hidden="true" />
                      {formatTime(r.confirmedTime || r.preferredTime)}
                    </span>
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Users size={13} aria-hidden="true" />
                      {r.numberOfStudents}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead className="bg-[rgb(var(--color-bg))]/60 border-b border-[rgb(var(--color-border))] text-xs uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('admin.school' as any) as string}</th>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('admin.date' as any) as string}</th>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('form.preferredTime' as any) as string}</th>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('form.numberOfStudents' as any) as string}</th>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('admin.status' as any) as string}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgb(var(--color-border))]">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-[rgb(var(--color-bg))]/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-[rgb(var(--color-text))] text-start">
                        {r.schoolName}
                      </td>
                      <td className="px-5 py-4 text-[rgb(var(--color-text-muted))] text-start whitespace-nowrap">
                        {r.confirmedDate
                          ? formatDate(r.confirmedDate.toDate(), 'PPP')
                          : r.preferredDate
                          ? formatDate(r.preferredDate.toDate(), 'PPP')
                          : '-'}
                      </td>
                      <td className="px-5 py-4 text-[rgb(var(--color-text))] tabular-nums text-start">
                        {formatTime(r.confirmedTime || r.preferredTime)}
                      </td>
                      <td className="px-5 py-4 text-[rgb(var(--color-text))] tabular-nums text-start">
                        {r.numberOfStudents}
                      </td>
                      <td className="px-5 py-4 text-start">
                        <StatusBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
