import React from 'react';
import { Mic, MicOff, RotateCcw } from 'lucide-react';
import { voiceService } from '../../services/voiceService';
import { useLanguage } from '../../context/LanguageContext';

export const VoiceButton = ({ state, setState, onTranscript, onError }) => {
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

  const buttonStyles = {
    idle: 'bg-gov-primary hover:bg-gov-primaryHover text-white shadow-md hover:scale-105',
    recording: 'bg-red-600 text-white animate-pulse shadow-lg scale-105 ring-4 ring-red-200',
    processing: 'bg-amber-500 text-white opacity-90 cursor-wait',
    understanding: 'bg-indigo-600 text-white opacity-90 cursor-wait',
    responding: 'bg-emerald-600 text-white shadow-md',
    error: 'bg-red-100 text-red-700 border-2 border-red-300'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={handleToggleVoice}
        disabled={state === 'processing' || state === 'understanding'}
        className={`relative flex items-center justify-center gap-3 px-6 py-4 rounded-full font-bold text-lg transition-all min-h-[54px] ${buttonStyles[state] || buttonStyles.idle}`}
        aria-label={state === 'recording' ? 'Stop voice recording' : 'Start speaking your query'}
      >
        {state === 'recording' ? (
          <>
            <MicOff className="w-6 h-6 animate-pulse" />
            <span>Stop Recording</span>
          </>
        ) : state === 'error' ? (
          <>
            <RotateCcw className="w-6 h-6" />
            <span>{t('chat.retry')}</span>
          </>
        ) : (
          <>
            <Mic className="w-6 h-6" />
            <span>{t('home.speakBtn')}</span>
          </>
        )}
      </button>

      <span className="text-xs font-medium text-gov-subtle">
        {state === 'idle' && t('home.speakDesc')}
        {state === 'recording' && t('chat.listening')}
        {state === 'processing' && t('chat.processing')}
        {state === 'understanding' && t('chat.understanding')}
      </span>
    </div>
  );
};
