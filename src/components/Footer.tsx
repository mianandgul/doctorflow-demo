import React from 'react';
import { 
  Activity, 
  MapPin, 
  Phone, 
  MessageSquare, 
  ShieldCheck, 
  Clock, 
  RotateCcw, 
  ExternalLink,
  Heart
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Footer: React.FC = () => {
  const { doctor, clinic, setActiveView, resetDemoData } = useClinic();

  const handleWhatsApp = () => {
    const cleanNumber = clinic.whatsapp.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}`, '_blank');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          
          {/* Brand & Doctor Info */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md">
                <Activity className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Doctor<span className="text-teal-400">Flow</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                CLINIC OS DEMO
              </span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Modern patient booking and clinical queue management solution designed for specialist medical practices. Demonstrated here with {doctor.name}.
            </p>

            <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Verified PMC / PMDC Reg #{doctor.pmdcRegistration.split(' ')[0]}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Navigation & Views
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => setActiveView('home')} className="hover:text-teal-400 cursor-pointer">
                  Public Home
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('profile')} className="hover:text-teal-400 cursor-pointer">
                  Doctor Credentials & Bio
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('services')} className="hover:text-teal-400 cursor-pointer">
                  Services & Fee Schedule (PKR)
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('book')} className="hover:text-teal-400 cursor-pointer text-teal-400 font-semibold">
                  Book Consultation Online
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('dashboard')} className="hover:text-teal-400 cursor-pointer font-semibold text-white">
                  Open Demo Dashboard →
                </button>
              </li>
            </ul>
          </div>

          {/* Clinic Contact */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Clinic Contact & Location
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="text-slate-300 font-semibold">{clinic.clinicName}</p>
              <p>{clinic.address}, {clinic.city}</p>
              <p className="flex items-center gap-1.5 pt-1">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>{clinic.phone}</span>
              </p>
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </button>

                <a
                  href={clinic.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-xs border border-slate-700 transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Demo Disclaimer & Reset */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="font-semibold text-slate-300">DEMO MODE NOTICE:</span>
            <span>All appointments, doctor profiles, and fees are demonstration data saved in localStorage.</span>
          </div>

          <button
            onClick={resetDemoData}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-semibold cursor-pointer shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-teal-400" />
            <span>Reset Demo Data</span>
          </button>
        </div>

      </div>
    </footer>
  );
};
