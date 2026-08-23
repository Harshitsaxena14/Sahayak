import React from 'react';
import { AlertCircle } from 'lucide-react';

export const EmptyState = ({ title, message, onAction, actionLabel }) => {
  return (
    <div className="p-8 bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl shadow-sahayak-card text-center space-y-3 max-w-md mx-auto my-6 animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-2xl bg-sahayak-surfaceWarm text-sahayak-primary flex items-center justify-center font-bold text-xl mx-auto shadow-xs">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-sahayak-ink">{title}</h3>
        <p className="text-xs text-sahayak-inkSoft mt-1 leading-relaxed">{message}</p>
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white text-xs font-bold rounded-full transition-all shadow-sahayak-float min-h-touch active:scale-97"
        >
          <span>{actionLabel || 'Retry'}</span>
        </button>
      )}
    </div>
  );
};
