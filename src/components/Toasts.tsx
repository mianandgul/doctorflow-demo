import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useClinic } from '../context/ClinicContext';

export const Toasts: React.FC = () => {
  const { toasts, removeToast } = useClinic();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full px-4 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-200 animate-slide-in ${
            toast.type === 'success'
              ? 'bg-teal-950/90 text-white border-teal-500/30'
              : toast.type === 'error'
              ? 'bg-rose-950/90 text-white border-rose-500/30'
              : 'bg-slate-900/90 text-white border-slate-700'
          }`}
        >
          {toast.type === 'success' && (
            <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'error' && (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          {toast.type === 'info' && (
            <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 text-sm leading-snug">
            {toast.message}
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
