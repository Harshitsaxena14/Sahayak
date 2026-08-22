import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { voiceService } from '../../services/voiceService';
import { useLanguage } from '../../context/LanguageContext';

export const AIResponse = ({ content, children, timestamp }) => {
  const { language } = useLanguage();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleToggleSpeak = () => {
    if (isSpeaking) {
      voiceService.stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      voiceService.speak(content, {
        language,
        enabled: true
      });
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  };

  return (
    <div className="flex items-start gap-3 my-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gov-navy to-slate-800 text-amber-400 flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs mt-1 border border-slate-700/50">
        🏛️
      </div>
      <div className="flex-1 max-w-2xl bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4.5 shadow-civic">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-gov-navy uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>SAHAYAK AI Assistant</span>
          </div>
          <button
            type="button"
            onClick={handleToggleSpeak}
            className={`p-1.5 rounded-lg transition-colors min-h-touch min-w-touch flex items-center justify-center ${
              isSpeaking ? 'bg-amber-100 text-amber-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            aria-label={isSpeaking ? 'Stop text to speech' : 'Listen to AI response'}
            title="Read out response"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-sm sm:text-base text-gov-navy leading-relaxed font-normal whitespace-pre-wrap">
          {content}
        </p>

        {children && <div className="mt-4 space-y-3">{children}</div>}

        {timestamp && (
          <span className="block text-right text-[10px] text-gov-subtle font-mono mt-2 opacity-80">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};
