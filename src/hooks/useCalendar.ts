import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { VisitRequest } from '../types';
import { startOfMonth, endOfMonth, format } from 'date-fns';

export function useCalendarMonth(year: number, month: number) {
  const [calendarData, setCalendarData] = useState<Record<string, { schools: number; students: number }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const date = new Date(year, month);
    const start = startOfMonth(date);
    const end = endOfMonth(date);

    const q = query(
      collection(db, 'requests'),
      where('status', '==', 'approved'),
      where('confirmedDate', '>=', start),
      where('confirmedDate', '<=', end)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: Record<string, { schools: number; students: number }> = {};
      
      snapshot.docs.forEach(docSnap => {
        const req = docSnap.data() as VisitRequest;
        if (req.confirmedDate) {
          const dateStr = format(req.confirmedDate.toDate(), 'yyyy-MM-dd');
          if (!data[dateStr]) data[dateStr] = { schools: 0, students: 0 };
          data[dateStr].schools += 1;
          data[dateStr].students += Number(req.numberOfStudents || 0);
        }
      });
      setCalendarData(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [year, month]);

  return { calendarData, loading };
}
