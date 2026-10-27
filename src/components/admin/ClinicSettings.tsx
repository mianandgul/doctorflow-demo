import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Phone, 
  Clock, 
  DollarSign, 
  Stethoscope, 
  Save, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  AlertTriangle,
  X
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { Service } from '../../types';

export const ClinicSettings: React.FC = () => {
  const { 
    doctor, 
    clinic, 
    services, 
    updateDoctorProfile, 
    updateClinicInfo, 
    addService, 
    updateService, 
    deleteService, 
    resetDemoData 
  } = useClinic();

  // Local form state for doctor & clinic
  const [docName, setDocName] = useState(doctor.name);
  const [docTitle, setDocTitle] = useState(doctor.title);
  const [docQuals, setDocQuals] = useState(doctor.qualifications);
  const [docPmdc, setDocPmdc] = useState(doctor.pmdcRegistration);
  
  const [clinicName, setClinicName] = useState(clinic.clinicName);
  const [clinicAddress, setClinicAddress] = useState(clinic.address);
  const [clinicCity, setClinicCity] = useState(clinic.city);
  const [clinicPhone, setClinicPhone] = useState(clinic.phone);
  const [clinicWhatsapp, setClinicWhatsapp] = useState(clinic.whatsapp);
  const [consultationFee, setConsultationFee] = useState(clinic.defaultConsultationFeePkr.toString());
  const [hoursStart, setHoursStart] = useState(clinic.workingHoursStart);
  const [hoursEnd, setHoursEnd] = useState(clinic.workingHoursEnd);

  // Service modal
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('Consultation');
  const [newServicePrice, setNewServicePrice] = useState('2500');
  const [newServiceDuration, setNewServiceDuration] = useState('30');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [showServiceModal, setShowServiceModal] = useState(false);

  // Reset confirmation
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctorProfile({
      name: docName.trim(),
      title: docTitle.trim(),
      qualifications: docQuals.trim(),
      pmdcRegistration: docPmdc.trim(),
    });

    updateClinicInfo({
      clinicName: clinicName.trim(),
      address: clinicAddress.trim(),
      city: clinicCity.trim(),
      phone: clinicPhone.trim(),
      whatsapp: clinicWhatsapp.trim(),
      defaultConsultationFeePkr: parseInt(consultationFee, 10) || 2500,
      workingHoursStart: hoursStart,
      workingHoursEnd: hoursEnd,
    });
  };

  const handleOpenAddService = () => {
    setEditingService(null);
    setNewServiceName('');
    setNewServiceCategory('Consultation');
    setNewServicePrice('3000');
    setNewServiceDuration('30');
    setNewServiceDesc('');
    setShowServiceModal(true);
  };

  const handleOpenEditService = (srv: Service) => {
    setEditingService(srv);
    setNewServiceName(srv.name);
    setNewServiceCategory(srv.category);
    setNewServicePrice(srv.pricePkr.toString());
    setNewServiceDuration(srv.durationMinutes.toString());
    setNewServiceDesc(srv.description);
    setShowServiceModal(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) return;

    if (editingService) {
      updateService({
        ...editingService,
        name: newServiceName.trim(),
        category: newServiceCategory,
        pricePkr: parseInt(newServicePrice, 10) || 2500,
        durationMinutes: parseInt(newServiceDuration, 10) || 30,
        description: newServiceDesc.trim(),
      });
    } else {
      addService({
        name: newServiceName.trim(),
        category: newServiceCategory,
        pricePkr: parseInt(newServicePrice, 10) || 2500,
        durationMinutes: parseInt(newServiceDuration, 10) || 30,
        description: newServiceDesc.trim(),
      });
    }

    setShowServiceModal(false);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Title */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Clinic Configuration & Doctor Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Modify practice info, consultation fees, working schedule, and clinical services. Changes persist to localStorage.
        </p>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveGeneral} className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-8">
        
        {/* DOCTOR DETAILS SECTION */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-teal-700 font-bold text-base">
            <User className="w-5 h-5 text-teal-600" />
            <span>Consultant Doctor Profile</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Doctor Name *</label>
              <input
                type="text"
                value={docName}
                onChange={e => setDocName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinical Title / Designation *</label>
              <input
                type="text"
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Medical Degrees & Qualifications *</label>
              <input
                type="text"
                value={docQuals}
                onChange={e => setDocQuals(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">PMDC / License Registration Number</label>
              <input
                type="text"
                value={docPmdc}
                onChange={e => setDocPmdc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>
        </div>

        {/* CLINIC & CONTACT DETAILS SECTION */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-teal-700 font-bold text-base">
            <Building2 className="w-5 h-5 text-teal-600" />
            <span>Clinic Information & Location</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Clinic Name *</label>
              <input
                type="text"
                value={clinicName}
                onChange={e => setClinicName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Region</label>
              <input
                type="text"
                value={clinicCity}
                onChange={e => setClinicCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Full Physical Address *</label>
              <input
                type="text"
                value={clinicAddress}
                onChange={e => setClinicAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reception Phone Line *</label>
              <input
                type="tel"
                value={clinicPhone}
                onChange={e => setClinicPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">WhatsApp Booking Number *</label>
              <input
                type="tel"
                value={clinicWhatsapp}
                onChange={e => setClinicWhatsapp(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>
        </div>

        {/* FEES & SCHEDULE SECTION */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-teal-700 font-bold text-base">
            <Clock className="w-5 h-5 text-teal-600" />
            <span>Consultation Fee & Working Timings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Standard Consultation Fee (PKR) *
              </label>
              <input
                type="number"
                value={consultationFee}
                onChange={e => setConsultationFee(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opening Hour</label>
              <input
                type="text"
                placeholder="10:00 AM"
                value={hoursStart}
                onChange={e => setHoursStart(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Closing Hour</label>
              <input
                type="text"
                placeholder="08:00 PM"
                value={hoursEnd}
                onChange={e => setHoursEnd(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>
        </div>

        {/* SAVE CHANGES BUTTON */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Clinic Settings</span>
          </button>
        </div>

      </form>

      {/* SERVICES MANAGER SECTION */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Available Clinical Services & Pricing
            </h2>
          </div>

          <button
            onClick={handleOpenAddService}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>
        </div>

        <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
          {services.map(service => (
            <div key={service.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{service.name}</span>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {service.category}
                  </span>
                  {service.popular && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                      Popular
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{service.description}</p>
                <div className="text-xs text-slate-600 font-medium">
                  Duration: {service.durationMinutes} mins • Fee: <span className="font-bold text-teal-700">Rs. {service.pricePkr.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleOpenEditService(service)}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 cursor-pointer"
                  title="Edit service details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteService(service.id)}
                  disabled={services.length <= 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-400 cursor-pointer disabled:opacity-40"
                  title="Delete service"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DANGER ZONE / RESET DEMO DATA */}
      <div className="bg-rose-50/50 border border-rose-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600" />
            <span>Reset Demo Data to Initial State</span>
          </div>
          <p className="text-xs text-rose-700/80 max-w-xl">
            This will wipe your current localStorage changes and re-seed the original 10 sample appointments, Dr. Ahmed Khan's default profile, and initial services.
          </p>
        </div>

        {confirmReset ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetDemoData();
                setConfirmReset(false);
              }}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
            >
              Yes, Reset Everything
            </button>
            <button
              onClick={() => setConfirmReset(false)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-white border border-rose-300 text-rose-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border border-rose-300 bg-white text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-4 h-4 text-rose-600" />
            <span>Reset All Demo Data</span>
          </button>
        )}
      </div>

      {/* SERVICE EDIT/ADD MODAL */}
      {showServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <form onSubmit={handleSaveService} className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">
                {editingService ? 'Edit Clinical Service' : 'Add New Clinical Service'}
              </h3>
              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Exercise Stress Test (ETT)"
                  value={newServiceName}
                  onChange={e => setNewServiceName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Category</label>
                  <select
                    value={newServiceCategory}
                    onChange={e => setNewServiceCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
                  >
                    <option value="Consultation">Consultation</option>
                    <option value="Diagnostic">Diagnostic</option>
                    <option value="Preventive Package">Preventive Package</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Procedure">Procedure</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (mins)</label>
                  <input
                    type="number"
                    value={newServiceDuration}
                    onChange={e => setNewServiceDuration(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Fee in Pakistani Rupees (PKR) *</label>
                <input
                  type="number"
                  required
                  placeholder="3500"
                  value={newServicePrice}
                  onChange={e => setNewServicePrice(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Short Description</label>
                <textarea
                  rows={2}
                  placeholder="Brief clinical description of procedure and report inclusion..."
                  value={newServiceDesc}
                  onChange={e => setNewServiceDesc(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowServiceModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
              >
                {editingService ? 'Update Service' : 'Add Service'}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
