import React from 'react';
import { EligibilityStep } from './EligibilityStep';
import { DocumentChecklist } from './DocumentChecklist';
import { ExternalLink, Building2, Target } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SchemeDetail = ({ scheme }) => {
  const { t } = useLanguage();
  if (!scheme) return null;

  return (
    <div className="space-y-5">
      {/* Ministry & Category */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-gov-subtle">
          <Building2 className="w-4 h-4 text-gov-primary" />
          <span>{scheme.ministry}</span>
        </div>
        <span className="text-xs font-bold bg-slate-100 text-gov-navy px-2.5 py-1 rounded-full border border-slate-200">
          {scheme.sector}
        </span>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-xs font-bold text-gov-subtle uppercase tracking-wider mb-1">About Scheme</h4>
        <p className="text-sm text-gov-navy leading-relaxed">{scheme.description}</p>
      </div>

      {/* Target Beneficiaries */}
      <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl">
        <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5 mb-1">
          <Target className="w-4 h-4 text-amber-700" />
          <span>Who is it for?</span>
        </h4>
        <p className="text-xs font-semibold text-amber-950">{scheme.targetBeneficiaries}</p>
      </div>

      {/* Eligibility Breakdown */}
      <div>
        <h4 className="text-xs font-bold text-gov-subtle uppercase tracking-wider mb-2">Eligibility Criteria</h4>
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
          <h4 className="text-xs font-bold text-gov-subtle uppercase tracking-wider">{t('schemes.steps')}</h4>
          <ol className="space-y-2">
            {scheme.applicationSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-gov-navy bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <span className="w-5 h-5 rounded-full bg-gov-navy text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                  {idx + 1}
                </span>
                <span className="leading-normal">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Official Link */}
      <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
        <span className="text-xs text-gov-subtle italic truncate">{scheme.sourceMetadata}</span>
        <a
          href={scheme.officialUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-primary transition-colors shrink-0 min-h-touch"
        >
          <span>{t('schemes.source')}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
