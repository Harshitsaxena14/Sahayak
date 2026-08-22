import React from 'react';
import { SearchX, RefreshCw } from 'lucide-react';

export const EmptyState = ({
  title = "No records found",
  message = "We couldn't find any information matching your search. Please check the details and try again.",
  onAction,
  actionLabel = "Try Again"
}) => {
  return (
    <div className="p-8 bg-white border border-slate-200/90 rounded-3xl shadow-civic text-center space-y-4 max-w-md mx-auto my-6 animate-in fade-in duration-200">
      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center mx-auto">
        <SearchX className="w-6 h-6" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-gov-navy">{title}</h3>
        <p className="text-xs text-gov-subtle mt-1 leading-relaxed">{message}</p>
      </div>
      {onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gov-navy hover:bg-gov-navyLight text-white text-xs font-bold rounded-xl transition-all shadow-2xs min-h-touch"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
