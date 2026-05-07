export type Lang = 'en' | 'fr' | 'ar' | 'wo';
export type RequestStatus = 'pending' | 'approved' | 'rejected';
export type RequestSource = 'public_form' | 'admin_created';

export interface VisitRequest {
  id: string;
  schoolName: string;
  contactPerson: string;
  phone: string;
  email?: string;
  numberOfStudents: number;
  preferredDate: any; // Firestore Timestamp
  preferredTime?: string;
  communicationLanguage: Lang;
  notes?: string;
  status: RequestStatus;
  source: RequestSource;
  createdAt: any;
  updatedAt: any;
  confirmedDate?: any;
  confirmedTime?: string;
  internalNotes?: string;
  approvedBy?: string;
  approvedAt?: any;
  rejectedBy?: string;
  rejectedAt?: any;
  rejectionReason?: string;
}

export interface AppSettings {
  capacity: {
    maxSchoolsPerDay: number;
    maxStudentsPerDay: number;
  };
  messageTemplates: {
    en: { confirmation: string; rejection: string; };
    fr: { confirmation: string; rejection: string; };
    ar: { confirmation: string; rejection: string; };
    wo: { confirmation: string; rejection: string; };
  };
  updatedAt: any;
}
