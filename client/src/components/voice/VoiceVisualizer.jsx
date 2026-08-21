import React from 'react';

export const VoiceVisualizer = ({ state = 'idle' }) => {
  if (state === 'idle') return null;

  return (
    <div className="flex items-center justify-center gap-1.5 py-2" aria-hidden="true">
      {state === 'recording' && (
        <>
          <span className="w-1.5 h-6 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="w-1.5 h-9 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-12 bg-red-600 rounded-full animate-bounce"></span>
          <span className="w-1.5 h-8 bg-red-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="w-1.5 h-5 bg-red-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
        </>
      )}

      {(state === 'processing' || state === 'understanding') && (
        <div className="flex items-center gap-2 text-gov-primary font-semibold text-sm">
          <span className="w-2.5 h-2.5 bg-gov-primary rounded-full animate-ping"></span>
          <span>{state === 'processing' ? 'Transcribing Voice...' : 'Analyzing Intent...'}</span>
        </div>
      )}

      {state === 'responding' && (
        <div className="flex items-center gap-1 text-emerald-600 font-semibold text-sm">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>Speaking Response...</span>
        </div>
      )}
    </div>
  );
};
