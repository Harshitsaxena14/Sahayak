import React from 'react';
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

export const EligibilityStep = ({ label, value, status = 'checked' }) => {
  const icons = {
    checked: <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
    pending: <HelpCircle className="w-5 h-5 text-slate-400 shrink-0" />
  };

  return (
    <div className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
      {icons[status] || icons.checked}
      <div>
        <span className="text-xs font-bold text-gov-subtle block uppercase tracking-wider">{label}</span>
        <span className="text-sm font-semibold text-gov-navy">{value}</span>
      </div>
    </div>
  );
};
