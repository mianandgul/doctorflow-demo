import React from 'react';
import { 
  ShieldCheck, 
  Star, 
  Clock, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  HeartHandshake, 
  Activity, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const Hero: React.FC = () => {
  const { doctor, clinic, setActiveView } = useClinic();

  const handleWhatsAppClick = () => {
    const cleanNumber = clinic.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello Dr. Ahmed Khan's clinic, I would like to inquire about an appointment.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-teal-50/50 via-white to-slate-50 pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Decorative background grid and gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:24px_24px] opacity-15 pointer-events-none" />
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/80 border border-teal-200 text-teal-800 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Modern Medical Practice & Clinic Management Demo</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Compassionate, Expert Heart Care by{' '}
              <span className="text-teal-600 relative inline-block">
                {doctor.name}
                <svg className="absolute -bottom-1 left-0 w-full text-teal-400/40" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0,5 Q50,0 100,5" stroke="currentColor" strokeWidth="3" fill="none" />
                </svg>
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {doctor.title} with 15+ years of specialized hospital and clinical experience. Dedicated to hypertension control, advanced cardiac diagnostics, and preventative heart wellness.
            </p>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-700">
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs font-medium">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>PMDC Reg # {doctor.pmdcRegistration.split(' ')[0]}</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs font-medium">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>{doctor.rating} / 5.0 Rating ({doctor.reviewCount} Reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs font-medium">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>{clinic.workingHoursStart} – {clinic.workingHoursEnd}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={() => setActiveView('book')}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-600 text-white font-bold text-sm hover:bg-teal-700 shadow-md shadow-teal-600/25 transition-all hover:scale-[1.01] cursor-pointer"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment Online</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={handleWhatsAppClick}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>WhatsApp Clinic</span>
              </button>

              <button
                onClick={() => setActiveView('dashboard')}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Open Demo Dashboard</span>
              </button>
            </div>

            {/* Notice */}
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-500">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              <span>Instant slot reservation with automated booking reference. Demo data stored in browser.</span>
            </div>
          </div>

          {/* Right Column: Doctor Profile Card */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
              
              {/* Doctor Photo Header */}
              <div className="relative h-64 bg-slate-100 overflow-hidden">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-teal-500 text-white uppercase tracking-wider">
                      Verified Consultant
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-white/20 backdrop-blur-xs text-white">
                      15+ Years Experience
                    </span>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white drop-shadow-xs">
                    {doctor.name}
                  </h3>
                  <p className="text-xs text-teal-200 font-medium">
                    {doctor.qualifications}
                  </p>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4 text-sm">
                
                <div className="flex items-start gap-3 text-slate-600">
                  <HeartHandshake className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Clinic Location:</span>
                    <span className="text-xs">{clinic.clinicName}</span>
                    <p className="text-xs text-slate-500 mt-0.5">{clinic.address}, {clinic.city}</p>
                    <a
                      href={clinic.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-teal-600 font-medium hover:underline mt-1"
                    >
                      <span>Open in Google Maps</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block">Standard Consultation</span>
                    <span className="text-base font-bold text-slate-900">
                      Rs. {clinic.defaultConsultationFeePkr.toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-500 block">Timings</span>
                    <span className="text-xs font-semibold text-slate-800">
                      Mon – Sat ({clinic.workingHoursStart} - {clinic.workingHoursEnd})
                    </span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-3 flex gap-2">
                  <button
                    onClick={() => setActiveView('book')}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs text-center transition-colors cursor-pointer"
                  >
                    Select Slot & Book
                  </button>
                  <button
                    onClick={() => setActiveView('profile')}
                    className="py-2.5 px-3 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs text-center transition-colors cursor-pointer"
                  >
                    View Credentials
                  </button>
                </div>

              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
