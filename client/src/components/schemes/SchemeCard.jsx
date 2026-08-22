import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, CheckCircle2, AlertCircle, HelpCircle, ArrowRight, Sparkles, Check } from 'lucide-react';
import { Modal } from '../common/Modal';
import { SchemeDetail } from './SchemeDetail';
import { useLanguage } from '../../context/LanguageContext';

export const SchemeCard = ({ scheme }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const badgeConfig = {
    "🟢 Likely eligible": {
      style: "bg-emerald-100 text-emerald-800 border-emerald-300",
      icon: <Check className="w-3.5 h-3.5 text-emerald-700" />,
      label: "Verified"
    },
    "🟡 More information needed": {
      style: "bg-amber-100 text-amber-800 border-amber-300",
      icon: <HelpCircle className="w-3.5 h-3.5 text-amber-700" />,
      label: "More Info Needed"
    },
    "🔴 Appears not eligible": {
      style: "bg-red-100 text-red-800 border-red-300",
      icon: <AlertCircle className="w-3.5 h-3.5 text-red-700" />,
      label: "Check Criteria"
    }
  };

  const badge = badgeConfig[scheme.eligibilityBadge] || badgeConfig["🟢 Likely eligible"];
  const displayBenefit = scheme.benefits?.[0] || '₹6,000/year';

  const handleApplyWithSahayak = () => {
    navigate('/assistant', { state: { initialMessage: `Mujhe ${scheme.name} ke liye apply karna hai` } });
  };

  return (
    <>
      <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card hover:shadow-stitch-hover transition-all space-y-4 text-left">
        {/* Department / Ministry Label */}
        <div>
          <span className="text-[11px] font-bold text-stitch-subtle uppercase tracking-wider block mb-1">
            {scheme.ministry || 'Ministry of Agriculture'}
          </span>
          <h3 className="text-2xl font-black text-stitch-navy tracking-tight leading-tight">
            {scheme.name}
          </h3>
          {scheme.hindiName && (
            <p className="text-xs font-semibold text-slate-500 mt-0.5">{scheme.hindiName}</p>
          )}
        </div>

        {/* Verified Badge */}
        <div>
          <span className={`inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full border ${badge.style}`}>
            {badge.icon}
            <span>{badge.label}</span>
          </span>
        </div>

        {/* Large Highlighted Benefit */}
        <div className="text-3xl font-extrabold text-stitch-accent tracking-tight">
          {displayBenefit}
        </div>

        {/* "Why it matches" Callout Box (Screenshot 1) */}
        <div className="p-4 bg-stitch-matchBg border-l-4 border-stitch-accent rounded-2xl text-xs text-stitch-navy font-medium space-y-1">
          <div className="flex items-center gap-1.5 font-extrabold text-stitch-accent">
            <Sparkles className="w-4 h-4 text-stitch-accent" />
            <span>Why it matches:</span>
          </div>
          <p className="leading-relaxed text-slate-700">
            {scheme.explanation || "Your stated landholder profile directly aligns with this scheme's primary criteria."}
          </p>
        </div>

        {/* Actions Buttons Stack (Screenshot 1) */}
        <div className="space-y-2 pt-2">
          <button
            type="button"
            onClick={handleApplyWithSahayak}
            className="w-full py-3.5 bg-stitch-accent hover:bg-stitch-accentHover text-white font-extrabold text-sm rounded-full transition-all shadow-stitch-float flex items-center justify-center gap-2 min-h-touch"
          >
            <span>Apply with Sahayak</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="w-full py-3 bg-white hover:bg-slate-50 text-stitch-navy border border-slate-300 font-extrabold text-xs rounded-full transition-all flex items-center justify-center gap-1.5 min-h-touch"
          >
            <span>View details</span>
          </button>
        </div>

        {/* Secondary Official Source Link */}
        <div className="text-center pt-1">
          <a
            href={scheme.officialUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <span>Official Government Portal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Full Scheme Detail Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={scheme.name}>
        <SchemeDetail scheme={scheme} onCloseModal={() => setIsOpen(false)} />
      </Modal>
    </>
  );
};
