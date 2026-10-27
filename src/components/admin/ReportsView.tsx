import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Printer, 
  Calendar, 
  Filter, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Appointment } from '../../types';

export const ReportsView: React.FC = () => {
  const { appointments, services, exportAppointmentsCsv, setPrintableReceiptAppointment } = useClinic();
  
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');
  const [selectedReceiptAptId, setSelectedReceiptAptId] = useState<string>('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Date filtering logic
  const filteredAppointments = appointments.filter(apt => {
    if (dateFilter === 'all') return true;
    if (dateFilter === 'today') return apt.date === todayStr;

    const aptDate = new Date(apt.date);
    const now = new Date();

    if (dateFilter === 'week') {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      return aptDate >= oneWeekAgo && aptDate <= now;
    }

    if (dateFilter === 'month') {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      return aptDate >= oneMonthAgo && aptDate <= now;
    }

    if (dateFilter === 'custom') {
      if (customStart && apt.date < customStart) return false;
      if (customEnd && apt.date > customEnd) return false;
      return true;
    }

    return true;
  });

  // Financial aggregates
  const totalBookings = filteredAppointments.length;
  const completedCount = filteredAppointments.filter(a => a.status === 'completed').length;
  const confirmedCount = filteredAppointments.filter(a => a.status === 'confirmed').length;
  const pendingCount = filteredAppointments.filter(a => a.status === 'pending').length;
  const cancelledCount = filteredAppointments.filter(a => a.status === 'cancelled').length;

  const totalBilled = filteredAppointments
    .filter(a => a.status !== 'cancelled')
    .reduce((sum, a) => sum + a.feePkr, 0);

  const totalCollected = filteredAppointments
    .filter(a => a.status !== 'cancelled' && a.paymentStatus === 'paid')
    .reduce((sum, a) => sum + a.feePkr, 0);

  const pendingCollection = filteredAppointments
    .filter(a => a.status !== 'cancelled' && a.paymentStatus === 'pending')
    .reduce((sum, a) => sum + a.feePkr, 0);

  // By service breakdown
  const serviceBreakdown = services.map(srv => {
    const apts = filteredAppointments.filter(a => a.serviceId === srv.id && a.status !== 'cancelled');
    const totalRev = apts.reduce((sum, a) => sum + a.feePkr, 0);
    return {
      name: srv.name,
      count: apts.length,
      revenue: totalRev,
    };
  }).filter(s => s.count > 0);

  const handlePrintSelectedReceipt = () => {
    if (!selectedReceiptAptId) return;
    const target = appointments.find(a => a.id === selectedReceiptAptId);
    if (target) {
      setPrintableReceiptAppointment(target);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Clinic Revenue & Operational Reports
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Financial summaries, service metrics, CSV export, and demo receipt printer
          </p>
        </div>

        <button
          onClick={() => exportAppointmentsCsv(filteredAppointments)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Download Filtered CSV</span>
        </button>
      </div>

      {/* DATE RANGE FILTER BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Filter className="w-4 h-4 text-teal-600" />
            <span>Reporting Period Filter:</span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'Past 7 Days' },
              { id: 'month', label: 'Past 30 Days' },
              { id: 'custom', label: 'Custom Range' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setDateFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  dateFilter === tab.id
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {dateFilter === 'custom' && (
          <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">From:</span>
              <input
                type="date"
                value={customStart}
                onChange={e => setCustomStart(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-600">To:</span>
              <input
                type="date"
                value={customEnd}
                onChange={e => setCustomEnd(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200"
              />
            </div>
          </div>
        )}
      </div>

      {/* FINANCIAL TOTALS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Billed Value
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">
            Rs. {totalBilled.toLocaleString()}
          </div>
          <p className="text-xs text-slate-500">
            Across {totalBookings} scheduled appointments in period
          </p>
        </div>

        <div className="bg-emerald-50/60 p-6 rounded-2xl border border-emerald-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
            Total Cash Collected
          </span>
          <div className="text-2xl sm:text-3xl font-black text-emerald-900">
            Rs. {totalCollected.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-800/80">
            Consultations confirmed with completed payment
          </p>
        </div>

        <div className="bg-amber-50/60 p-6 rounded-2xl border border-amber-200 shadow-2xs space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Pending / Receivable
          </span>
          <div className="text-2xl sm:text-3xl font-black text-amber-900">
            Rs. {pendingCollection.toLocaleString()}
          </div>
          <p className="text-xs text-amber-800/80">
            Awaiting patient arrival or reception check-in
          </p>
        </div>

      </div>

      {/* APPOINTMENT STATUS RATIOS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs font-bold text-slate-500 block">Completed</span>
          <span className="text-xl font-black text-emerald-600 mt-1 block">{completedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs font-bold text-slate-500 block">Confirmed</span>
          <span className="text-xl font-black text-teal-600 mt-1 block">{confirmedCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs font-bold text-slate-500 block">Pending</span>
          <span className="text-xl font-black text-amber-600 mt-1 block">{pendingCount}</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
          <span className="text-xs font-bold text-slate-500 block">Cancelled</span>
          <span className="text-xl font-black text-rose-500 mt-1 block">{cancelledCount}</span>
        </div>
      </div>

      {/* REVENUE BREAKDOWN BY SERVICE & PRINTABLE RECEIPT GENERATOR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Service Revenue Table */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900">
            Revenue Breakdown by Medical Service
          </h3>

          {serviceBreakdown.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No service bookings in this selected time range.</p>
          ) : (
            <div className="divide-y divide-slate-100 text-xs sm:text-sm">
              {serviceBreakdown.map(sb => (
                <div key={sb.name} className="py-3 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-800 block">{sb.name}</span>
                    <span className="text-slate-400 text-xs">{sb.count} consultations</span>
                  </div>
                  <div className="font-extrabold text-slate-900">
                    Rs. {sb.revenue.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* PRINTABLE RECEIPT SELECTOR */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <Printer className="w-5 h-5 text-teal-600" />
            <span>Generate Demo Receipt Slip</span>
          </div>

          <p className="text-xs text-slate-500">
            Pick any demo appointment to preview and generate a formatted, printable clinical consultation slip with clinic letterhead.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Appointment:
              </label>
              <select
                value={selectedReceiptAptId}
                onChange={e => setSelectedReceiptAptId(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
              >
                <option value="">Choose an appointment...</option>
                {appointments.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.bookingReference} — {a.patientName} ({a.date}, Rs. {a.feePkr})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handlePrintSelectedReceipt}
              disabled={!selectedReceiptAptId}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Printer className="w-4 h-4 text-teal-400" />
              <span>Preview & Print Consultation Slip</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
