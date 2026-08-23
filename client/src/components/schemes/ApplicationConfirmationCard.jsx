import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const ApplicationConfirmationCard = ({ application }) => {
  const { t, language } = useLanguage();
  if (!application) return null;

  return (
    <div className="p-5 sm:p-6 bg-sahayak-successBg border-2 border-emerald-300 rounded-2xl sm:rounded-3xl shadow-xs space-y-4 text-left animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sahayak-success text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
          <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div>
          <span className="text-xs font-bold text-sahayak-success uppercase tracking-wider block">
            {language === 'hi' ? "योजना आवेदन सफलतापूर्वक सबमिट हुआ" : "Scheme Application Submitted"}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-sahayak-ink font-mono">
            {application.applicationId}
          </h3>
        </div>
      </div>

      <div className="p-3.5 bg-sahayak-surface rounded-xl border border-emerald-200 text-xs space-y-2 text-sahayak-ink shadow-xs">
        <div className="flex justify-between border-b border-sahayak-border pb-1.5">
          <span className="text-sahayak-inkMuted font-semibold">{language === 'hi' ? "योजना का नाम:" : "Scheme Name:"}</span>
          <span className="font-extrabold">{application.schemeName}</span>
        </div>
        <div className="flex justify-between border-b border-sahayak-border pb-1.5">
          <span className="text-sahayak-inkMuted font-semibold">{language === 'hi' ? "आवेदन स्थिति:" : "Submission Status:"}</span>
          <span className="font-bold text-sahayak-success bg-emerald-100 px-2 py-0.5 rounded-full">{application.status || 'Submitted'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sahayak-inkMuted font-semibold">{language === 'hi' ? "आवेदन तिथि:" : "Submitted On:"}</span>
          <span className="font-medium">{new Date(application.createdAt || Date.now()).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Prototype Disclaimer Banner */}
      <div className="bg-sahayak-warningBg border border-amber-300 text-sahayak-warning p-3 rounded-xl text-xs font-medium flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-sahayak-warning shrink-0" />
        <span>{language === 'hi' ? "डेमो/प्रोटोटाइप सबमिशन · सिम्युलेटेड सरकारी एकीकरण" : "Demo Mode · Prototype uses simulated government workflows"}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <span className="text-[11px] font-semibold text-sahayak-success italic">
          {language === 'hi' ? "ट्रैकिंग के लिए यह आवेदन आईडी सुरक्षित रखें" : "Keep this Application ID for tracking inside Sahayak"}
        </span>
        <Link
          to={`/track?appId=${application.applicationId}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sahayak-success hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs min-h-touch active:scale-97"
        >
          <span>{t('tracking.search') || "Track Application"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
