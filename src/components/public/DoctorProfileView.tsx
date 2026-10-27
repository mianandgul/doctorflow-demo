import React from 'react';
import { 
  Award, 
  BookOpen, 
  Building2, 
  Calendar, 
  CheckCircle, 
  Clock, 
  Globe, 
  GraduationCap, 
  Heart, 
  Mail, 
  MapPin, 
  MessageSquare, 
  Phone, 
  ShieldCheck, 
  Star, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const DoctorProfileView: React.FC = () => {
  const { doctor, clinic, setActiveView } = useClinic();

  const handleWhatsApp = () => {
    const cleanNumber = clinic.whatsapp.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hello Dr. Ahmed Khan, I would like to inquire about booking a cardiac consultation.`);
    window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="py-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb / Top bar */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => setActiveView('home')} className="hover:text-teal-600 cursor-pointer">Home</button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-semibold">Doctor Profile</span>
        </div>

        {/* Demo Disclaimer Banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-teal-900 leading-relaxed">
            <span className="font-bold">Demonstration Profile: </span>
            This profile of <span className="font-semibold">{doctor.name}</span> is configured as a fully working demonstration of the DoctorFlow platform for doctors, clinics, and medical practices. You can book sample appointments, explore patient records, and update clinic configurations.
          </div>
        </div>

        {/* Main Profile Header Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Photo & Badges */}
            <div className="md:col-span-4 flex flex-col items-center text-center">
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-2xl overflow-hidden shadow-md border-4 border-white mb-4 bg-slate-100">
                <img
                  src={doctor.avatarUrl}
                  alt={doctor.name}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute top-2 right-2 bg-teal-600 text-white p-1 rounded-full shadow-sm" title="Verified Medical License">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-sm mb-1">
                <Star className="w-4 h-4 fill-amber-500" />
                <span>{doctor.rating}</span>
                <span className="text-slate-400 font-normal">({doctor.reviewCount} verified reviews)</span>
              </div>

              <span className="text-xs text-slate-500">
                PMDC Verified License #{doctor.pmdcRegistration.split(' ')[0]}
              </span>

              {/* Quick Contacts */}
              <div className="w-full mt-5 pt-5 border-t border-slate-100 space-y-2">
                <button
                  onClick={() => setActiveView('book')}
                  className="w-full py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>

                <button
                  onClick={handleWhatsApp}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp Doctor</span>
                </button>
              </div>
            </div>

            {/* Profile Information */}
            <div className="md:col-span-8 space-y-6">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    {doctor.specialization}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                    {doctor.experienceYears}+ Years Clinical Experience
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {doctor.name}
                </h1>
                <p className="text-teal-700 font-medium text-sm sm:text-base mt-1">
                  {doctor.qualifications}
                </p>
                <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                  {doctor.title}
                </p>
              </div>

              {/* Bio */}
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2">
                  Professional Biography
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {doctor.bio}
                </p>
              </div>

              {/* Key Credentials Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1.5">
                    <GraduationCap className="w-4 h-4" />
                    <span>Education & Qualifications</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    <li>• MBBS — King Edward Medical University (KEMU)</li>
                    <li>• FCPS (Medicine) — CPSP Pakistan</li>
                    <li>• FCPS (Cardiology) — CPSP Pakistan</li>
                    <li>• Fellowship in Interventional Cardiology (NICVD)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1.5">
                    <Building2 className="w-4 h-4" />
                    <span>Hospital Affiliations</span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {doctor.hospitalAffiliations.map((affil, idx) => (
                      <li key={idx}>• {affil}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1.5">
                    <Award className="w-4 h-4" />
                    <span>Clinical Focus Areas</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {doctor.subSpecialties.map((sub, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded bg-white text-[11px] font-medium text-slate-700 border border-slate-200">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm mb-1.5">
                    <Globe className="w-4 h-4" />
                    <span>Consultation Languages</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Fluent in: {doctor.languages.join(', ')}
                  </p>
                  <div className="mt-2 text-xs text-slate-500">
                    Consultation fee: <span className="font-bold text-slate-900">Rs. {clinic.defaultConsultationFeePkr.toLocaleString()}</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>

        {/* Clinic & Location Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Clinic Hours & Details */}
          <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
                <Clock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Clinic Timings & Schedule
                </h3>
                <p className="text-xs text-slate-500">
                  Walk-ins accepted based on slot availability
                </p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 text-sm">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <div key={day} className="py-2.5 flex items-center justify-between">
                  <span className="font-medium text-slate-700">{day}</span>
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-teal-50 text-teal-800">
                    {clinic.workingHoursStart} – {clinic.workingHoursEnd}
                  </span>
                </div>
              ))}
              <div className="py-2.5 flex items-center justify-between">
                <span className="font-medium text-slate-400">Sunday</span>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-100 text-slate-500">
                  Closed (Emergency Services Only)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900">
              <span className="font-bold">Emergency Notice: </span>
              In case of acute chest pain, sudden breathlessness, or collapse, please call 1122 or visit the nearest emergency room immediately.
            </div>
          </div>

          {/* Location & Directions */}
          <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Clinic Location & Address
                </h3>
                <p className="text-xs text-slate-500">
                  Easy parking & elevator access
                </p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold text-slate-900 block">{clinic.clinicName}</span>
                <p className="text-slate-600 text-xs sm:text-sm mt-0.5">{clinic.address}</p>
                <p className="text-slate-500 text-xs">{clinic.city}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-400 block mb-0.5">Phone Line</span>
                  <a href={`tel:${clinic.phone}`} className="font-semibold text-slate-800 hover:text-teal-600">
                    {clinic.phone}
                  </a>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                  <span className="text-slate-400 block mb-0.5">WhatsApp Booking</span>
                  <span className="font-semibold text-slate-800">
                    {clinic.whatsapp}
                  </span>
                </div>
              </div>

              {/* Map Preview Graphic */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 p-4 text-center">
                <div className="py-6 flex flex-col items-center justify-center space-y-2">
                  <MapPin className="w-8 h-8 text-rose-500 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-800">
                    Al-Razi Healthcare Complex, Gulberg III
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    Located on Main Boulevard, opposite Pace Shopping Mall, Lahore.
                  </p>
                  <a
                    href={clinic.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Get Directions on Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
