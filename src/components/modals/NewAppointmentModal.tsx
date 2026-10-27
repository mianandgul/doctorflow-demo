import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, FileText, AlertCircle, Plus } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { AVAILABLE_TIME_SLOTS } from '../../data/initialData';

export const NewAppointmentModal: React.FC = () => {
  const { 
    newAppointmentModalOpen, 
    setNewAppointmentModalOpen, 
    services, 
    appointments, 
    bookAppointment 
  } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];

  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [patientAge, setPatientAge] = useState('45');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [serviceId, setServiceId] = useState(services[0]?.id || '');
  const [date, setDate] = useState(todayStr);
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('Walk-in general cardiac checkup and BP review.');
  const [error, setError] = useState('');

  if (!newAppointmentModalOpen) return null;

  // Check if slot taken
  const isSlotBooked = (slot: string) => {
    return appointments.some(a => a.date === date && a.timeSlot === slot && a.status !== 'cancelled');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      setError('Patient name is required');
      return;
    }
    if (!patientPhone.trim()) {
      setError('Patient phone is required');
      return;
    }
    if (!timeSlot) {
      setError('Please choose an available time slot');
      return;
    }

    const res = bookAppointment({
      patientName: patientName.trim(),
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim(),
      patientAge: parseInt(patientAge, 10) || 40,
      patientGender,
      serviceId,
      date,
      timeSlot,
      reason: reason.trim(),
    });

    if (res.success) {
      setNewAppointmentModalOpen(false);
      setPatientName('');
      setPatientPhone('');
      setTimeSlot('');
      setError('');
    } else {
      setError(res.error || 'Failed to book slot');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-auto animate-scale-in">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <Plus className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Book Walk-in Patient Appointment
            </h3>
          </div>
          <button
            onClick={() => setNewAppointmentModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Patient Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Zafar Iqbal"
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+92 300 1122334"
                value={patientPhone}
                onChange={e => setPatientPhone(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Age</label>
              <input
                type="number"
                value={patientAge}
                onChange={e => setPatientAge(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gender</label>
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
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Service</label>
              <select
                value={serviceId}
                onChange={e => setServiceId(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
              >
                {services.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} (Rs. {s.pricePkr})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Date *</label>
              <input
                type="date"
                required
                value={date}
                min={todayStr}
                onChange={e => {
                  setDate(e.target.value);
                  setTimeSlot('');
                }}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Time Slot *</label>
              <select
                required
                value={timeSlot}
                onChange={e => setTimeSlot(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
              >
                <option value="">Select slot...</option>
                {AVAILABLE_TIME_SLOTS.map(slot => {
                  const booked = isSlotBooked(slot);
                  return (
                    <option key={slot} value={slot} disabled={booked}>
                      {slot} {booked ? '(Already Booked)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Reason / Symptoms</label>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setNewAppointmentModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
            >
              Confirm Appointment
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
