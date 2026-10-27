import React from 'react';
import { AlertCircle, RotateCcw, ShieldCheck } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const DemoBanner: React.FC = () => {
  const { resetDemoData, appointments } = useClinic();

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/25 text-amber-950 px-4 py-2 text-xs sm:text-sm font-medium">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 bg-amber-500 text-white font-bold px-2 py-0.5 rounded text-xs tracking-wider uppercase">
            <AlertCircle className="w-3.5 h-3.5" />
            Demo Mode
          </span>
          <span className="hidden sm:inline text-amber-900">
            Fictional doctor & patient records. Stored locally in your browser — no real medical data or external servers used.
          </span>
          <span className="sm:hidden text-amber-900">
            Demo only • Local browser storage
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-amber-800/80 hidden md:inline">
            {appointments.length} active demo records
          </span>
          <button
            onClick={resetDemoData}
            title="Reset sample appointments, doctor profile, and services to initial state"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold bg-white border border-amber-300 text-amber-900 hover:bg-amber-50 rounded shadow-xs transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
            Reset Demo Data
          </button>
        </div>
      </div>
    </div>
  );
};
