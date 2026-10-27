import React from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  DollarSign, 
  ArrowUpRight, 
  Plus, 
  Download, 
  Eye, 
  Printer, 
  Stethoscope, 
  ShieldAlert,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const DashboardOverview: React.FC = () => {
  const { 
    doctor, 
    clinic, 
    appointments, 
    patients, 
    services, 
    setActiveView, 
    updateAppointmentStatus, 
    setPrintableReceiptAppointment, 
    setNewAppointmentModalOpen,
    exportAppointmentsCsv 
  } = useClinic();

  const todayStr = new Date().toISOString().split('T')[0];

  // Metrics
  const totalAppointments = appointments.length;
  const todayAppointments = appointments.filter(a => a.date === todayStr);
  const pendingAppointments = appointments.filter(a => a.status === 'pending');
  const completedAppointments = appointments.filter(a => a.status === 'completed');
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed');

  // Financial collections (PKR)
  const totalRevenue = appointments
    .filter(a => a.status !== 'cancelled' && a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.feePkr, 0);

  const pendingCollection = appointments
    .filter(a => a.status !== 'cancelled' && a.paymentStatus === 'pending')
    .reduce((sum, a) => sum + a.feePkr, 0);

  const todayRevenue = todayAppointments
    .filter(a => a.status !== 'cancelled' && a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.feePkr, 0);

  // Top services breakdown
  const serviceStats = services.map(service => {
    const count = appointments.filter(a => a.serviceId === service.id).length;
    const revenue = appointments
      .filter(a => a.serviceId === service.id && a.status !== 'cancelled')
      .reduce((sum, a) => sum + a.feePkr, 0);
    return {
      ...service,
      bookingCount: count,
      totalRevenue: revenue,
    };
  }).sort((a, b) => b.bookingCount - a.bookingCount);

  return (
    <div className="space-y-8">
      
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                Clinic Admin Console
              </span>
              <span className="text-xs text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {doctor.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {clinic.clinicName} • All patient bookings, queue status, and daily collection totals are synced below.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setNewAppointmentModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Walk-in Patient</span>
            </button>

            <button
              onClick={() => exportAppointmentsCsv()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-teal-300" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setActiveView('home')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
            >
              <span>Public Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* METRIC CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Appointments */}
        <div 
          onClick={() => setActiveView('appointments')} 
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Bookings
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {totalAppointments}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span className="text-teal-600 font-semibold">{confirmedAppointments.length} Confirmed</span>
            <span>•</span>
            <span className="text-amber-600 font-semibold">{pendingAppointments.length} Pending</span>
          </div>
        </div>

        {/* Today's Appointments */}
        <div 
          onClick={() => setActiveView('appointments')} 
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Today's Schedule
            </span>
            <div className="p-2 rounded-xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {todayAppointments.length}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span>Slots booked for today</span>
          </div>
        </div>

        {/* Completed / Total Patients */}
        <div 
          onClick={() => setActiveView('patients')} 
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Patients In System
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {patients.length}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span className="text-emerald-600 font-semibold">{completedAppointments.length}</span> completed consultations
          </div>
        </div>

        {/* Total Collections (PKR) */}
        <div 
          onClick={() => setActiveView('reports')} 
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Paid Collections
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-800 mt-2">
            Rs. {totalRevenue.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
            <span>Pending: Rs. {pendingCollection.toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* TODAY'S APPOINTMENT QUEUE & REVENUE BREAKDOWN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Today's Live Schedule */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>Today's Clinic Queue</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-xs font-bold">
                  {todayAppointments.length} patients
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time patient schedule for {todayStr}
              </p>
            </div>

            <button
              onClick={() => setActiveView('appointments')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 cursor-pointer"
            >
              <span>View All Bookings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {todayAppointments.length === 0 ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Calendar className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-sm font-medium">No appointments scheduled for today yet.</p>
              <button
                onClick={() => setNewAppointmentModalOpen(true)}
                className="mt-2 text-xs font-bold text-teal-600 hover:underline cursor-pointer"
              >
                + Book a Walk-in Patient
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {todayAppointments.map(apt => (
                <div key={apt.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 -mx-2 px-2 rounded-xl transition-colors">
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        {apt.timeSlot}
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {apt.patientName}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({apt.bookingReference})
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 flex flex-wrap items-center gap-2">
                      <span className="font-medium text-slate-700">{apt.serviceName}</span>
                      <span>•</span>
                      <span>{apt.patientPhone}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-900">Rs. {apt.feePkr.toLocaleString()}</span>
                    </div>

                    {apt.reason && (
                      <p className="text-xs text-slate-500 italic line-clamp-1">
                        "{apt.reason}"
                      </p>
                    )}
                  </div>

                  {/* Quick Action buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                      apt.status === 'confirmed' ? 'bg-teal-50 text-teal-800 border border-teal-200' :
                      apt.status === 'pending' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                      apt.status === 'completed' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {apt.status}
                    </span>

                    {apt.status === 'pending' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'confirmed')}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white cursor-pointer"
                      >
                        Confirm
                      </button>
                    )}

                    {apt.status === 'confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'completed')}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
                      >
                        Complete
                      </button>
                    )}

                    <button
                      onClick={() => setPrintableReceiptAppointment(apt)}
                      title="Print Consultation Slip"
                      className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* Services & Revenue Overview */}
        <div className="lg:col-span-4 space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900">
              Services Utilization
            </h3>

            <div className="space-y-4">
              {serviceStats.slice(0, 4).map(srv => {
                const percent = totalAppointments > 0 ? Math.round((srv.bookingCount / totalAppointments) * 100) : 0;
                return (
                  <div key={srv.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                        {srv.name}
                      </span>
                      <span className="text-slate-500 font-bold">
                        {srv.bookingCount} bookings ({percent}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-teal-600 rounded-full transition-all" 
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setActiveView('services')}
              className="w-full py-2 text-xs font-semibold text-teal-700 hover:text-teal-800 bg-teal-50/60 rounded-xl transition-colors cursor-pointer"
            >
              Manage Clinic Services & Pricing →
            </button>
          </div>

          {/* Quick Doctor / Clinic Summary Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={doctor.avatarUrl}
                alt={doctor.name}
                className="w-12 h-12 rounded-xl object-cover object-top border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{doctor.name}</h4>
                <p className="text-xs text-teal-700 font-medium">{doctor.specialization}</p>
                <p className="text-[11px] text-slate-400">PMDC #{doctor.pmdcRegistration.split(' ')[0]}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-600 space-y-1">
              <p><span className="font-semibold text-slate-800">Clinic:</span> {clinic.clinicName}</p>
              <p><span className="font-semibold text-slate-800">Hours:</span> {clinic.workingHoursStart} – {clinic.workingHoursEnd}</p>
              <p><span className="font-semibold text-slate-800">Contact:</span> {clinic.phone}</p>
            </div>

            <button
              onClick={() => setActiveView('settings')}
              className="w-full mt-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors cursor-pointer text-center block"
            >
              Edit Clinic Settings & Timings
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
