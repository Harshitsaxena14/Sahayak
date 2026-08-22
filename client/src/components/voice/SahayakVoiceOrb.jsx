import React from 'react';
import { Mic, MicOff, RotateCcw, Volume2, Loader2 } from 'lucide-react';
import { voiceService } from '../../services/voiceService';
import { useLanguage } from '../../context/LanguageContext';

export const SahayakVoiceOrb = ({ state, setState, onTranscript, onError }) => {
  const { language, t } = useLanguage();

  const handleToggleVoice = () => {
    if (state === 'recording') {
      voiceService.stopListening();
      setState('processing');
    } else {
      setState('recording');
      voiceService.startListening({
        language,
        onResult: (text) => {
          setState('understanding');
          onTranscript(text);
        },
        onError: (errMessage) => {
          setState('error');
          if (onError) onError(errMessage);
        },
        onEnd: () => {
          if (state === 'recording') {
            setState('idle');
          }
        }
      });
    }
  };

  return (
    <div className="flex flex-col items-center gap-2 my-2">
      {/* Signature Stitch Voice Orb Container */}
      <div className="relative flex items-center justify-center">
        {state === 'recording' && (
          <div className="absolute -inset-3 rounded-full bg-indigo-400/20 animate-orb-pulse border border-indigo-400/40"></div>
        )}

        {/* Soft Lavender / Indigo Voice Orb (Matching Stitch Screenshot 4) */}
        <button
          type="button"
          onClick={handleToggleVoice}
          disabled={state === 'processing' || state === 'understanding'}
          className={`relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex flex-col items-center justify-center font-bold text-white shadow-md transition-all duration-300 transform active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-stitch-accent ${
            state === 'recording'
              ? 'bg-amber-600 scale-105 shadow-stitch-float border-2 border-amber-300'
              : state === 'error'
              ? 'bg-red-100 text-red-700 border-2 border-red-400 shadow-none'
              : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700 shadow-sm border border-indigo-200'
          }`}
          aria-label={state === 'recording' ? 'Stop voice recording' : 'Start speaking your query'}
        >
          {state === 'recording' ? (
            <MicOff className="w-7 h-7 text-white animate-pulse" />
          ) : state === 'error' ? (
            <RotateCcw className="w-7 h-7 text-red-600" />
          ) : state === 'processing' || state === 'understanding' ? (
            <Loader2 className="w-7 h-7 text-indigo-600 animate-spin" />
          ) : state === 'responding' ? (
            <Volume2 className="w-7 h-7 animate-bounce text-emerald-600" />
          ) : (
            <Mic className="w-7 h-7 text-indigo-700" />
          )}
        </button>
      </div>

      {/* Voice State Text */}
      <span className="text-[11px] font-bold text-stitch-subtle">
        {state === 'idle' && (language === 'hi' ? 'बोलकर प्रश्न पूछें' : 'Tap mic to speak')}
        {state === 'recording' && 'Listening...'}
        {state === 'processing' && 'Processing voice...'}
        {state === 'error' && 'Retry microphone'}
      </span>
    </div>
  );
};
