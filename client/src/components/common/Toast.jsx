import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose }) => {
  if (!message) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />
  };

  return (
    <div
      className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-white border border-gov-border shadow-lg rounded-xl text-gov-navy text-sm font-medium animate-in slide-in-from-bottom-5 duration-200"
      role="status"
      aria-live="polite"
    >
      {icons[type] || icons.info}
      <span>{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-slate-600 min-h-touch min-w-touch flex items-center justify-center"
          aria-label="Dismiss toast"
        >
          ×
        </button>
      )}
    </div>
  );
};
