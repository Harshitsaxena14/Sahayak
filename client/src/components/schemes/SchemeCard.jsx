import React, { useState } from 'react';
import { ExternalLink, ChevronRight, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { SchemeDetail } from './SchemeDetail';
import { useLanguage } from '../../context/LanguageContext';

export const SchemeCard = ({ scheme }) => {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const badgeConfig = {
    "🟢 Likely eligible": {
      style: "bg-emerald-50 text-emerald-800 border-emerald-300",
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />
    },
    "🟡 More information needed": {
      style: "bg-amber-50 text-amber-800 border-amber-300",
      icon: <HelpCircle className="w-4 h-4 text-amber-600" />
    },
    "🔴 Appears not eligible": {
      style: "bg-red-50 text-red-800 border-red-300",
      icon: <AlertCircle className="w-4 h-4 text-red-600" />
    }
  };

  const badge = badgeConfig[scheme.eligibilityBadge] || badgeConfig["🟡 More information needed"];

  return (
    <>
      <div className="p-5 bg-white border border-gov-border rounded-2xl shadow-xs hover:shadow-md transition-all space-y-3">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <span className="text-xs font-bold text-gov-subtle block uppercase tracking-wider mb-0.5">
              {scheme.ministry}
            </span>
            <h3 className="text-lg font-bold text-gov-navy leading-snug">
              {scheme.name}
            </h3>
            {scheme.hindiName && (
              <p className="text-xs font-medium text-slate-500 mt-0.5">{scheme.hindiName}</p>
            )}
          </div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${badge.style}`}>
            {badge.icon}
            <span>{scheme.eligibilityBadge}</span>
          </span>
        </div>

        {/* Purpose */}
        <p className="text-sm text-gov-navy leading-relaxed line-clamp-2">
          {scheme.purpose || scheme.description}
        </p>

        {/* Benefits summary bullets */}
        {scheme.benefits?.length > 0 && (
          <div className="bg-slate-50 border border-slate-200/80 p-3 rounded-xl space-y-1">
            <span className="text-[11px] font-bold text-gov-subtle uppercase tracking-wider block">Key Benefit</span>
            <p className="text-xs font-semibold text-gov-navy flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 shrink-0"></span>
              <span>{scheme.benefits[0]}</span>
            </p>
          </div>
        )}

        {/* Official Source & Actions */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-gov-subtle hover:text-gov-navy flex items-center gap-1 min-h-touch"
          >
            <span>Official Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="inline-flex items-center gap-1 px-3 py-2 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-primary transition-colors min-h-touch"
          >
            <span>{t('schemes.viewDetails')}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Full Scheme Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={scheme.name}>
        <SchemeDetail scheme={scheme} />
      </Modal>
    </>
  );
};
