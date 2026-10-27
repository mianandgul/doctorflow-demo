export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  durationMinutes: number;
  pricePkr: number;
  popular?: boolean;
}

export interface Appointment {
  id: string;
  bookingReference: string; // e.g. DF-8924
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  patientAge?: number;
  patientGender?: 'Male' | 'Female' | 'Other';
  serviceId: string;
  serviceName: string;
  feePkr: number;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g. "10:30 AM"
  reason: string;
  status: AppointmentStatus;
  paymentStatus: 'paid' | 'pending';
  notes?: string;
  createdAt: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  phone: string;
  email?: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;
  totalVisits: number;
  lastVisitDate: string;
  totalSpentPkr: number;
  allergies?: string;
  medicalHistoryNotes?: string;
}

export interface DoctorProfile {
  name: string;
  title: string;
  qualifications: string;
  specialization: string;
  subSpecialties: string[];
  experienceYears: number;
  pmdcRegistration: string;
  hospitalAffiliations: string[];
  avatarUrl: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  rating: number;
  reviewCount: number;
  languages: string[];
}

export interface ClinicInfo {
  clinicName: string;
  tagline: string;
  address: string;
  city: string;
  googleMapsUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  workingDays: string[];
  workingHoursStart: string; // e.g. "10:00 AM"
  workingHoursEnd: string;   // e.g. "08:00 PM"
  slotDurationMinutes: number;
  defaultConsultationFeePkr: number;
}

export type ActiveView = 
  | 'home' 
  | 'profile' 
  | 'services' 
  | 'book' 
  | 'dashboard' 
  | 'appointments' 
  | 'patients' 
  | 'reports' 
  | 'settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}
