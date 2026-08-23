import React from 'react';
import { Check } from 'lucide-react';

export const ContextChip = ({ label, value, isChecked = true }) => {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all ${
      isChecked
        ? 'bg-sahayak-surfaceWarm text-sahayak-ink border-sahayak-border shadow-xs'
        : 'bg-sahayak-canvas text-sahayak-inkMuted border-sahayak-border'
    }`}>
      {isChecked && <Check className="w-3.5 h-3.5 text-sahayak-primary shrink-0" />}
      <span className="capitalize text-sahayak-inkMuted text-[11px] font-extrabold">{label}:</span>
      <span className="font-bold">{value}</span>
    </div>
  );
};
