import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Sparkles, Check, X } from 'lucide-react';
import { Modal } from '../common/Modal';
import { SchemeDetail } from './SchemeDetail';
import { useLanguage } from '../../context/LanguageContext';

export const SchemeCard = ({ scheme }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const badgeConfig = {
    "🟢 Likely eligible": {
      style: "bg-sahayak-successBg text-sahayak-success border-emerald-200",
      icon: <Check className="w-3.5 h-3.5 text-sahayak-success" />,
      label: t('schemes.likelyEligible') || "Verified"
    },
    "🟡 More information needed": {
      style: "bg-sahayak-warningBg text-sahayak-warning border-amber-200",
      icon: <HelpCircle className="w-3.5 h-3.5 text-sahayak-warning" />,
      label: t('schemes.infoNeeded') || "More Info Needed"
    },
    "🔴 Appears not eligible": {
      style: "bg-sahayak-errorBg text-sahayak-error border-red-200",
      icon: <AlertCircle className="w-3.5 h-3.5 text-sahayak-error" />,
      label: t('schemes.notEligible') || "Check Criteria"
    }
  };

  const badge = badgeConfig[scheme.eligibilityBadge] || badgeConfig["🟢 Likely eligible"];
  const displayBenefit = scheme.benefits?.[0] || '₹6,000/year';

  const handleApplyWithSahayak = () => {
    navigate('/assistant', { state: { initialMessage: `Mujhe ${scheme.name} ke liye apply karna hai` } });
  };

  return (
    <>
      <div className="p-5 sm:p-6 bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl shadow-sahayak-card hover:shadow-sahayak-hover transition-all space-y-4 text-left">
        <div>
          <span className="text-[11px] font-bold text-sahayak-inkSoft uppercase tracking-wider block mb-1">
            {scheme.ministry || 'Ministry of Agriculture'}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-sahayak-ink tracking-tight leading-tight">
            {scheme.name}
          </h3>
          {scheme.hindiName && (
            <p className="text-xs font-semibold text-sahayak-inkSoft mt-0.5">{scheme.hindiName}</p>
          )}
        </div>

        <div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${badge.style}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </span>
        </div>

        <div className="text-2xl sm:text-3xl font-extrabold text-sahayak-primary tracking-tight">
          {displayBenefit}
        </div>

        {/* "Why it matches" Callout Box */}
        <div className="p-3.5 bg-sahayak-surfaceWarm border-l-4 border-sahayak-primary rounded-xl text-xs text-sahayak-ink font-medium space-y-1">
          <div className="flex items-center gap-1.5 font-extrabold text-sahayak-primary">
            <Sparkles className="w-4 h-4 text-sahayak-primary" />
            <span>{t('schemes.whyMatches') || "Why it matches:"}</span>
          </div>
          <p className="leading-relaxed text-sahayak-inkSoft">
            {scheme.explanation || "Your stated profile directly aligns with this scheme's primary criteria."}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={handleApplyWithSahayak}
            className="w-full py-3 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white font-extrabold text-xs sm:text-sm rounded-full transition-all shadow-sahayak-float flex items-center justify-center gap-2 min-h-touch active:scale-97"
          >
            <span>{t('schemes.applyWithSahayak') || "Apply with Sahayak"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full py-2.5 bg-sahayak-surface hover:bg-sahayak-surfaceWarm text-sahayak-ink border border-sahayak-border font-extrabold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 min-h-touch active:scale-97"
          >
            <span>{t('schemes.viewDetails') || "View details"}</span>
          </button>
        </div>

        <div className="text-center pt-0.5">
          <a
            href={scheme.officialUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-sahayak-inkMuted hover:text-sahayak-ink transition-colors"
          >
            <span>{t('schemes.officialSource') || "Official Government Portal"}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Desktop Modal / Mobile Bottom Sheet for Scheme Details */}
      {isOpen && (
        <>
          {/* Mobile Bottom Sheet (sm:hidden) */}
          <div className="sm:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/50 backdrop-blur-xs animate-in fade-in">
            <div className="w-full bg-sahayak-surface rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-xl border-t border-sahayak-border animate-in slide-in-from-bottom duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-sahayak-border">
                <h3 className="text-base font-extrabold text-sahayak-ink truncate max-w-[240px]">
                  {scheme.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-sahayak-inkMuted hover:text-sahayak-ink rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SchemeDetail scheme={scheme} onCloseModal={() => setIsOpen(false)} />
            </div>
          </div>

          {/* Desktop Centered Modal (hidden sm:block) */}
          <div className="hidden sm:block">
            <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={scheme.name}>
              <SchemeDetail scheme={scheme} onCloseModal={() => setIsOpen(false)} />
            </Modal>
          </div>
        </>
      )}
    </>
  );
};
