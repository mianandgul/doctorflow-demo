import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Phone, 
  Mail, 
  Calendar, 
  Heart, 
  Plus, 
  FileText, 
  ShieldAlert, 
  Clock, 
  X,
  CreditCard,
  UserCheck
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';
import { PatientRecord } from '../../types';

export const PatientsDirectory: React.FC = () => {
  const { patients, appointments, addPatient, updatePatient, setPrintableReceiptAppointment } = useClinic();
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  
  // New patient modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('40');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [allergies, setAllergies] = useState('');
  const [medicalHistoryNotes, setMedicalHistoryNotes] = useState('');

  const filteredPatients = patients.filter(p => {
    const q = search.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.phone.includes(q) ||
      (p.email && p.email.toLowerCase().includes(q)) ||
      (p.medicalHistoryNotes && p.medicalHistoryNotes.toLowerCase().includes(q))
    );
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    addPatient({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim(),
      age: parseInt(age, 10) || 30,
      gender,
      bloodGroup,
      emergencyContact,
      allergies,
      medicalHistoryNotes,
    });

    setShowAddModal(false);
    setName('');
    setPhone('');
    setEmail('');
    setAllergies('');
    setMedicalHistoryNotes('');
  };

  // Get appointments for a selected patient
  const patientAppointments = selectedPatient
    ? appointments.filter(a => a.patientPhone === selectedPatient.phone || a.patientName === selectedPatient.name)
    : [];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Patient Directory & Clinical History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Fictional patient profiles, visit frequency, and medical history notes
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search patients by name, mobile number, or clinical note..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            onClick={() => setSelectedPatient(patient)}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-teal-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base group-hover:text-teal-600 transition-colors">
                    {patient.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {patient.gender}, {patient.age} years • Blood: <span className="font-bold text-teal-700">{patient.bloodGroup || 'N/A'}</span>
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  {patient.totalVisits} {patient.totalVisits === 1 ? 'Visit' : 'Visits'}
                </span>
              </div>

              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{patient.phone}</span>
                </div>
                {patient.allergies && patient.allergies !== 'None' && patient.allergies !== 'None known' && (
                  <div className="flex items-center gap-1.5 text-amber-700 font-medium">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">Allergy: {patient.allergies}</span>
                  </div>
                )}
                {patient.medicalHistoryNotes && (
                  <p className="text-[11px] text-slate-500 line-clamp-1 italic pt-1">
                    "{patient.medicalHistoryNotes}"
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400">Last visit: {patient.lastVisitDate}</span>
              <span className="font-bold text-slate-900">
                Rs. {patient.totalSpentPkr.toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* PATIENT PROFILE MODAL */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scale-in">
            
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                    Patient ID #{selectedPatient.id}
                  </span>
                  <span className="text-xs text-slate-400">Total Visits: {selectedPatient.totalVisits}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 mt-1">
                  {selectedPatient.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  {selectedPatient.gender}, {selectedPatient.age} years old • Blood Group: <span className="font-bold text-teal-700">{selectedPatient.bloodGroup || 'Unspecified'}</span>
                </p>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Details */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block">Contact Phone</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedPatient.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block">Emergency Contact</span>
                <span className="font-bold text-slate-800 mt-0.5 block">{selectedPatient.emergencyContact || 'None listed'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block">Total Lifetime Paid</span>
                <span className="font-bold text-teal-800 mt-0.5 block">Rs. {selectedPatient.totalSpentPkr.toLocaleString()}</span>
              </div>
            </div>

            {/* Clinical & Allergy Notes */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
                <span className="font-bold text-amber-900 block mb-1">Drug Allergies & Precautions</span>
                <p className="text-amber-800">{selectedPatient.allergies || 'No known allergies reported.'}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                <span className="font-bold text-slate-900 block mb-1">Medical Background / Notes</span>
                <p className="text-slate-700">{selectedPatient.medicalHistoryNotes || 'No specific clinical history recorded.'}</p>
              </div>
            </div>

            {/* Past Appointments with Clinic */}
            <div className="space-y-3 pt-2">
              <h4 className="text-sm font-bold text-slate-900">
                Consultation History ({patientAppointments.length})
              </h4>

              {patientAppointments.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No past appointments found under this phone number.</p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
                  {patientAppointments.map(apt => (
                    <div key={apt.id} className="p-3 flex items-center justify-between hover:bg-slate-50">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{apt.serviceName}</span>
                          <span className="font-mono text-teal-700 text-[11px] bg-teal-50 px-1.5 py-0.2 rounded">
                            {apt.bookingReference}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {apt.date} at {apt.timeSlot} • Rs. {apt.feePkr.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          apt.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                          apt.status === 'confirmed' ? 'bg-teal-50 text-teal-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {apt.status}
                        </span>

                        <button
                          onClick={() => {
                            setSelectedPatient(null);
                            setPrintableReceiptAppointment(apt);
                          }}
                          className="px-2 py-1 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                        >
                          Receipt
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
              >
                Close Profile
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADD NEW PATIENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
          <form onSubmit={handleCreatePatient} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900">
                Register New Patient
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Patient Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Shahid Afridi"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+92 300 0000000"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="patient@mail.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Blood Group</label>
                  <select
                    value={bloodGroup}
                    onChange={e => setBloodGroup(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500 bg-white"
                  >
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Emergency Contact</label>
                <input
                  type="text"
                  placeholder="e.g. +92 301 2233445 (Son)"
                  value={emergencyContact}
                  onChange={e => setEmergencyContact(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Known Allergies</label>
                <input
                  type="text"
                  placeholder="e.g. Penicillin, Aspirin, None"
                  value={allergies}
                  onChange={e => setAllergies(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Medical Background Notes</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Diagnosed with essential hypertension in 2022..."
                  value={medicalHistoryNotes}
                  onChange={e => setMedicalHistoryNotes(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 outline-hidden focus:border-teal-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white shadow-xs cursor-pointer"
              >
                Save Patient Profile
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
