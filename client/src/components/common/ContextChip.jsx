import React from 'react';
import { Check } from 'lucide-react';

export const ContextChip = ({ label, value, isChecked = true, onClick }) => {
  const text = value ? `${label}: ${value}` : label;

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs border ${
        onClick ? 'cursor-pointer hover:bg-slate-200' : ''
      } bg-stitch-chip text-stitch-text border-slate-200/90`}
    >
      {isChecked && (
        <span className="w-4 h-4 rounded-full bg-slate-800 text-white flex items-center justify-center shrink-0 text-[10px]">
          <Check className="w-2.5 h-2.5 stroke-[3]" />
        </span>
      )}
      <span className="truncate">{text}</span>
    </div>
  );
};
