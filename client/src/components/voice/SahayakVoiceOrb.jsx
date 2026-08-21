import React from 'react';
import { Mic, MicOff, RotateCcw, Volume2, Sparkles, Search } from 'lucide-react';
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
    <div className="flex flex-col items-center gap-3">
      {/* Signature Voice Orb Container */}
      <div className="relative flex items-center justify-center">
        {/* Outer Animated Glow Ring */}
        {state === 'recording' && (
          <div className="absolute -inset-4 rounded-full bg-red-400/30 animate-ping"></div>
        )}
        {state === 'idle' && (
          <div className="absolute -inset-2 rounded-full bg-gov-primary/10 animate-pulse"></div>
        )}
        {(state === 'processing' || state === 'understanding') && (
          <div className="absolute -inset-3 rounded-full bg-amber-400/30 animate-spin"></div>
        )}

        {/* Main Orb Button */}
        <button
          type="button"
          onClick={handleToggleVoice}
          disabled={state === 'processing' || state === 'understanding'}
          className={`relative z-10 w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center gap-1 font-bold text-white shadow-lg transition-all duration-300 transform active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-gov-accent ${
            state === 'recording'
              ? 'bg-red-600 shadow-red-300 scale-105'
              : state === 'error'
              ? 'bg-red-100 text-red-700 border-2 border-red-400 shadow-none'
              : 'bg-gov-navy hover:bg-gov-primary shadow-gov-navy/30 hover:scale-105'
          }`}
          aria-label={state === 'recording' ? 'Stop voice recording' : 'Start speaking your query'}
        >
          {state === 'recording' ? (
            <MicOff className="w-8 h-8 animate-pulse" />
          ) : state === 'error' ? (
            <RotateCcw className="w-8 h-8" />
          ) : state === 'responding' ? (
            <Volume2 className="w-8 h-8 animate-bounce text-emerald-300" />
          ) : (
            <Mic className="w-8 h-8 text-gov-accent" />
          )}

          <span className="text-[11px] font-extrabold uppercase tracking-wider">
            {state === 'recording' ? 'Stop' : state === 'error' ? 'Retry' : 'Speak'}
          </span>
        </button>
      </div>

      {/* Voice State Indicator Text */}
      <div className="text-center">
        <span className="text-xs font-bold text-gov-navy block">
          {state === 'idle' && t('home.speakDesc')}
          {state === 'recording' && "Listening... Speak naturally in Hindi, Hinglish, or English"}
          {state === 'processing' && "Transcribing your voice..."}
          {state === 'understanding' && "Understanding your request..."}
          {state === 'responding' && "Reading response aloud..."}
          {state === 'error' && "I couldn't hear clearly. Click to try speaking again."}
        </span>
      </div>
    </div>
  );
};
