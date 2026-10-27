import React from 'react';
import { Printer, X, ShieldCheck, HeartPulse } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const PrintableReceiptModal: React.FC = () => {
  const { doctor, clinic, printableReceiptAppointment, setPrintableReceiptAppointment } = useClinic();

  if (!printableReceiptAppointment) return null;

  const apt = printableReceiptAppointment;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static">
      
      {/* Modal Container */}
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 my-auto print:shadow-none print:border-none print:p-4 print:max-w-none print:w-full">
        
        {/* Modal Top Actions (Hidden in print) */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 print:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-md border border-teal-200">
            Consultation Slip & Receipt
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Slip</span>
            </button>
            <button
              onClick={() => setPrintableReceiptAppointment(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div id="printable-slip" className="space-y-6 text-slate-800">
          
          {/* Clinic Header */}
          <div className="border-b-2 border-teal-600 pb-4 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-teal-700 font-extrabold text-lg">
                <HeartPulse className="w-5 h-5" />
                <span>{clinic.clinicName}</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{clinic.address}, {clinic.city}</p>
              <p className="text-xs text-slate-500">Phone: {clinic.phone} • WhatsApp: {clinic.whatsapp}</p>
            </div>

            <div className="text-right">
              <h4 className="font-bold text-slate-900 text-sm">{doctor.name}</h4>
              <p className="text-xs text-teal-700 font-medium">{doctor.qualifications}</p>
              <p className="text-[11px] text-slate-400">PMDC #{doctor.pmdcRegistration.split(' ')[0]}</p>
            </div>
          </div>

          {/* Reference & Date Bar */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Booking Reference</span>
              <span className="font-mono font-bold text-slate-900 text-sm">{apt.bookingReference}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
              <span className="font-bold text-slate-900">{apt.date} at {apt.timeSlot}</span>
            </div>
          </div>

          {/* Patient Details Box */}
          <div className="grid grid-cols-2 gap-3 text-xs border border-slate-100 p-3.5 rounded-xl bg-white">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Patient Name:</span>
              <span className="font-bold text-slate-900 text-sm">{apt.patientName}</span>
              {apt.patientAge && (
                <span className="text-slate-500 text-xs block">{apt.patientAge} Years • {apt.patientGender}</span>
              )}
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Contact Mobile:</span>
              <span className="font-medium text-slate-800 text-xs">{apt.patientPhone}</span>
              {apt.patientEmail && (
                <span className="text-slate-400 text-[11px] block truncate">{apt.patientEmail}</span>
              )}
            </div>
          </div>

          {/* Service Itemized Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <div className="bg-slate-100 p-2.5 font-bold text-slate-700 flex justify-between">
              <span>Service Description</span>
              <span>Amount (PKR)</span>
            </div>
            <div className="p-3 flex justify-between items-center border-t border-slate-100">
              <div>
                <span className="font-bold text-slate-800">{apt.serviceName}</span>
                {apt.reason && (
                  <p className="text-[11px] text-slate-500 italic mt-0.5">Clinical reason: "{apt.reason}"</p>
                )}
              </div>
              <span className="font-bold text-slate-900 text-sm">
                Rs. {apt.feePkr.toLocaleString()}
              </span>
            </div>
            <div className="bg-slate-50 p-2.5 border-t border-slate-200 flex justify-between items-center font-bold">
              <span className="uppercase text-[11px] text-slate-600">Total Consultation Charges:</span>
              <span className="text-base text-teal-800">Rs. {apt.feePkr.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment & Stamp row */}
          <div className="flex items-center justify-between text-xs pt-2">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Payment Status</span>
              <span className={`inline-block mt-0.5 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[11px] ${
                apt.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {apt.paymentStatus === 'paid' ? 'Paid / Settled ✓' : 'Payment Pending at Reception'}
              </span>
            </div>

            <div className="text-right border-t border-slate-300 pt-2 min-w-36">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Authorized Signature</span>
              <span className="font-serif italic text-xs text-slate-700">{doctor.name}</span>
            </div>
          </div>

          {/* Demonstration Notice Watermark */}
          <div className="pt-3 border-t border-dashed border-slate-200 text-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
              DEMONSTRATION CONSULTATION RECEIPT • DOCTORFLOW CLINIC OS
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Generated in browser storage for demonstration purposes only.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
