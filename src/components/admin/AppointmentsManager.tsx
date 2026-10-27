import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Printer, 
  Trash2, 
  CalendarClock, 
  Plus, 
  LayoutList, 
  CalendarDays,
  User, 
  Phone, 
  CreditCard, 
  X,
  AlertCircle
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment, AppointmentStatus } from '../../types';
import { AVAILABLE_TIME_SLOTS } from '../../data/initialData';

export const AppointmentsManager: React.FC = () => {
  const { 
    appointments, 
    services, 
    updateAppointmentStatus, 
    updateAppointmentPayment,
    rescheduleAppointment, 
    deleteAppointment, 
    setPrintableReceiptAppointment,
    setNewAppointmentModalOpen 
  } = useClinic();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [dateRangeFilter, setDateRangeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // Reschedule Modal State
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter logic
  const filteredAppointments = appointments.filter(apt => {
    // Search match
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      apt.patientName.toLowerCase().includes(q) ||
      apt.patientPhone.includes(q) ||
      apt.bookingReference.toLowerCase().includes(q) ||
      apt.serviceName.toLowerCase().includes(q);

    // Status match
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;

    // Service match
    const matchesService = serviceFilter === 'all' || apt.serviceId === serviceFilter;

    // Date range match
    let matchesDate = true;
    if (dateRangeFilter === 'today') {
      matchesDate = apt.date === todayStr;
    } else if (dateRangeFilter === 'upcoming') {
      matchesDate = apt.date >= todayStr;
    } else if (dateRangeFilter === 'past') {
      matchesDate = apt.date < todayStr;
    }

    return matchesSearch && matchesStatus && matchesService && matchesDate;
  });

  // Open reschedule dialog
  const handleOpenReschedule = (apt: Appointment) => {
    setRescheduleTarget(apt);
    setNewDate(apt.date);
    setNewTimeSlot(apt.timeSlot);
    setRescheduleError('');
  };

  const handleSaveReschedule = () => {
    if (!rescheduleTarget || !newDate || !newTimeSlot) return;

    const res = rescheduleAppointment(rescheduleTarget.id, newDate, newTimeSlot);
    if (res.success) {
      setRescheduleTarget(null);
    } else {
      setRescheduleError(res.error || 'Failed to reschedule.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Appointments & Clinic Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Manage scheduled patient consultations, update statuses, and print receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View switcher */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'list' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-4 h-4" />
              <span className="hidden sm:inline">List View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === 'calendar' ? 'bg-white shadow-xs text-slate-900' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-4 h-4" />
              <span className="hidden sm:inline">Schedule Grid</span>
            </button>
          </div>

          <button
            onClick={() => setNewAppointmentModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Walk-in</span>
          </button>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          
          {/* Search bar */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by patient name, phone, or reference (DF-...)"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-2">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="sm:col-span-2">
            <select
              value={dateRangeFilter}
              onChange={e => setDateRangeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
            >
              <option value="all">All Dates</option>
              <option value="today">Today Only</option>
              <option value="upcoming">Upcoming</option>
              <option value="past">Past Records</option>
            </select>
          </div>

          {/* Service Filter */}
          <div className="sm:col-span-3">
            <select
              value={serviceFilter}
              onChange={e => setServiceFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
            >
              <option value="all">All Services</option>
              {services.map(s => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* Active Filter Tags */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
          <span>Showing {filteredAppointments.length} of {appointments.length} appointments</span>
          {(searchTerm || statusFilter !== 'all' || serviceFilter !== 'all' || dateRangeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setServiceFilter('all');
                setDateRangeFilter('all');
              }}
              className="text-teal-600 hover:underline font-semibold cursor-pointer"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* VIEW: LIST MODE */}
      {viewMode === 'list' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
          {filteredAppointments.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <CalendarIcon className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-base font-semibold text-slate-700">No appointments found matching current filter</p>
              <p className="text-xs text-slate-400">Try adjusting your search criteria or add a new walk-in patient.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                    <th className="py-3 px-4">Ref & Patient</th>
                    <th className="py-3 px-4">Service</th>
                    <th className="py-3 px-4">Schedule</th>
                    <th className="py-3 px-4">Fee & Payment</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map(apt => (
                    <tr key={apt.id} className="hover:bg-slate-50/60 transition-colors">
                      
                      {/* Patient & Ref */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{apt.patientName}</span>
                          {apt.patientAge && (
                            <span className="text-[11px] font-normal text-slate-400">
                              ({apt.patientAge}y, {apt.patientGender})
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-teal-700 font-bold bg-teal-50 px-1 rounded text-[11px]">
                            {apt.bookingReference}
                          </span>
                          <span>•</span>
                          <span>{apt.patientPhone}</span>
                        </div>
                        {apt.reason && (
                          <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-1 max-w-xs">
                            "{apt.reason}"
                          </p>
                        )}
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {apt.serviceName}
                      </td>

                      {/* Schedule */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">
                          {apt.date}
                        </div>
                        <div className="text-xs text-teal-600 font-bold">
                          {apt.timeSlot}
                        </div>
                      </td>

                      {/* Fee & Payment Status */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">
                          Rs. {apt.feePkr.toLocaleString()}
                        </div>
                        <button
                          onClick={() => updateAppointmentPayment(
                            apt.id, 
                            apt.paymentStatus === 'paid' ? 'pending' : 'paid'
                          )}
                          title="Click to toggle payment status"
                          className={`mt-0.5 inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded cursor-pointer transition-colors ${
                            apt.paymentStatus === 'paid'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                        >
                          {apt.paymentStatus === 'paid' ? 'Paid ✓' : 'Unpaid (Pending)'}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                          apt.status === 'confirmed' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                          apt.status === 'pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          apt.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                          'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          {apt.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {apt.status === 'pending' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                              className="px-2 py-1 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                              title="Confirm appointment"
                            >
                              Confirm
                            </button>
                          )}

                          {apt.status === 'confirmed' && (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                              className="px-2 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                              title="Mark as completed & paid"
                            >
                              Complete
                            </button>
                          )}

                          <button
                            onClick={() => handleOpenReschedule(apt)}
                            title="Reschedule to another slot"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            <CalendarClock className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setPrintableReceiptAppointment(apt)}
                            title="Print medical consultation slip"
                            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                          >
                            <Printer className="w-4 h-4" />
                          </button>

                          {apt.status !== 'cancelled' ? (
                            <button
                              onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                              title="Cancel appointment"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 cursor-pointer"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => deleteAppointment(apt.id)}
                              title="Delete record from demo"
                              className="p-1.5 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* VIEW: SCHEDULE CALENDAR GRID */}
      {viewMode === 'calendar' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-base">
              Hourly Appointment Grid
            </h3>
            <span className="text-xs text-slate-500">
              Slots mapped across clinic consulting hours
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {AVAILABLE_TIME_SLOTS.map(slot => {
              const matches = appointments.filter(a => a.timeSlot === slot && a.status !== 'cancelled');
              const hasBooking = matches.length > 0;

              return (
                <div
                  key={slot}
                  className={`p-4 rounded-xl border transition-all ${
                    hasBooking
                      ? 'bg-teal-50/40 border-teal-200'
                      : 'bg-slate-50/40 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      {slot}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      hasBooking ? 'bg-teal-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {hasBooking ? `${matches.length} Scheduled` : 'Open'}
                    </span>
                  </div>

                  {hasBooking ? (
                    <div className="space-y-2 mt-2">
                      {matches.map(m => (
                        <div key={m.id} className="bg-white p-2.5 rounded-lg border border-teal-100 shadow-2xs text-xs space-y-1">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{m.patientName}</span>
                            <span className="text-teal-700 font-mono text-[11px]">{m.bookingReference}</span>
                          </div>
                          <p className="text-slate-500 text-[11px]">{m.date} • {m.serviceName}</p>
                          <div className="flex items-center justify-between pt-1">
                            <span className="text-[10px] font-bold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                              {m.status}
                            </span>
                            <button
                              onClick={() => setPrintableReceiptAppointment(m)}
                              className="text-teal-600 hover:underline text-[11px] font-semibold cursor-pointer"
                            >
                              Slip ↗
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 mt-2 italic">
                      Slot currently available
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-teal-600" />
                <h3 className="font-bold text-slate-900 text-base">
                  Reschedule Appointment
                </h3>
              </div>
              <button
                onClick={() => setRescheduleTarget(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 border border-slate-100">
              <p><span className="font-bold text-slate-800">Patient:</span> {rescheduleTarget.patientName}</p>
              <p><span className="font-bold text-slate-800">Service:</span> {rescheduleTarget.serviceName}</p>
              <p><span className="font-bold text-slate-800">Current Slot:</span> {rescheduleTarget.date} at {rescheduleTarget.timeSlot}</p>
            </div>

            {rescheduleError && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{rescheduleError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select New Date
                </label>
                <input
                  type="date"
                  value={newDate}
                  min={todayStr}
                  onChange={e => setNewDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select New Time Slot
                </label>
                <select
                  value={newTimeSlot}
                  onChange={e => setNewTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
                >
                  <option value="">Select a time slot...</option>
                  {AVAILABLE_TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setRescheduleTarget(null)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveReschedule}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white cursor-pointer shadow-xs"
              >
                Save New Slot
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
