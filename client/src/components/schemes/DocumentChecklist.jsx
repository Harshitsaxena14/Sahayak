import React from 'react';
import { FileCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const DocumentChecklist = ({ documents = [] }) => {
  const { t } = useLanguage();
  if (!documents.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-sahayak-inkMuted uppercase tracking-wider flex items-center gap-1.5">
        <FileCheck className="w-4 h-4 text-sahayak-primary" />
        <span>{t('schemes.documents') || "Required Documents Checklist"}</span>
      </h4>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {documents.map((doc, idx) => (
          <li key={idx} className="flex items-center gap-2 text-xs font-medium text-sahayak-ink bg-sahayak-surface border border-sahayak-border px-3 py-2 rounded-xl">
            <span className="w-1.5 h-1.5 rounded-full bg-sahayak-primary shrink-0" />
            <span>{doc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
