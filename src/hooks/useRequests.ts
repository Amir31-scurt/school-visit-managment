import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { VisitRequest, RequestStatus } from '../types';
import { startOfDay, endOfDay, addDays, isSameDay } from 'date-fns';

export function useRequests(filters?: { status?: string; searchQuery?: string }) {
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Query with single orderBy avoids composite index issues but prevents cache corruption
    const q = query(collection(db, 'requests'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisitRequest));

      // Filter status in memory
      if (filters?.status && filters.status !== 'all') {
        data = data.filter(r => r.status === filters.status);
      }

      if (filters?.searchQuery) {
        const qStr = filters.searchQuery.toLowerCase();
        data = data.filter(r => r.schoolName.toLowerCase().includes(qStr));
      }
      setRequests(data);
      setLoading(false);
    }, (err) => {
      setError(err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filters?.status, filters?.searchQuery]);

  return { requests, loading, error };
}

export const submitPublicRequest = async (data: any) => {
  return await addDoc(collection(db, 'requests'), {
    ...data,
    status: 'pending',
    source: 'public_form',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const approveRequest = async (id: string, confirmedDate: any, confirmedTime: string, internalNotes: string, adminUid: string, numberOfStudents?: number) => {
  const updateData: any = {
    status: 'approved',
    confirmedDate,
    confirmedTime,
    internalNotes,
    approvedBy: adminUid,
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  
  if (numberOfStudents !== undefined) {
    updateData.numberOfStudents = numberOfStudents;
  }

  return await updateDoc(doc(db, 'requests', id), updateData);
};

export const rejectRequest = async (id: string, reason: string, adminUid: string) => {
  return await updateDoc(doc(db, 'requests', id), {
    status: 'rejected',
    rejectionReason: reason,
    rejectedBy: adminUid,
    rejectedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export function useRequestsByDate(date: Date) {
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  
  useEffect(() => {
    const q = query(
      collection(db, 'requests'),
      where('status', '==', 'approved'),
      where('confirmedDate', '>=', startOfDay(date)),
      where('confirmedDate', '<=', endOfDay(date))
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as VisitRequest)));
    });
    return () => unsubscribe();
  }, [date.getTime()]);

  return requests;
}

export function useDashboardStats() {
  const [stats, setStats] = useState({ totalSchools: 0, totalStudents: 0, visitsToday: 0, upcomingVisits: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'requests'), where('status', '==', 'approved'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let totalSchools = 0;
      let totalStudents = 0;
      let visitsToday = 0;
      let upcomingVisits = 0;
      const today = new Date();
      const in7Days = addDays(today, 7);

      snapshot.docs.forEach(docSnap => {
        const data = docSnap.data() as VisitRequest;
        
        if (data.confirmedDate) {
          const confDate = data.confirmedDate.toDate();
          const todayStart = startOfDay(new Date());

          // Only count as 'visited' if the date has passed
          if (confDate < todayStart) {
            totalSchools++;
            totalStudents += Number(data.numberOfStudents || 0);
          }

          if (isSameDay(confDate, new Date())) {
            visitsToday++;
          } else if (confDate > todayStart) {
            upcomingVisits++;
          }
        }
      });
      setStats({ totalSchools, totalStudents, visitsToday, upcomingVisits });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return { ...stats, loading };
}
