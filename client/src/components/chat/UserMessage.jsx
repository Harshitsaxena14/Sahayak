import React from 'react';
import { User } from 'lucide-react';

export const UserMessage = ({ content, timestamp }) => {
  return (
    <div className="flex items-start justify-end gap-3 my-3">
      <div className="max-w-xl bg-gov-navy text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs">
        <p className="text-base font-medium leading-relaxed whitespace-pre-wrap">{content}</p>
        {timestamp && (
          <span className="block text-right text-[11px] text-slate-300 mt-1 opacity-80">
            {timestamp}
          </span>
        )}
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-200 text-gov-navy flex items-center justify-center font-bold text-xs shrink-0 mt-1">
        <User className="w-4 h-4" />
      </div>
    </div>
  );
};
