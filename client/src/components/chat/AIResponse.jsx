import React, { useState } from 'react';
import { Volume2, VolumeX, ShieldCheck } from 'lucide-react';
import { voiceService } from '../../services/voiceService';
import { useLanguage } from '../../context/LanguageContext';

export const AIResponse = ({ content, children, timestamp }) => {
  const { language, t } = useLanguage();
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
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sahayak-intelligence text-white flex items-center justify-center font-bold text-base sm:text-lg shrink-0 shadow-xs mt-1 border border-purple-300/40">
        🏛️
      </div>
      <div className="flex-1 max-w-2xl bg-sahayak-surfaceWarm border border-sahayak-border/80 rounded-2xl rounded-tl-xs p-4 shadow-xs">
        <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-sahayak-border/60">
          <div className="flex items-center gap-1.5 text-[11px] font-extrabold text-sahayak-ink uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-sahayak-primary" />
            <span>SAHAYAK AI Assistant</span>
          </div>
          <button
            type="button"
            onClick={handleToggleSpeak}
            className={`p-1.5 rounded-lg transition-colors min-h-touch min-w-touch flex items-center justify-center ${
              isSpeaking ? 'bg-sahayak-warningBg text-sahayak-warning' : 'text-sahayak-inkMuted hover:text-sahayak-ink hover:bg-sahayak-surface'
            }`}
            aria-label={isSpeaking ? 'Stop speech' : 'Listen to AI response'}
            title="Read out response"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-sm sm:text-base text-sahayak-ink leading-relaxed font-normal whitespace-pre-wrap">
          {content}
        </p>

        {children && <div className="mt-3.5 space-y-3">{children}</div>}

        {timestamp && (
          <span className="block text-right text-[10px] text-sahayak-inkMuted font-mono mt-2 opacity-80">
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
};
