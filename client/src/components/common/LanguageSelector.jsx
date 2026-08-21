import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { language, switchLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white border border-gov-border rounded-lg p-1 shadow-sm">
      <Globe className="w-4 h-4 text-gov-subtle ml-1.5" aria-hidden="true" />
      <button
        type="button"
        onClick={() => switchLanguage('en')}
        className={`px-2.5 py-1 text-sm font-semibold rounded-md transition-colors min-h-touch ${
          language === 'en'
            ? 'bg-gov-navy text-white shadow-sm'
            : 'text-gov-navy hover:bg-slate-100'
        }`}
        aria-label="Switch UI to English"
        aria-pressed={language === 'en'}
      >
        English
      </button>
      <button
        type="button"
        onClick={() => switchLanguage('hi')}
        className={`px-2.5 py-1 text-sm font-semibold rounded-md transition-colors min-h-touch ${
          language === 'hi'
            ? 'bg-gov-navy text-white shadow-sm'
            : 'text-gov-navy hover:bg-slate-100'
        }`}
        aria-label="Switch UI to Hindi"
        aria-pressed={language === 'hi'}
      >
        हिंदी
      </button>
    </div>
  );
};
