import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { language, switchLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-sahayak-surface border border-sahayak-border rounded-full p-1 shadow-xs">
      <Globe className="w-4 h-4 text-sahayak-inkSoft ml-1.5 shrink-0" aria-hidden="true" />
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => switchLanguage('hi')}
          className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all min-h-touch ${
            language === 'hi'
              ? 'bg-sahayak-primary text-white shadow-xs'
              : 'text-sahayak-ink hover:bg-sahayak-surfaceWarm'
          }`}
          aria-label="Switch to Hindi language"
          aria-pressed={language === 'hi'}
        >
          हिंदी
        </button>

        <button
          type="button"
          onClick={() => switchLanguage('en')}
          className={`px-2.5 py-1 text-xs font-bold rounded-full transition-all min-h-touch ${
            language === 'en'
              ? 'bg-sahayak-primary text-white shadow-xs'
              : 'text-sahayak-ink hover:bg-sahayak-surfaceWarm'
          }`}
          aria-label="Switch to English language"
          aria-pressed={language === 'en'}
        >
          EN
        </button>
      </div>
    </div>
  );
};
