import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = ({ message = 'Loading details...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center" role="status">
      <Loader2 className="w-8 h-8 text-sahayak-primary animate-spin mb-3" aria-hidden="true" />
      <p className="text-sm font-semibold text-sahayak-inkSoft">{message}</p>
    </div>
  );
};
