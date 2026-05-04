import { useState } from 'react';
import { useCalendarMonth } from '../../hooks/useCalendar';
import { useRequestsByDate } from '../../hooks/useRequests';
import { useSettings } from '../../hooks/useSettings';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../i18n';
import { useDateFormat } from '../../hooks/useDateFormat';

const DayModal = ({ isOpen, onClose, date }: { isOpen: boolean, onClose: () => void, date: Date | null }) => {
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
          <div className="divide-y border rounded-lg overflow-hidden">
            {requests.map(r => (
              <div key={r.id} className="p-4 bg-gray-50 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{r.schoolName}</p>
                  <p className="text-sm text-gray-500">{r.numberOfStudents} {t('admin.students' as any) as string}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium bg-white px-2 py-1 rounded shadow-sm border flex items-center gap-1">
                    <Clock size={14} /> {formatTime(r.confirmedTime)}
                  </span>
                  <button onClick={() => navigate('/admin/requests')} className="text-xs text-emerald-600 hover:underline">View details</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {t('admin.calendar.noVisits' as any) as string}
          </div>
        )}
        
        <div className="bg-emerald-50 text-emerald-800 p-3 rounded-lg text-sm font-medium flex justify-between">
          <span>{t('admin.calendar.totalSchools' as any) as string}: {totalSchools}</span>
          <span>{totalStudents} {t('admin.calendar.totalStudents' as any) as string}</span>
        </div>

        <Button className="w-full" onClick={() => navigate('/admin/requests')}>{t('admin.calendar.addVisit' as any) as string}</Button>
      </div>
    </Modal>
  );
};

export const Calendar = () => {
  const { t } = useTranslation();
  const { formatDate, lang } = useDateFormat();
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
    end: endOfMonth(currentDate)
  });

  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));

  const getColor = (schools: number, students: number) => {
    if (schools >= maxSchools || students >= maxStudents) return 'bg-red-100 text-red-800 border-red-200 hover:bg-red-200';
    if (schools >= maxSchools * 0.5 || students >= maxStudents * 0.5) return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
    if (schools > 0) return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
    return 'bg-white text-gray-700 hover:bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{t('nav.calendar' as any) as string}</h1>
        <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg shadow-sm border">
          <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft /></button>
          <span className="font-semibold text-lg min-w-[120px] text-center">{formatDate(currentDate, 'MMMM yyyy')}</span>
          <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded"><ChevronRight /></button>
        </div>
      </div>

      <Card className="p-0">
        <div className="grid grid-cols-7 gap-px bg-gray-200 border-b">
          {Array.from({ length: 7 }).map((_, i) => {
            const dayName = formatDate(new Date(2024, 0, i + 7), 'EEE'); // Jan 7, 2024 is Sunday
            return (
              <div key={i} className="bg-gray-50 py-3 text-center text-sm font-medium text-gray-500">{dayName}</div>
            );
          })}
        </div>
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {Array.from({ length: days[0].getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-gray-50 min-h-[120px]"></div>
          ))}
          {days.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const data = calendarData[dateStr] || { schools: 0, students: 0 };
            return (
              <div
                key={dateStr}
                onClick={() => setSelectedDate(day)}
                className={`min-h-[120px] p-2 border border-transparent transition-colors cursor-pointer ${getColor(data.schools, data.students)}`}
              >
                <div className={`text-sm font-medium w-8 h-8 flex items-center justify-center rounded-full ${isToday(day) ? 'bg-emerald-600 text-white' : ''}`}>
                  {formatDate(day, 'd')}
                </div>
                {data.schools > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="text-xs font-semibold px-2 py-1 bg-black/5 rounded" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      🏫 {data.schools} {t('admin.schools' as any) as string}
                    </div>
                    <div className="text-xs font-semibold px-2 py-1 bg-black/5 rounded" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
                      👥 {data.students} {t('admin.students' as any) as string}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
      
      <DayModal isOpen={!!selectedDate} onClose={() => setSelectedDate(null)} date={selectedDate} />
    </div>
  );
};
