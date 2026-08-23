import React from 'react';
import { User } from 'lucide-react';

export const UserMessage = ({ content, timestamp, attachedImagePreview }) => {
  return (
    <div className="flex items-start justify-end gap-2.5 my-3 animate-in fade-in slide-in-from-bottom-1 duration-200">
      <div className="max-w-xl bg-sahayak-ink text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs space-y-2">
        {attachedImagePreview && (
          <div className="rounded-xl overflow-hidden border border-slate-700 max-w-[200px]">
            <img src={attachedImagePreview} alt="Attached Evidence" className="w-full h-auto object-cover" />
          </div>
        )}
        <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <span className="block text-right text-[10px] text-sahayak-inkMuted font-mono opacity-80">
            {timestamp}
          </span>
        )}
      </div>
      <div className="w-8 h-8 rounded-xl bg-sahayak-primary text-white flex items-center justify-center font-bold text-xs shrink-0 mt-1 shadow-xs border border-amber-400">
        <User className="w-4 h-4 text-white" />
      </div>
    </div>
  );
};
