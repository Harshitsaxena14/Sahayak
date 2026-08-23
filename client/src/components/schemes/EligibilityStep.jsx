import React from 'react';
import { CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';

export const EligibilityStep = ({ label, value, status = 'checked' }) => {
  const icons = {
    checked: <CheckCircle className="w-4 h-4 text-sahayak-success shrink-0" />,
    warning: <AlertCircle className="w-4 h-4 text-sahayak-warning shrink-0" />,
    pending: <HelpCircle className="w-4 h-4 text-sahayak-inkMuted shrink-0" />
  };

  return (
    <div className="flex items-start gap-2.5 p-2.5 bg-sahayak-canvas border border-sahayak-border rounded-xl">
      {icons[status] || icons.checked}
      <div>
        <span className="text-[10px] font-extrabold text-sahayak-inkMuted block uppercase tracking-wider">{label}</span>
        <span className="text-xs font-semibold text-sahayak-ink">{value}</span>
      </div>
    </div>
  );
};
