/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ClinicProvider, useClinic } from './context/ClinicContext';
import { DemoBanner } from './components/DemoBanner';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Toasts } from './components/Toasts';
import { Hero } from './components/public/Hero';
import { DoctorProfileView } from './components/public/DoctorProfileView';
import { ServicesView } from './components/public/ServicesView';
import { BookingWizard } from './components/public/BookingWizard';
import { DashboardOverview } from './components/admin/DashboardOverview';
import { AppointmentsManager } from './components/admin/AppointmentsManager';
import { PatientsDirectory } from './components/admin/PatientsDirectory';
import { ReportsView } from './components/admin/ReportsView';
import { ClinicSettings } from './components/admin/ClinicSettings';
import { PrintableReceiptModal } from './components/modals/PrintableReceiptModal';
import { NewAppointmentModal } from './components/modals/NewAppointmentModal';
import { 
  HeartHandshake, 
  Stethoscope, 
  ShieldCheck, 
  Clock, 
  Star, 
  ArrowRight, 
  MapPin, 
  Calendar, 
  LayoutDashboard,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeView, setActiveView, doctor, clinic, services } = useClinic();
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<string | undefined>(undefined);

  const isAdminView = ['dashboard', 'appointments', 'patients', 'reports', 'settings'].includes(activeView);

  const handleSelectServiceFromCatalog = (serviceId: string) => {
    setSelectedServiceForBooking(serviceId);
    setActiveView('book');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Demo Warning Banner */}
      <DemoBanner />

      {/* Navigation Header */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {/* PUBLIC VIEWS */}
        {activeView === 'home' && (
          <div>
            {/* Hero Section */}
            <Hero />

            {/* Why Choose Dr. Ahmed Khan Highlights */}
            <section className="py-16 bg-white border-y border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                <div className="text-center max-w-2xl mx-auto space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
                    Clinical Standards & Care
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    Why Patients Trust {doctor.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600">
                    Combining advanced non-invasive cardiac diagnostic technology with thorough, unhurried patient consultations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Complete Cardiac Diagnostics
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      On-site 12-lead digital ECG, transthoracic echocardiogram (Echo), and 24-hour ambulatory blood pressure monitoring for rapid diagnosis.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      PMC & PMDC Certified Specialist
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Dual FCPS qualifications with specialized fellowship training in interventional and preventive cardiology, backed by 15+ years of clinical practice.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Guaranteed Consultation Slots
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Zero overbooking guarantee. Reserved time slots with immediate computerized reference numbers to respect patients' valuable time.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Popular Services Section */}
            <section className="py-16 bg-slate-50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                      Cardiovascular Care
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                      Featured Clinical Services & Fees
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1">
                      Transparent fees in Pakistani Rupees (PKR) with no hidden hospital surcharges.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveView('services')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 cursor-pointer self-start sm:self-auto"
                  >
                    <span>View All Services & Pricing</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {services.slice(0, 3).map(service => (
                    <div
                      key={service.id}
                      className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                            {service.category}
                          </span>
                          <span className="text-slate-400 font-medium">{service.durationMinutes} mins</span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base">{service.name}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed">{service.description}</p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Fee</span>
                          <span className="text-lg font-black text-slate-900">Rs. {service.pricePkr.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => handleSelectServiceFromCatalog(service.id)}
                          className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition-colors cursor-pointer"
                        >
                          Book Slot
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Quick Demo CTA for Clinic Owners */}
            <section className="py-12 bg-slate-900 text-white">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="rounded-3xl bg-gradient-to-r from-teal-900/60 to-slate-800/80 p-8 sm:p-12 border border-teal-500/30 flex flex-col lg:flex-row items-center justify-between gap-8">
                  <div className="space-y-2 text-center lg:text-left">
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-800">
                      Clinic Software Demonstration
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                      Are you a doctor or clinic manager?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                      Explore the live administrative portal. Test patient scheduling, check-ins, financial receipts, CSV reporting, and clinic settings without creating an account.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                    <button
                      onClick={() => setActiveView('dashboard')}
                      className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm transition-all cursor-pointer shadow-lg shadow-teal-500/25"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Open Demo Dashboard</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>

                    <button
                      onClick={() => setActiveView('book')}
                      className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all cursor-pointer"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Test Patient Booking Form</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeView === 'profile' && <DoctorProfileView />}
        {activeView === 'services' && (
          <ServicesView onSelectServiceForBooking={handleSelectServiceFromCatalog} />
        )}
        {activeView === 'book' && (
          <BookingWizard initialServiceId={selectedServiceForBooking} />
        )}

        {/* ADMIN VIEWS (WRAP IN ADMIN SHELL) */}
        {isAdminView && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeView === 'dashboard' && <DashboardOverview />}
            {activeView === 'appointments' && <AppointmentsManager />}
            {activeView === 'patients' && <PatientsDirectory />}
            {activeView === 'reports' && <ReportsView />}
            {activeView === 'settings' && <ClinicSettings />}
          </div>
        )}
      </main>

      {/* MODALS */}
      <PrintableReceiptModal />
      <NewAppointmentModal />

      {/* TOASTS */}
      <Toasts />

      {/* FOOTER */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ClinicProvider>
      <MainContent />
    </ClinicProvider>
  );
}
