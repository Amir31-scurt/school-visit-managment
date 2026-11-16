import { useState } from 'react';
import { useRequests } from '../../hooks/useRequests';
import { useTranslation } from '../../i18n';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';
import { StatusBadge } from '../../components/shared/StatusBadge';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Search, MessageCircle, Plus, Inbox, Users, Calendar } from 'lucide-react';
import { buildWhatsAppLink } from '../../lib/whatsapp';
import { ApproveModal } from '../../components/ApproveModal';
import { RejectModal } from '../../components/RejectModal';
import { VisitRequest } from '../../types';
import { useDateFormat } from '../../hooks/useDateFormat';

export const Requests = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormat();
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [contactFilter, setContactFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  const [approveModalReq, setApproveModalReq] = useState<VisitRequest | null>(null);
  const [rejectModalReq, setRejectModalReq] = useState<VisitRequest | null>(null);

  const { requests, loading } = useRequests({
    status: statusFilter,
    searchQuery,
    contactName: contactFilter,
    preferredDate: dateFilter ? new Date(dateFilter) : undefined,
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))]">
          {t('nav.requests' as any) as string}
        </h1>
        <Button onClick={() => window.open('/', '_blank')} className="w-full sm:w-auto">
          <Plus size={16} aria-hidden="true" />
          <span>{t('admin.addRequest' as any) as string}</span>
        </Button>
      </div>

      <Card className="p-0 overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))]/60 flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          <div
            role="tablist"
            aria-label="Filter by status"
            className="flex flex-wrap gap-1.5 bg-[rgb(var(--color-surface-muted))] p-1 rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))]"
          >
            {['all', 'pending', 'approved', 'rejected'].map((status) => {
              const active = statusFilter === status;
              return (
                <button
                  key={status}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStatusFilter(status)}
                  className={`flex-1 sm:flex-initial px-3.5 py-1.5 rounded-[6px] text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-white shadow-xs text-[rgb(var(--color-primary))] font-semibold'
                      : 'text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))]'
                  }`}
                >
                  {
                    t(
                      ('admin.filter' +
                        status.charAt(0).toUpperCase() +
                        status.slice(1)) as any
                    ) as string
                  }
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
            <div className="relative sm:w-56">
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
            <div className="sm:w-44">
              <Input
                aria-label={t('admin.searchContact' as any) as string}
                placeholder={t('admin.searchContact' as any) as string}
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
              />
            </div>
            <div className="sm:w-40">
              <Input
                aria-label={t('admin.date' as any) as string}
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-5 space-y-3" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="px-6 py-14 text-center">
            <Inbox size={32} className="mx-auto text-zinc-400 mb-3" aria-hidden="true" />
            <p className="text-sm font-medium text-[rgb(var(--color-text))]">
              {t('admin.noRequests' as any) as string}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile card list (< md) */}
            <div className="md:hidden divide-y divide-[rgb(var(--color-border))]">
              {requests.map((r) => (
                <div key={r.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm text-[rgb(var(--color-text))] truncate">
                        {r.schoolName}
                      </h3>
                      <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5" dir="auto">
                        {r.contactPerson}
                      </p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-[rgb(var(--color-text-muted))]">
                    <span className="inline-flex items-center gap-1 tabular-nums">
                      <Users size={13} aria-hidden="true" />
                      {r.numberOfStudents}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar size={13} aria-hidden="true" />
                      {r.preferredDate ? formatDate(r.preferredDate.toDate(), 'PP') : '-'}
                    </span>
                    <a
                      href={buildWhatsAppLink(r.phone, '')}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-700 font-medium hover:underline"
                    >
                      <MessageCircle size={13} aria-hidden="true" />
                      <span dir="ltr">{r.phone}</span>
                    </a>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {r.status === 'pending' ? (
                      <>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => setApproveModalReq(r)}
                        >
                          {t('admin.approve' as any) as string}
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          className="flex-1"
                          onClick={() => setRejectModalReq(r)}
                        >
                          {t('admin.reject' as any) as string}
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => setApproveModalReq(r)}
                      >
                        {t('admin.view' as any) as string}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-start text-sm">
                <thead className="bg-[rgb(var(--color-bg))]/60 border-b border-[rgb(var(--color-border))] text-xs uppercase tracking-wider text-[rgb(var(--color-text-muted))]">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('admin.school' as any) as string}</th>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('admin.contact' as any) as string}</th>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('form.numberOfStudents' as any) as string}</th>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('admin.date' as any) as string}</th>
                    <th className="px-5 py-3.5 font-semibold text-start">{t('admin.status' as any) as string}</th>
                    <th className="px-5 py-3.5 font-semibold text-end">{t('admin.actions' as any) as string}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgb(var(--color-border))]">
                  {requests.map((r) => (
                    <tr key={r.id} className="hover:bg-[rgb(var(--color-bg))]/50 transition-colors">
                      <td className="px-5 py-4 font-semibold text-[rgb(var(--color-text))] text-start">
                        {r.schoolName}
                      </td>
                      <td className="px-5 py-4 text-start">
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[rgb(var(--color-text))]" dir="auto">
                              {r.contactPerson}
                            </span>
                            <a
                              href={buildWhatsAppLink(r.phone, '')}
                              target="_blank"
                              rel="noreferrer"
                              aria-label={`Message ${r.contactPerson} on WhatsApp`}
                              className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                            >
                              <MessageCircle size={13} aria-hidden="true" />
                            </a>
                          </div>
                          <span className="text-xs text-[rgb(var(--color-text-muted))]" dir="ltr">
                            {r.phone}
                          </span>
                          {r.email && (
                            <span className="text-xs text-[rgb(var(--color-text-muted))]">{r.email}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-start tabular-nums">{r.numberOfStudents}</td>
                      <td className="px-5 py-4 text-start whitespace-nowrap text-[rgb(var(--color-text-muted))]">
                        {r.preferredDate ? formatDate(r.preferredDate.toDate(), 'PPP') : '-'}
                      </td>
                      <td className="px-5 py-4 text-start">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="px-5 py-4 text-end">
                        <div className="inline-flex items-center gap-2">
                          {r.status !== 'pending' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setApproveModalReq(r)}
                            >
                              {t('admin.view' as any) as string}
                            </Button>
                          ) : (
                            <>
                              <Button size="sm" onClick={() => setApproveModalReq(r)}>
                                {t('admin.approve' as any) as string}
                              </Button>
                              <Button
                                size="sm"
                                variant="danger"
                                onClick={() => setRejectModalReq(r)}
                              >
                                {t('admin.reject' as any) as string}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>

      <ApproveModal
        isOpen={!!approveModalReq}
        onClose={() => setApproveModalReq(null)}
        request={approveModalReq}
      />
      <RejectModal
        isOpen={!!rejectModalReq}
        onClose={() => setRejectModalReq(null)}
        request={rejectModalReq}
      />
    </div>
  );
};
