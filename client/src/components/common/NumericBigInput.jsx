import React from 'react';

export const NumericBigInput = ({ value, onChange, placeholder = "0.00", unit = "ha", helperText }) => {
  return (
    <div className="space-y-2 text-center my-4">
      <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-2xs flex items-center justify-center gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full text-center text-4xl sm:text-5xl font-extrabold text-stitch-navy focus:outline-none placeholder:text-slate-300"
        />
        {unit && <span className="text-xl font-bold text-slate-400 shrink-0">{unit}</span>}
      </div>
      {helperText && (
        <p className="text-xs text-stitch-subtle leading-relaxed max-w-xs mx-auto font-medium">
          {helperText}
        </p>
      )}
    </div>
  );
};
