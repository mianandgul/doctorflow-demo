import React, { useState } from 'react';
import { 
  Activity, 
  Calendar, 
  Users, 
  Stethoscope, 
  BarChart3, 
  Settings, 
  Menu, 
  X, 
  LayoutDashboard, 
  ArrowRight, 
  Home, 
  UserCheck, 
  PlusCircle, 
  ExternalLink 
} from 'lucide-react';
import { useClinic } from '../context/ClinicContext';
import { ActiveView } from '../types';

export const Header: React.FC = () => {
  const { activeView, setActiveView, setNewAppointmentModalOpen } = useClinic();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAdminView = ['dashboard', 'appointments', 'patients', 'reports', 'settings'].includes(activeView);

  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:bg-teal-700 transition-colors">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-xl tracking-tight text-slate-900">
                    Doctor<span className="text-teal-600">Flow</span>
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    DEMO
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-none">
                  Smart Clinic & Appointments
                </p>
              </div>
            </button>

            {/* View Mode Tag */}
            <div className="hidden lg:flex items-center ml-4 pl-4 border-l border-slate-200">
              {isAdminView ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                  <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  Doctor Admin Portal
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Public Patient Portal
                </span>
              )}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {isAdminView ? (
              // Admin Navigation
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'dashboard'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-teal-600" />
                  Dashboard
                </button>

                <button
                  onClick={() => handleNavClick('appointments')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'appointments'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Calendar className="w-4 h-4 text-teal-600" />
                  Appointments
                </button>

                <button
                  onClick={() => handleNavClick('patients')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'patients'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Users className="w-4 h-4 text-teal-600" />
                  Patients
                </button>

                <button
                  onClick={() => handleNavClick('services')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'services'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Stethoscope className="w-4 h-4 text-teal-600" />
                  Services
                </button>

                <button
                  onClick={() => handleNavClick('reports')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'reports'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-teal-600" />
                  Reports
                </button>

                <button
                  onClick={() => handleNavClick('settings')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'settings'
                      ? 'bg-teal-50 text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Settings className="w-4 h-4 text-teal-600" />
                  Settings
                </button>
              </>
            ) : (
              // Public Navigation
              <>
                <button
                  onClick={() => handleNavClick('home')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'home'
                      ? 'text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Home
                </button>

                <button
                  onClick={() => handleNavClick('profile')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'profile'
                      ? 'text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-4 h-4" />
                  Doctor Profile
                </button>

                <button
                  onClick={() => handleNavClick('services')}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'services'
                      ? 'text-teal-700 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Stethoscope className="w-4 h-4" />
                  Services & Fees
                </button>

                <button
                  onClick={() => handleNavClick('book')}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeView === 'book'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-teal-700 bg-teal-50 hover:bg-teal-100/80 border border-teal-200/80'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  Book Appointment
                </button>
              </>
            )}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isAdminView ? (
              <>
                <button
                  onClick={() => setNewAppointmentModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-600 text-white hover:bg-teal-700 shadow-xs transition-colors cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  New Walk-in
                </button>

                <button
                  onClick={() => handleNavClick('home')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <span>Public View</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavClick('dashboard')}
                  className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded-lg bg-slate-900 text-white hover:bg-slate-800 shadow-sm hover:shadow transition-all cursor-pointer group"
                >
                  <LayoutDashboard className="w-4 h-4 text-teal-400 group-hover:rotate-12 transition-transform" />
                  <span>Open Demo Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            {!isAdminView && (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-slate-900 text-white flex items-center gap-1"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
                <span>Dashboard</span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {isAdminView ? 'Clinic Admin Portal' : 'Patient Portal'}
            </span>
            <button
              onClick={() => handleNavClick(isAdminView ? 'home' : 'dashboard')}
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1"
            >
              Switch to {isAdminView ? 'Public Site' : 'Admin Dashboard'} →
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleNavClick('home')}
              className={`p-2.5 text-left rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeView === 'home' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Home className="w-4 h-4 text-teal-600" />
              Home
            </button>

            <button
              onClick={() => handleNavClick('profile')}
              className={`p-2.5 text-left rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeView === 'profile' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-teal-600" />
              Doctor Profile
            </button>

            <button
              onClick={() => handleNavClick('services')}
              className={`p-2.5 text-left rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeView === 'services' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Stethoscope className="w-4 h-4 text-teal-600" />
              Services & Fees
            </button>

            <button
              onClick={() => handleNavClick('book')}
              className={`p-2.5 text-left rounded-lg text-sm font-medium flex items-center gap-2 ${
                activeView === 'book' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Calendar className="w-4 h-4 text-teal-600" />
              Book Appointment
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Management & Reporting
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleNavClick('dashboard')}
                className={`p-2.5 text-left rounded-lg text-sm font-medium flex items-center gap-2 ${
                  activeView === 'dashboard' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-teal-600" />
                Dashboard
              </button>

              <button
                onClick={() => handleNavClick('appointments')}
                className={`p-2.5 text-left rounded-lg text-sm font-medium flex items-center gap-2 ${
                  activeView === 'appointments' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Calendar className="w-4 h-4 text-teal-600" />
                Appointments
              </button>

              <button
                onClick={() => handleNavClick('patients')}
                className={`p-2.5 text-left rounded-lg text-sm font-medium flex items-center gap-2 ${
                  activeView === 'patients' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 text-teal-600" />
                Patients
              </button>

              <button
                onClick={() => handleNavClick('reports')}
                className={`p-2.5 text-left rounded-lg text-sm font-medium flex items-center gap-2 ${
                  activeView === 'reports' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-teal-600" />
                Reports
              </button>

              <button
                onClick={() => handleNavClick('settings')}
                className={`p-2.5 text-left rounded-lg text-sm font-medium flex items-center gap-2 col-span-2 ${
                  activeView === 'settings' ? 'bg-teal-50 text-teal-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Settings className="w-4 h-4 text-teal-600" />
                Clinic Settings
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
