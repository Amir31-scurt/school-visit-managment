import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { AppSettings } from '../types';
import { defaultTemplates } from '../lib/messageTemplates';

const DEFAULT_SETTINGS: Partial<AppSettings> = {
  capacity: { maxSchoolsPerDay: 3, maxStudentsPerDay: 150 },
  messageTemplates: defaultTemplates
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, 'settings', 'config');
    const unsubscribe = onSnapshot(docRef, async (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as AppSettings);
      } else {
        await setDoc(docRef, { ...DEFAULT_SETTINGS, updatedAt: serverTimestamp() });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateSettings = async (data: Partial<AppSettings>) => {
    await setDoc(doc(db, 'settings', 'config'), { ...settings, ...data, updatedAt: serverTimestamp() }, { merge: true });
  };

  return { settings, loading, updateSettings };
}
