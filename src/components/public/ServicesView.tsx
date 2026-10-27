import React, { useState } from 'react';
import { 
  Stethoscope, 
  Clock, 
  Check, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Activity, 
  Heart, 
  HelpCircle,
  FileText
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Service } from '../../types';

interface ServicesViewProps {
  onSelectServiceForBooking?: (serviceId: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ onSelectServiceForBooking }) => {
  const { services, setActiveView } = useClinic();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  const filteredServices = selectedCategory === 'All'
    ? services
    : services.filter(s => s.category === selectedCategory);

  const handleBookService = (serviceId: string) => {
    if (onSelectServiceForBooking) {
      onSelectServiceForBooking(serviceId);
    }
    setActiveView('book');
  };

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100/70 text-teal-800 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Cardiovascular Diagnostics & Consultation</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Specialized Clinic Services & Fee Schedule
          </h1>

          <p className="text-sm sm:text-base text-slate-600">
            Transparent pricing in Pakistani Rupees (PKR). All diagnostic tests are conducted using high-precision digital equipment with verified reports.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map(service => (
            <div
              key={service.id}
              className={`relative bg-white rounded-2xl p-6 border transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                service.popular
                  ? 'border-teal-500/80 ring-2 ring-teal-500/10 shadow-sm'
                  : 'border-slate-200 shadow-2xs'
              }`}
            >
              {service.popular && (
                <div className="absolute -top-3 right-5 bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-[11px] font-bold px-3 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Most Requested
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {service.category}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 text-xs">
                    <Clock className="w-3.5 h-3.5 text-teal-600" />
                    <span>{service.durationMinutes} mins</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Direct consultation with Dr. Ahmed Khan</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Digital & printed medical report included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Free follow-up query support via WhatsApp</span>
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
                    Fee
                  </span>
                  <div className="text-xl font-extrabold text-slate-900">
                    Rs. {service.pricePkr.toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => handleBookService(service.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <span>Book Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ or Transparency Box */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 text-teal-700 font-bold text-base">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <span>Clinic Assurance & Transparent Billing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-slate-600">
            <div className="space-y-1">
              <span className="font-bold text-slate-800 block">No Hidden Charges</span>
              <p>All procedural costs, disposables, ECG electrodes, and formal interpretations are included in the quoted fee.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-800 block">Digitally Archived Records</span>
              <p>Your echocardiography clips and ECG strips are stored securely for immediate future comparison.</p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-slate-800 block">Demo Customization</span>
              <p>Are you evaluating DoctorFlow for your own clinic? You can customize all services and prices in the Settings tab!</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
