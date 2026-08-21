import React from 'react';
import { Mic, Brain, Search, ClipboardCheck, CheckCircle2 } from 'lucide-react';

export const AIStateTracker = ({ currentStage = 'understanding' }) => {
  const stages = [
    { key: 'listening', label: 'Listening', icon: Mic },
    { key: 'understanding', label: 'Understanding', icon: Brain },
    { key: 'finding', label: 'Finding Schemes/Info', icon: Search },
    { key: 'checking', label: 'Checking Rules', icon: ClipboardCheck },
    { key: 'ready', label: 'Ready', icon: CheckCircle2 }
  ];

  const currentIdx = stages.findIndex(s => s.key === currentStage);
  const activeIdx = currentIdx !== -1 ? currentIdx : 1;

  return (
    <div className="p-4 bg-white border border-gov-border rounded-2xl shadow-2xs space-y-2 animate-in fade-in duration-200">
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
                    ? 'bg-gov-navy text-gov-accent ring-4 ring-amber-100 scale-110'
                    : isPassed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'animate-pulse' : ''}`} />
              </div>
              <span className={`text-[10px] font-bold mt-1.5 hidden sm:block ${isCurrent ? 'text-gov-navy font-extrabold' : 'text-gov-subtle'}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gov-navy h-full transition-all duration-300 rounded-full"
          style={{ width: `${((activeIdx + 1) / stages.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};
