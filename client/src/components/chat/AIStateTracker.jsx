import React from 'react';
import { Mic, Brain, Search, ClipboardCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const AIStateTracker = ({ currentStage = 'understanding' }) => {
  const { t, language } = useLanguage();

  const stages = [
    { key: 'listening', label: language === 'hi' ? 'सुन रहा हूँ' : 'Listening', icon: Mic },
    { key: 'understanding', label: language === 'hi' ? 'समझ रहा हूँ' : 'Understanding', icon: Brain },
    { key: 'finding', label: language === 'hi' ? 'योजनाएं खोज रहा हूँ' : 'Finding Info', icon: Search },
    { key: 'checking', label: language === 'hi' ? 'पात्रता जांच' : 'Checking Rules', icon: ClipboardCheck },
    { key: 'ready', label: language === 'hi' ? 'तैयार है' : 'Ready', icon: CheckCircle2 }
  ];

  const currentIdx = stages.findIndex(s => s.key === currentStage);
  const activeIdx = currentIdx !== -1 ? currentIdx : 1;

  return (
    <div className="p-4 bg-sahayak-surface border border-sahayak-border rounded-2xl shadow-xs space-y-2 animate-in fade-in duration-200">
      <div className="flex items-center justify-between gap-1">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;
          const isPassed = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div key={stage.key} className="flex-1 flex flex-col items-center text-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-sahayak-primary text-white ring-4 ring-sahayak-surfaceWarm scale-110'
                    : isPassed
                    ? 'bg-sahayak-success text-white'
                    : 'bg-sahayak-canvas text-sahayak-inkMuted border border-sahayak-border'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold mt-1.5 hidden sm:block ${isCurrent ? 'text-sahayak-ink font-extrabold' : 'text-sahayak-inkMuted'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-sahayak-border h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-sahayak-primary h-full transition-all duration-300 rounded-full"
          style={{ width: `${((activeIdx + 1) / stages.length) * 100}%` }}
        />
      </div>
    </div>
  );
};
