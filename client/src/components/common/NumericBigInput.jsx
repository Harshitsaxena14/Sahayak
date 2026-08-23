import React from 'react';

export const NumericBigInput = ({ value, onChange, placeholder = "0.0", unit = "Hectares", helperText }) => {
  return (
    <div className="p-6 bg-sahayak-surface border border-sahayak-border rounded-3xl text-center space-y-3 shadow-xs">
      <div className="flex items-center justify-center gap-2">
        <input
          type="number"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-center text-4xl sm:text-5xl font-extrabold text-sahayak-ink focus:outline-none placeholder:text-sahayak-inkMuted"
        />
        <span className="text-xl font-bold text-sahayak-primary shrink-0">{unit}</span>
      </div>
      {helperText && (
        <p className="text-xs text-sahayak-inkSoft leading-relaxed max-w-xs mx-auto font-medium">
          {helperText}
        </p>
      )}
    </div>
  );
};
