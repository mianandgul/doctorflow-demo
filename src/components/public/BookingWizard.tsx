import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  RotateCcw,
  Check,
  ChevronLeft
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, Service } from '../../types';
import { AVAILABLE_TIME_SLOTS } from '../../data/initialData';

interface BookingWizardProps {
  initialServiceId?: string;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({ initialServiceId }) => {
  const { 
    doctor, 
    clinic, 
    services, 
    appointments, 
    bookAppointment, 
    setActiveView, 
    setPrintableReceiptAppointment 
  } = useClinic();

  // Form State
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServiceId || services[0]?.id || ''
  );
  
  // Compute default date (today)
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState<string>('42');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [reason, setReason] = useState('');

  // Validation & Submission State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Sync initialServiceId if passed from outside
  useEffect(() => {
    if (initialServiceId) {
      setSelectedServiceId(initialServiceId);
    }
  }, [initialServiceId]);

  // Generate upcoming 10 selectable dates
  const availableDates: { dateStr: string; label: string; dayName: string }[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
    const isToday = i === 0;
    const isTomorrow = i === 1;
    const label = isToday ? 'Today' : isTomorrow ? 'Tomorrow' : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // Skip Sunday if clinic is closed on Sunday
    const isSunday = d.getDay() === 0;
    if (!isSunday) {
      availableDates.push({ dateStr, label, dayName });
    }
  }

  // Active service details
  const activeService: Service | undefined = services.find(s => s.id === selectedServiceId) || services[0];

  // Helper to check if a specific time slot on the selected date is already booked
  const isSlotBooked = (slot: string): boolean => {
    return appointments.some(
      apt => apt.date === selectedDate && 
             apt.timeSlot === slot && 
             apt.status !== 'cancelled'
    );
  };

  const getSlotBookedPatient = (slot: string): string | null => {
    const apt = appointments.find(
      a => a.date === selectedDate && a.timeSlot === slot && a.status !== 'cancelled'
    );
    return apt ? apt.patientName : null;
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!patientName.trim()) {
      errs.patientName = 'Patient full name is required';
    } else if (patientName.trim().length < 3) {
      errs.patientName = 'Please enter a valid name (at least 3 characters)';
    }

    if (!patientPhone.trim()) {
      errs.patientPhone = 'Phone number is required for appointment confirmation';
    } else if (patientPhone.trim().length < 7) {
      errs.patientPhone = 'Please enter a valid phone number';
    }

    if (!selectedServiceId) {
      errs.service = 'Please select a clinical service';
    }

    if (!selectedDate) {
      errs.date = 'Please select an appointment date';
    }

    if (!selectedTimeSlot) {
      errs.timeSlot = 'Please select an available consultation time slot';
    } else if (isSlotBooked(selectedTimeSlot)) {
      errs.timeSlot = 'This time slot was just reserved. Please pick another slot.';
    }

    if (!reason.trim()) {
      errs.reason = 'Please briefly state the reason for consultation or symptoms';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate instant smooth processing
    setTimeout(() => {
      const res = bookAppointment({
        patientName,
        patientPhone,
        patientEmail,
        patientAge: patientAge ? parseInt(patientAge, 10) : undefined,
        patientGender,
        serviceId: selectedServiceId,
        date: selectedDate,
        timeSlot: selectedTimeSlot,
        reason,
      });

      setIsSubmitting(false);

      if (res.success && res.appointment) {
        setConfirmedBooking(res.appointment);
      }
    }, 400);
  };

  // Reset form for new booking
  const handleBookAnother = () => {
    setConfirmedBooking(null);
    setSelectedTimeSlot('');
    setReason('');
    setPatientName('');
    setPatientPhone('');
  };

  // ----------------------------------------------------
  // CONFIRMATION SCREEN (When booking succeeds)
  // ----------------------------------------------------
  if (confirmedBooking) {
    return (
      <div className="py-12 bg-slate-50 min-h-screen">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          
          <div className="bg-white rounded-3xl shadow-xl border border-teal-200/80 overflow-hidden">
            
            {/* Success Header banner */}
            <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-8 text-center text-white relative">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                Appointment Reserved Successfully!
              </h2>
              <p className="text-teal-100 text-xs sm:text-sm mt-1">
                Your consultation has been recorded in the DoctorFlow clinic system.
              </p>

              {/* Reference tag */}
              <div className="mt-4 inline-block bg-white text-slate-900 px-4 py-1.5 rounded-full font-mono font-bold text-sm shadow-md">
                Demo Reference: <span className="text-teal-700">{confirmedBooking.bookingReference}</span>
              </div>
            </div>

            {/* Demonstration Notice */}
            <div className="bg-amber-500/10 border-b border-amber-300/40 p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 leading-relaxed">
                <span className="font-bold">DEMONSTRATION ONLY: </span>
                This is a local demonstration. No real notification is sent to a medical center. You can verify this booking immediately in the Doctor Admin Dashboard below!
              </div>
            </div>

            {/* Appointment Details Grid */}
            <div className="p-6 sm:p-8 space-y-6">
              
              <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Consultant Doctor</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{doctor.name}</span>
                  <span className="text-teal-700 text-xs">{doctor.qualifications}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Clinic Service</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{confirmedBooking.serviceName}</span>
                  <span className="text-slate-600 text-xs font-semibold">Fee: Rs. {confirmedBooking.feePkr.toLocaleString()}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Appointment Date</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{confirmedBooking.date}</span>
                  <span className="text-teal-600 font-semibold text-xs">{confirmedBooking.timeSlot}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[11px] uppercase font-semibold">Patient Information</span>
                  <span className="font-bold text-slate-900 mt-0.5 block">{confirmedBooking.patientName}</span>
                  <span className="text-slate-600 text-xs">{confirmedBooking.patientPhone}</span>
                </div>
              </div>

              {/* Clinic Address Info */}
              <div className="p-4 rounded-xl bg-teal-50/50 border border-teal-100 text-xs text-slate-700 space-y-1">
                <span className="font-bold text-teal-900 block">{clinic.clinicName}</span>
                <p>{clinic.address}, {clinic.city}</p>
                <p className="text-teal-700 font-medium">Clinic Helpline: {clinic.phone}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                
                <button
                  onClick={() => setActiveView('dashboard')}
                  className="w-full py-3.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <ExternalLink className="w-4 h-4 text-teal-400" />
                  <span>View This Booking in Doctor Admin Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex gap-3">
                  <button
                    onClick={() => setPrintableReceiptAppointment(confirmedBooking)}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4 text-slate-500" />
                    <span>Print Consultation Slip</span>
                  </button>

                  <button
                    onClick={handleBookAnother}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4 text-slate-500" />
                    <span>Book Another Appointment</span>
                  </button>
                </div>

              </div>

            </div>

          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // BOOKING FORM WIZARD
  // ----------------------------------------------------
  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Form Title & Context */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Real-Time Slot Reservation
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Book an Appointment with {doctor.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Select your desired healthcare service, date, and verified open slot. Duplicate bookings for the same time are automatically blocked.
          </p>
        </div>

        {/* Demo Mode Notice */}
        <div className="bg-amber-500/10 border border-amber-300/50 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed">
            <span className="font-bold">DEMO MODE NOTICE: </span>
            This appointment booking form is a fully interactive demonstration for potential clinic software clients. No actual SMS or clinic booking is dispatched. All data is saved in your browser's localStorage.
          </div>
        </div>

        {/* Main Booking Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* STEP 1: SELECT SERVICE */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">1</span>
                  <span>Select Consultation or Diagnostic Service</span>
                </label>
                {activeService && (
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
                    Fee: Rs. {activeService.pricePkr.toLocaleString()}
                  </span>
                )}
              </div>

              {errors.service && (
                <p className="text-xs text-rose-600 font-semibold">{errors.service}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {services.map(service => {
                  const isSelected = service.id === selectedServiceId;
                  return (
                    <button
                      type="button"
                      key={service.id}
                      onClick={() => setSelectedServiceId(service.id)}
                      className={`p-3.5 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-500/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                            {service.category}
                          </span>
                          <span className="text-slate-400 text-[11px]">{service.durationMinutes}m</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-1">
                          {service.name}
                        </h4>
                      </div>
                      <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between">
                        <span className="text-xs font-extrabold text-teal-800">
                          Rs. {service.pricePkr.toLocaleString()}
                        </span>
                        {isSelected && (
                          <div className="w-4 h-4 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px]">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: DATE SELECTION */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">2</span>
                <span>Choose Consultation Date</span>
              </label>

              {errors.date && (
                <p className="text-xs text-rose-600 font-semibold">{errors.date}</p>
              )}

              {/* Scrollable / Flexible date pill selector */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {availableDates.map(item => {
                  const isSelected = item.dateStr === selectedDate;
                  return (
                    <button
                      type="button"
                      key={item.dateStr}
                      onClick={() => {
                        setSelectedDate(item.dateStr);
                        setSelectedTimeSlot(''); // Reset slot on date change
                      }}
                      className={`min-w-22 p-2.5 rounded-xl border text-center transition-all cursor-pointer shrink-0 ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-teal-100' : 'text-slate-400'}`}>
                        {item.dayName}
                      </div>
                      <div className="text-sm font-extrabold mt-0.5">
                        {item.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 3: TIME SLOT SELECTION (WITH LIVE DUPLICATE PREVENTION) */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">3</span>
                  <span>Select Time Slot ({selectedDate})</span>
                </label>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-white border border-teal-600" />
                    Available
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-100 border border-rose-300" />
                    Booked (Unavailable)
                  </span>
                </div>
              </div>

              {errors.timeSlot && (
                <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.timeSlot}</span>
                </div>
              )}

              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {AVAILABLE_TIME_SLOTS.map(slot => {
                  const booked = isSlotBooked(slot);
                  const bookedPatient = booked ? getSlotBookedPatient(slot) : null;
                  const isSelected = selectedTimeSlot === slot;

                  if (booked) {
                    return (
                      <div
                        key={slot}
                        title={`Already booked for demo patient (${bookedPatient})`}
                        className="p-2.5 rounded-xl border border-rose-200/80 bg-rose-50/60 text-slate-400 text-center cursor-not-allowed select-none relative group"
                      >
                        <span className="text-xs line-through block font-medium text-rose-400/90">{slot}</span>
                        <span className="text-[9px] font-bold text-rose-600 uppercase tracking-tighter block">Booked</span>
                      </div>
                    );
                  }

                  return (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-teal-500 hover:bg-teal-50/40 text-xs font-semibold'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: PATIENT DETAILS */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs">4</span>
                <span>Patient Contact & Details</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Patient Name */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Patient Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="e.g. Tariq Mahmood"
                      value={patientName}
                      onChange={e => setPatientName(e.target.value)}
                      className={`w-full pl-9.5 pr-3 py-2 text-sm rounded-xl border outline-hidden transition-all ${
                        errors.patientName ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                      }`}
                    />
                  </div>
                  {errors.patientName && (
                    <p className="text-xs text-rose-600 mt-1">{errors.patientName}</p>
                  )}
                </div>

                {/* Patient Phone */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp Number *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+92 300 1234567"
                      value={patientPhone}
                      onChange={e => setPatientPhone(e.target.value)}
                      className={`w-full pl-9.5 pr-3 py-2 text-sm rounded-xl border outline-hidden transition-all ${
                        errors.patientPhone ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                      }`}
                    />
                  </div>
                  {errors.patientPhone && (
                    <p className="text-xs text-rose-600 mt-1">{errors.patientPhone}</p>
                  )}
                </div>

                {/* Patient Email (Optional) */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="patient@example.com"
                      value={patientEmail}
                      onChange={e => setPatientEmail(e.target.value)}
                      className="w-full pl-9.5 pr-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                </div>

                {/* Age & Gender */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Age
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="115"
                      value={patientAge}
                      onChange={e => setPatientAge(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Gender
                    </label>
                    <select
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value as any)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Consultation Reason */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Consultation / Current Symptoms *
                </label>
                <div className="relative">
                  <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    rows={3}
                    placeholder="Describe main concern (e.g. high blood pressure readings, chest heaviness, heart palpitations, follow-up check)..."
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    className={`w-full pl-9.5 pr-3 py-2 text-sm rounded-xl border outline-hidden transition-all ${
                      errors.reason ? 'border-rose-400 ring-2 ring-rose-100' : 'border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-100'
                    }`}
                  />
                </div>
                {errors.reason && (
                  <p className="text-xs text-rose-600 mt-1">{errors.reason}</p>
                )}
              </div>

            </div>

            {/* SUMMARY & SUBMIT */}
            <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-500 text-center sm:text-left">
                <p>
                  Selected Slot:{' '}
                  <span className="font-bold text-slate-900">
                    {selectedDate} at {selectedTimeSlot || '—'}
                  </span>
                </p>
                <p>
                  Payable at Clinic:{' '}
                  <span className="font-bold text-teal-700">
                    Rs. {activeService?.pricePkr.toLocaleString()}
                  </span>
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <span>Confirm & Book Appointment</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
