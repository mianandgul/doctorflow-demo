import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  DoctorProfile, 
  ClinicInfo, 
  Service, 
  Appointment, 
  PatientRecord, 
  ActiveView, 
  AppointmentStatus,
  ToastMessage 
} from '../types';
import { 
  INITIAL_DOCTOR, 
  INITIAL_CLINIC, 
  INITIAL_SERVICES, 
  INITIAL_APPOINTMENTS, 
  INITIAL_PATIENTS 
} from '../data/initialData';

interface ClinicContextType {
  doctor: DoctorProfile;
  clinic: ClinicInfo;
  services: Service[];
  appointments: Appointment[];
  patients: PatientRecord[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Appointment Actions
  bookAppointment: (data: {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    patientAge?: number;
    patientGender?: 'Male' | 'Female' | 'Other';
    serviceId: string;
    date: string;
    timeSlot: string;
    reason: string;
  }) => { success: boolean; appointment?: Appointment; error?: string };
  
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => void;
  updateAppointmentPayment: (id: string, paymentStatus: 'paid' | 'pending') => void;
  rescheduleAppointment: (id: string, newDate: string, newTimeSlot: string) => { success: boolean; error?: string };
  deleteAppointment: (id: string) => void;
  
  // Settings & Service actions
  updateDoctorProfile: (profile: Partial<DoctorProfile>) => void;
  updateClinicInfo: (info: Partial<ClinicInfo>) => void;
  addService: (service: Omit<Service, 'id'>) => void;
  updateService: (service: Service) => void;
  deleteService: (id: string) => void;
  
  // Patients
  addPatient: (data: Partial<PatientRecord> & { name: string; phone: string }) => PatientRecord;
  updatePatient: (patient: PatientRecord) => void;
  
  // Reset & Helpers
  resetDemoData: () => void;
  exportAppointmentsCsv: (appointmentsToExport?: Appointment[]) => void;
  
  // Modal controls
  printableReceiptAppointment: Appointment | null;
  setPrintableReceiptAppointment: (apt: Appointment | null) => void;
  newAppointmentModalOpen: boolean;
  setNewAppointmentModalOpen: (open: boolean) => void;
}

const STORAGE_KEYS = {
  DOCTOR: 'doctorflow_doctor_v1',
  CLINIC: 'doctorflow_clinic_v1',
  SERVICES: 'doctorflow_services_v1',
  APPOINTMENTS: 'doctorflow_appointments_v1',
  PATIENTS: 'doctorflow_patients_v1',
};

const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const ClinicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or fallback to seeded data
  const [doctor, setDoctor] = useState<DoctorProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCTOR);
      return saved ? JSON.parse(saved) : INITIAL_DOCTOR;
    } catch {
      return INITIAL_DOCTOR;
    }
  });

  const [clinic, setClinic] = useState<ClinicInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLINIC);
      return saved ? JSON.parse(saved) : INITIAL_CLINIC;
    } catch {
      return INITIAL_CLINIC;
    }
  });

  const [services, setServices] = useState<Service[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : INITIAL_SERVICES;
    } catch {
      return INITIAL_SERVICES;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [patients, setPatients] = useState<PatientRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return saved ? JSON.parse(saved) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [printableReceiptAppointment, setPrintableReceiptAppointment] = useState<Appointment | null>(null);
  const [newAppointmentModalOpen, setNewAppointmentModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCTOR, JSON.stringify(doctor));
  }, [doctor]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLINIC, JSON.stringify(clinic));
  }, [clinic]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
  }, [patients]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Helper to generate unique reference e.g. DF-8419
  const generateReference = (): string => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `DF-${randomNum}`;
  };

  // Book appointment
  const bookAppointment = (data: {
    patientName: string;
    patientPhone: string;
    patientEmail?: string;
    patientAge?: number;
    patientGender?: 'Male' | 'Female' | 'Other';
    serviceId: string;
    date: string;
    timeSlot: string;
    reason: string;
  }) => {
    // 1. Duplicate check for active slots in this browser
    const existing = appointments.find(
      apt => apt.date === data.date && 
             apt.timeSlot === data.timeSlot && 
             apt.status !== 'cancelled'
    );

    if (existing) {
      const errorMsg = `The slot ${data.timeSlot} on ${data.date} is already booked for ${existing.patientName}. Please choose another time.`;
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    // 2. Lookup service
    const service = services.find(s => s.id === data.serviceId) || services[0];

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      bookingReference: generateReference(),
      patientName: data.patientName.trim(),
      patientPhone: data.patientPhone.trim(),
      patientEmail: data.patientEmail?.trim() || '',
      patientAge: data.patientAge,
      patientGender: data.patientGender || 'Male',
      serviceId: service.id,
      serviceName: service.name,
      feePkr: service.pricePkr,
      date: data.date,
      timeSlot: data.timeSlot,
      reason: data.reason.trim(),
      status: 'confirmed',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Also update or add patient record
    setPatients(prev => {
      const existingPatient = prev.find(p => p.phone === data.patientPhone.trim());
      if (existingPatient) {
        return prev.map(p => 
          p.id === existingPatient.id 
            ? {
                ...p,
                totalVisits: p.totalVisits + 1,
                lastVisitDate: data.date,
                totalSpentPkr: p.totalSpentPkr + service.pricePkr,
              }
            : p
        );
      } else {
        const newPatient: PatientRecord = {
          id: `pat-${Date.now()}`,
          name: data.patientName.trim(),
          phone: data.patientPhone.trim(),
          email: data.patientEmail?.trim() || '',
          gender: data.patientGender || 'Male',
          age: data.patientAge || 35,
          bloodGroup: 'B+',
          address: 'Lahore, Pakistan',
          totalVisits: 1,
          lastVisitDate: data.date,
          totalSpentPkr: service.pricePkr,
          allergies: 'None recorded',
          medicalHistoryNotes: data.reason,
        };
        return [newPatient, ...prev];
      }
    });

    showToast(`Appointment confirmed! Booking Reference: ${newAppointment.bookingReference}`, 'success');
    return { success: true, appointment: newAppointment };
  };

  const updateAppointmentStatus = (id: string, status: AppointmentStatus) => {
    setAppointments(prev =>
      prev.map(apt => {
        if (apt.id === id) {
          const updated = { ...apt, status };
          if (status === 'completed') {
            updated.paymentStatus = 'paid';
          }
          return updated;
        }
        return apt;
      })
    );
    showToast(`Appointment status updated to ${status.toUpperCase()}`, 'info');
  };

  const updateAppointmentPayment = (id: string, paymentStatus: 'paid' | 'pending') => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? { ...apt, paymentStatus } : apt))
    );
    showToast(`Payment marked as ${paymentStatus.toUpperCase()}`, 'info');
  };

  const rescheduleAppointment = (id: string, newDate: string, newTimeSlot: string) => {
    // Check if new slot is taken
    const existing = appointments.find(
      apt => apt.id !== id && 
             apt.date === newDate && 
             apt.timeSlot === newTimeSlot && 
             apt.status !== 'cancelled'
    );

    if (existing) {
      const errorMsg = `Slot ${newTimeSlot} on ${newDate} is already reserved. Please select another slot.`;
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }

    setAppointments(prev =>
      prev.map(apt =>
        apt.id === id ? { ...apt, date: newDate, timeSlot: newTimeSlot, status: 'confirmed' } : apt
      )
    );
    showToast(`Appointment rescheduled to ${newDate} at ${newTimeSlot}`, 'success');
    return { success: true };
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    showToast('Appointment removed from records', 'info');
  };

  const updateDoctorProfile = (profile: Partial<DoctorProfile>) => {
    setDoctor(prev => ({ ...prev, ...profile }));
    showToast('Doctor profile details saved', 'success');
  };

  const updateClinicInfo = (info: Partial<ClinicInfo>) => {
    setClinic(prev => ({ ...prev, ...info }));
    showToast('Clinic settings updated successfully', 'success');
  };

  const addService = (newSrv: Omit<Service, 'id'>) => {
    const srv: Service = {
      ...newSrv,
      id: `srv-${Date.now()}`,
    };
    setServices(prev => [...prev, srv]);
    showToast(`Service "${srv.name}" added to clinic offerings`, 'success');
  };

  const updateService = (updated: Service) => {
    setServices(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    showToast(`Service "${updated.name}" updated`, 'success');
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    showToast('Service removed from clinic list', 'info');
  };

  const addPatient = (data: Partial<PatientRecord> & { name: string; phone: string }) => {
    const newPat: PatientRecord = {
      id: `pat-${Date.now()}`,
      name: data.name,
      phone: data.phone,
      email: data.email || '',
      gender: data.gender || 'Male',
      age: data.age || 40,
      bloodGroup: data.bloodGroup || 'A+',
      emergencyContact: data.emergencyContact || 'Family member',
      address: data.address || 'Lahore, Pakistan',
      totalVisits: 1,
      lastVisitDate: new Date().toISOString().split('T')[0],
      totalSpentPkr: 2500,
      allergies: data.allergies || 'None',
      medicalHistoryNotes: data.medicalHistoryNotes || '',
    };
    setPatients(prev => [newPat, ...prev]);
    showToast(`Patient profile for ${newPat.name} created`, 'success');
    return newPat;
  };

  const updatePatient = (updated: PatientRecord) => {
    setPatients(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    showToast(`Patient record for ${updated.name} updated`, 'success');
  };

  const resetDemoData = () => {
    setDoctor(INITIAL_DOCTOR);
    setClinic(INITIAL_CLINIC);
    setServices(INITIAL_SERVICES);
    setAppointments(INITIAL_APPOINTMENTS);
    setPatients(INITIAL_PATIENTS);

    localStorage.setItem(STORAGE_KEYS.DOCTOR, JSON.stringify(INITIAL_DOCTOR));
    localStorage.setItem(STORAGE_KEYS.CLINIC, JSON.stringify(INITIAL_CLINIC));
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(INITIAL_SERVICES));
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(INITIAL_APPOINTMENTS));
    localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(INITIAL_PATIENTS));

    showToast('Demo data successfully restored to original sample state!', 'success');
  };

  const exportAppointmentsCsv = (appointmentsToExport?: Appointment[]) => {
    const list = appointmentsToExport || appointments;
    if (list.length === 0) {
      showToast('No appointment records found to export.', 'error');
      return;
    }

    const headers = [
      'Booking Reference',
      'Patient Name',
      'Phone Number',
      'Email',
      'Gender',
      'Age',
      'Service',
      'Fee (PKR)',
      'Date',
      'Time Slot',
      'Status',
      'Payment Status',
      'Reason / Symptoms',
      'Doctor Notes'
    ];

    const rows = list.map(apt => [
      `"${apt.bookingReference}"`,
      `"${apt.patientName.replace(/"/g, '""')}"`,
      `"${apt.patientPhone}"`,
      `"${apt.patientEmail || ''}"`,
      `"${apt.patientGender || ''}"`,
      `"${apt.patientAge || ''}"`,
      `"${apt.serviceName.replace(/"/g, '""')}"`,
      `"${apt.feePkr}"`,
      `"${apt.date}"`,
      `"${apt.timeSlot}"`,
      `"${apt.status.toUpperCase()}"`,
      `"${apt.paymentStatus.toUpperCase()}"`,
      `"${(apt.reason || '').replace(/"/g, '""')}"`,
      `"${(apt.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DoctorFlow_Appointments_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast('CSV report generated and downloaded successfully', 'success');
  };

  return (
    <ClinicContext.Provider
      value={{
        doctor,
        clinic,
        services,
        appointments,
        patients,
        activeView,
        setActiveView,
        toasts,
        showToast,
        removeToast,
        bookAppointment,
        updateAppointmentStatus,
        updateAppointmentPayment,
        rescheduleAppointment,
        deleteAppointment,
        updateDoctorProfile,
        updateClinicInfo,
        addService,
        updateService,
        deleteService,
        addPatient,
        updatePatient,
        resetDemoData,
        exportAppointmentsCsv,
        printableReceiptAppointment,
        setPrintableReceiptAppointment,
        newAppointmentModalOpen,
        setNewAppointmentModalOpen,
      }}
    >
      {children}
    </ClinicContext.Provider>
  );
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error('useClinic must be used within a ClinicProvider');
  }
  return context;
};
