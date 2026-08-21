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
      // Auto reset speaking state after estimated speech time
      setTimeout(() => setIsSpeaking(false), 8000);
    }
  };

  return (
    <div className="flex items-start gap-3 my-4 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div className="w-9 h-9 rounded-xl bg-gov-navy text-gov-accent flex items-center justify-center font-bold text-lg shrink-0 shadow-sm mt-1">
        🏛️
      </div>
      <div className="flex-1 max-w-2xl bg-white border border-gov-border rounded-2xl rounded-tl-xs p-4 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gov-navy uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-gov-accent" />
            <span>SAHAYAK AI Assistant</span>
          </div>
          <button
            type="button"
            onClick={handleToggleSpeak}
            className={`p-1.5 rounded-md transition-colors min-h-touch min-w-touch flex items-center justify-center ${
              isSpeaking ? 'bg-amber-100 text-amber-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            aria-label={isSpeaking ? 'Stop text to speech' : 'Listen to AI response'}
            title="Read out response"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-base text-gov-navy leading-relaxed font-normal whitespace-pre-wrap">
          {content}
        </p>

        {children && <div className="mt-4 space-y-3">{children}</div>}

        {timestamp && (
          <span className="block text-right text-[11px] text-gov-subtle mt-2">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};
