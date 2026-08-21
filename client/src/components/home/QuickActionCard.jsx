import React from 'react';
import { ArrowRight } from 'lucide-react';

export const QuickActionCard = ({ title, description, icon: Icon, onClick, badge }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col justify-between p-6 bg-white border border-gov-border rounded-2xl shadow-sm hover:shadow-md hover:border-gov-navy transition-all text-left focus:outline-none focus-visible:ring-3 focus-visible:ring-gov-accent min-h-[140px]"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-gov-navy group-hover:text-white text-gov-navy flex items-center justify-center transition-colors">
            <Icon className="w-5 h-5" />
          </div>
          {badge && (
            <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-lg font-bold text-gov-navy group-hover:text-gov-primary transition-colors mb-1">
          {title}
        </h3>
        <p className="text-sm text-gov-subtle leading-relaxed">
          {description}
        </p>
      </div>

      <div className="flex items-center gap-1 text-xs font-bold text-gov-primary group-hover:translate-x-1 transition-transform mt-4">
        <span>Proceed</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </div>
    </button>
  );
};
