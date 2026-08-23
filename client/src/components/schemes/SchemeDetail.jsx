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
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-sahayak-border">
        <div className="flex items-center gap-2 text-xs font-bold text-sahayak-inkSoft">
          <Building2 className="w-4 h-4 text-sahayak-primary" />
          <span>{scheme.ministry}</span>
        </div>
        <span className="text-xs font-extrabold bg-sahayak-surfaceWarm text-sahayak-ink px-3 py-1 rounded-full border border-sahayak-border">
          {scheme.sector || 'Central Scheme'}
        </span>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-[10px] font-extrabold text-sahayak-inkMuted uppercase tracking-wider mb-1">
          {t('schemes.aboutScheme') || "About Scheme"}
        </h4>
        <p className="text-xs sm:text-sm text-sahayak-ink leading-relaxed font-medium">{scheme.description}</p>
      </div>

      {/* Target Beneficiaries */}
      <div className="p-3.5 bg-sahayak-surfaceWarm border-l-4 border-sahayak-primary rounded-xl space-y-1">
        <h4 className="text-xs font-extrabold text-sahayak-primary uppercase tracking-wider flex items-center gap-1.5">
          <Target className="w-4 h-4 text-sahayak-primary" />
          <span>{t('schemes.whoCanApply') || "Who can apply?"}</span>
        </h4>
        <p className="text-xs font-bold text-sahayak-ink">{scheme.targetBeneficiaries}</p>
      </div>

      {/* Eligibility Breakdown */}
      <div>
        <h4 className="text-[10px] font-extrabold text-sahayak-inkMuted uppercase tracking-wider mb-2">
          {t('schemes.eligibilityCriteria') || "Eligibility Criteria"}
        </h4>
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
          <h4 className="text-[10px] font-extrabold text-sahayak-inkMuted uppercase tracking-wider">
            {t('schemes.steps') || "Application Steps"}
          </h4>
          <ol className="space-y-2">
            {scheme.applicationSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-sahayak-ink bg-sahayak-canvas p-3 rounded-xl border border-sahayak-border">
                <span className="w-5 h-5 rounded-full bg-sahayak-ink text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-normal font-medium">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Action CTAs */}
      <div className="pt-4 border-t border-sahayak-border flex flex-wrap items-center justify-between gap-3">
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-sahayak-surface hover:bg-sahayak-surfaceWarm text-sahayak-ink border border-sahayak-border text-xs font-extrabold rounded-full transition-all shrink-0 min-h-touch"
        >
          <span>{t('schemes.officialSource') || "Official Source"}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          type="button"
          onClick={handleApplyWithSahayak}
          className="inline-flex items-center gap-2 px-6 py-3 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white text-xs font-extrabold rounded-full transition-all shadow-sahayak-float active:scale-95 min-h-touch ml-auto"
        >
          <span>{t('schemes.applyWithSahayak') || "Apply with Sahayak"}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
