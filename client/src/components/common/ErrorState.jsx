import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorState = ({
  title = 'Something went wrong',
  message = 'We could not complete your request. Please verify your connection or try again.',
  onRetry
}) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-left" role="alert">
    <div className="flex items-start gap-4">
      <div className="p-2 bg-red-100 text-red-700 rounded-xl">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <h3 className="text-base font-bold text-red-900 mb-1">{title}</h3>
        <p className="text-sm text-red-700 mb-4">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold text-sm rounded-lg hover:bg-red-700 transition-colors min-h-touch"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
        )}
      </div>
    </div>
  </div>
);
