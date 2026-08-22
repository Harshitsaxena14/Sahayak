import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EligibilityStep } from './EligibilityStep';
import { DocumentChecklist } from './DocumentChecklist';
import { ExternalLink, Building2, Target, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SchemeDetail = ({ scheme, onCloseModal }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  if (!scheme) return null;

  const handleApplyWithSahayak = () => {
    if (onCloseModal) onCloseModal();
    navigate('/assistant', { state: { initialMessage: `Mujhe ${scheme.name} ke liye apply karna hai` } });
  };

  return (
    <div className="space-y-5 text-left">
      {/* Ministry & Sector Badge */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-bold text-stitch-subtle">
          <Building2 className="w-4 h-4 text-stitch-accent" />
          <span>{scheme.ministry}</span>
        </div>
        <span className="text-xs font-extrabold bg-slate-100 text-stitch-navy px-3 py-1 rounded-full border border-slate-200">
          {scheme.sector || 'Central Scheme'}
        </span>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-[10px] font-extrabold text-stitch-subtle uppercase tracking-wider mb-1">About Scheme</h4>
        <p className="text-sm text-stitch-navy leading-relaxed font-medium">{scheme.description}</p>
      </div>

      {/* Target Beneficiaries */}
      <div className="p-4 bg-stitch-matchBg border-l-4 border-stitch-accent rounded-2xl space-y-1">
        <h4 className="text-xs font-extrabold text-stitch-accent uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-4 h-4 text-stitch-accent" />
          <span>Who can apply?</span>
        </h4>
        <p className="text-xs font-bold text-stitch-navy">{scheme.targetBeneficiaries}</p>
      </div>

      {/* Eligibility Breakdown */}
      <div>
        <h4 className="text-[10px] font-extrabold text-stitch-subtle uppercase tracking-wider mb-2">Eligibility Criteria</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {scheme.eligibility?.maxIncome && (
            <EligibilityStep label="Annual Income Limit" value={`Up to ₹${scheme.eligibility.maxIncome.toLocaleString('en-IN')}/year`} />
          )}
          {scheme.eligibility?.occupation && (
            <EligibilityStep label="Allowed Occupations" value={scheme.eligibility.occupation.join(', ')} />
          )}
          {scheme.eligibility?.minAge !== undefined && (
            <EligibilityStep label="Age Limit" value={`${scheme.eligibility.minAge} to ${scheme.eligibility.maxAge} years`} />
          )}
          {scheme.eligibility?.gender && (
            <EligibilityStep label="Target Gender" value={scheme.eligibility.gender} />
          )}
        </div>
      </div>

      {/* Document Checklist */}
      <DocumentChecklist documents={scheme.documentsRequired} />

      {/* Application Steps */}
      {scheme.applicationSteps?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[10px] font-extrabold text-stitch-subtle uppercase tracking-wider">{t('schemes.steps')}</h4>
          <ol className="space-y-2">
            {scheme.applicationSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-stitch-navy bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                <span className="w-5 h-5 rounded-full bg-stitch-navy text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-normal font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Action CTAs */}
      <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-slate-100 text-stitch-navy border border-slate-300 text-xs font-extrabold rounded-full transition-all shrink-0 min-h-touch"
        >
          <span>Official Source</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          type="button"
          onClick={handleApplyWithSahayak}
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-stitch-accent hover:bg-stitch-accentHover text-white text-xs font-extrabold rounded-full transition-all shadow-stitch-float active:scale-95 min-h-touch ml-auto"
        >
          <span>Apply with Sahayak</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
