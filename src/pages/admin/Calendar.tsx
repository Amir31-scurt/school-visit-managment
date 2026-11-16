import { useState } from 'react';
import { useCalendarMonth } from '../../hooks/useCalendar';
import { useRequestsByDate } from '../../hooks/useRequests';
import { useSettings } from '../../hooks/useSettings';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Skeleton } from '../../components/ui/Skeleton';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Building2, Users } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useDateFormat } from '../../hooks/useDateFormat';

const DayModal = ({
  isOpen,
  onClose,
  date,
}: {
  isOpen: boolean;
  onClose: () => void;
  date: Date | null;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formatDate, formatTime } = useDateFormat();
  const requests = useRequestsByDate(date || new Date());

  if (!date) return null;

  const totalSchools = requests.length;
  const totalStudents = requests.reduce((sum, r) => sum + Number(r.numberOfStudents || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={formatDate(date, 'EEEE, d MMMM yyyy')}>
      <div className="space-y-4">
        {requests.length > 0 ? (
          <div className="divide-y divide-[rgb(var(--color-border))] border border-[rgb(var(--color-border))] rounded-[var(--radius-sm)] overflow-hidden">
            {requests.map((r) => (
              <div
                key={r.id}
                className="p-3.5 bg-[rgb(var(--color-bg))]/50 flex justify-between items-center gap-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-[rgb(var(--color-text))] truncate">
                    {r.schoolName}
                  </p>
                  <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5 tabular-nums">
                    {r.numberOfStudents} {t('admin.students' as any) as string}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-xs font-semibold bg-white px-2.5 py-1 rounded-md border border-[rgb(var(--color-border))] inline-flex items-center gap-1 tabular-nums">
                    <Clock size={12} aria-hidden="true" />
                    {formatTime(r.confirmedTime)}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate('/admin/requests')}
                    className="text-xs font-medium text-[rgb(var(--color-primary))] hover:underline cursor-pointer"
                  >
                    View details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-sm text-[rgb(var(--color-text-muted))] border border-dashed border-[rgb(var(--color-border))] rounded-[var(--radius-sm)]">
            {t('admin.calendar.noVisits' as any) as string}
          </div>
        )}

        <div className="bg-[rgb(var(--color-primary-soft))] border border-emerald-200/80 text-emerald-900 px-3.5 py-2.5 rounded-[var(--radius-sm)] text-xs sm:text-sm font-medium flex justify-between tabular-nums">
          <span>
            {t('admin.calendar.totalSchools' as any) as string}: {totalSchools}
          </span>
          <span>
            {totalStudents} {t('admin.calendar.totalStudents' as any) as string}
          </span>
        </div>

        <Button className="w-full" onClick={() => navigate('/admin/requests')}>
          {t('admin.calendar.addVisit' as any) as string}
        </Button>
      </div>
    </Modal>
  );
};

export const Calendar = () => {
  const { t } = useTranslation();
  const { formatDate } = useDateFormat();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { calendarData, loading } = useCalendarMonth(year, month);
  const { settings } = useSettings();

  const maxSchools = settings?.capacity.maxSchoolsPerDay || 3;
  const maxStudents = settings?.capacity.maxStudentsPerDay || 150;

  const days = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const goToday = () => setCurrentDate(new Date());

  const getCellStyle = (schools: number, students: number) => {
    if (schools >= maxSchools || students >= maxStudents) {
      return 'bg-red-50/90 text-red-900 hover:bg-red-100/80';
    }
    if (schools >= maxSchools * 0.5 || students >= maxStudents * 0.5) {
      return 'bg-amber-50/90 text-amber-900 hover:bg-amber-100/80';
    }
    if (schools > 0) {
      return 'bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100/70';
    }
    return 'bg-white text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg))]';
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[rgb(var(--color-text))]">
            {t('nav.calendar' as any) as string}
          </h1>
          {/* Capacity Legend */}
          <div className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-[rgb(var(--color-text-muted))]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
              Available
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" aria-hidden="true" />
              &ge;50% capacity
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" aria-hidden="true" />
              Full
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <Button variant="outline" size="sm" onClick={goToday}>
            Today
          </Button>
          <div className="flex items-center gap-1 bg-[rgb(var(--color-surface))] px-2 py-1 rounded-[var(--radius-sm)] border border-[rgb(var(--color-border))]">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Previous month"
              className="p-1.5 hover:bg-[rgb(var(--color-surface-muted))] rounded-md transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} className="rtl:rotate-180" />
            </button>
            <span className="font-semibold text-sm sm:text-base min-w-[130px] text-center capitalize">
              {formatDate(currentDate, 'MMMM yyyy')}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Next month"
              className="p-1.5 hover:bg-[rgb(var(--color-surface-muted))] rounded-md transition-colors cursor-pointer"
            >
              <ChevronRight size={18} className="rtl:rotate-180" />
            </button>
          </div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        {loading ? (
          <div className="p-5">
            <Skeleton className="h-[420px] w-full" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 gap-px bg-[rgb(var(--color-border))] border-b border-[rgb(var(--color-border))]">
              {Array.from({ length: 7 }).map((_, i) => {
                const dayName = formatDate(new Date(2024, 0, i + 7), 'EEE');
                return (
                  <div
                    key={i}
                    className="bg-[rgb(var(--color-bg))] py-2.5 text-center text-xs font-semibold uppercase tracking-wider text-[rgb(var(--color-text-muted))]"
                  >
                    {dayName}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-7 gap-px bg-[rgb(var(--color-border))]">
              {Array.from({ length: days[0].getDay() }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="bg-[rgb(var(--color-bg))]/50 min-h-[72px] sm:min-h-[112px]"
                />
              ))}

              {days.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const data = calendarData[dateStr] || { schools: 0, students: 0 };
                const today = isToday(day);

                return (
                  <button
                    key={dateStr}
                    type="button"
                    onClick={() => setSelectedDate(day)}
                    className={`min-h-[72px] sm:min-h-[112px] p-1.5 sm:p-2.5 text-start flex flex-col justify-between transition-colors cursor-pointer focus-visible:z-10 ${getCellStyle(
                      data.schools,
                      data.students
                    )}`}
                  >
                    <span
                      className={`text-xs sm:text-sm font-semibold w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center rounded-full tabular-nums ${
                        today
                          ? 'bg-[rgb(var(--color-primary))] text-white'
                          : ''
                      }`}
                    >
                      {formatDate(day, 'd')}
                    </span>

                    {data.schools > 0 && (
                      <div className="mt-1 space-y-1 w-full">
                        <div className="inline-flex sm:flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-1.5 py-0.5 bg-black/5 rounded tabular-nums w-full truncate">
                          <Building2 size={11} className="shrink-0" aria-hidden="true" />
                          <span>{data.schools}</span>
                          <span className="hidden sm:inline truncate">
                            {t('admin.schools' as any) as string}
                          </span>
                        </div>
                        <div className="hidden sm:flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 bg-black/5 rounded tabular-nums w-full truncate">
                          <Users size={11} className="shrink-0" aria-hidden="true" />
                          <span>{data.students}</span>
                          <span className="truncate">{t('admin.students' as any) as string}</span>
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </Card>

      <DayModal
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        date={selectedDate}
      />
    </div>
  );
};
