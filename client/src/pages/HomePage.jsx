import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SahayakVoiceOrb } from '../components/voice/SahayakVoiceOrb';
import { QuickActionCard } from '../components/home/QuickActionCard';
import { Landmark, FileText, Search, Keyboard, Sparkles, MessageSquare } from 'lucide-react';

export const HomePage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [voiceState, setVoiceState] = useState('idle');
  const [voiceError, setVoiceError] = useState(null);

  const handleVoiceTranscript = (text) => {
    navigate('/assistant', { state: { initialMessage: text } });
  };

  const handlePromptClick = (promptText) => {
    navigate('/assistant', { state: { initialMessage: promptText } });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-gov-accentDark text-xs font-bold shadow-2xs">
          <Sparkles className="w-4 h-4 text-gov-accent" />
          <span>Sahayak Citizen Access Layer</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-gov-navy tracking-tight leading-tight">
          Aapko kis cheez mein madad chahiye?
        </h1>
        <p className="text-base sm:text-lg text-gov-subtle max-w-2xl mx-auto leading-relaxed font-medium">
          Bas batayiye aapko kis cheez ki zarurat hai. Aap bolkar ya likhkar madad le sakte hain.
        </p>

        {/* Primary Action Hero Box with SahayakVoiceOrb */}
        <div className="p-8 bg-white border border-gov-border rounded-3xl shadow-sm max-w-xl mx-auto space-y-6">
          <SahayakVoiceOrb
            state={voiceState}
            setState={setVoiceState}
            onTranscript={handleVoiceTranscript}
            onError={(msg) => setVoiceError(msg)}
          />

          {voiceError && (
            <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
              {voiceError}
            </p>
          )}

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <span className="relative px-3 bg-white text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
          </div>

          <button
            type="button"
            onClick={() => navigate('/assistant')}
            className="w-full py-4 bg-slate-100 hover:bg-slate-200/80 text-gov-navy font-extrabold text-base rounded-2xl transition-colors flex items-center justify-center gap-2.5 min-h-touch"
          >
            <Keyboard className="w-5 h-5 text-gov-primary" />
            <span>Type your question or complaint</span>
          </button>
        </div>
      </section>

      {/* Tappable Example Prompt Chips */}
      <section className="space-y-3">
        <h2 className="text-xs font-bold text-gov-subtle uppercase tracking-wider text-center">
          Try asking one of these:
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto">
          {[
            "Mere liye koi government scheme hai?",
            "Mere area Ward 12 mein paani nahi aa raha.",
            "Meri complaint GRV-2026-894102 ka status kya hai?"
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handlePromptClick(prompt)}
              className="px-4 py-2.5 bg-white border border-slate-200 hover:border-gov-accent hover:bg-amber-50/50 text-gov-navy text-xs sm:text-sm font-semibold rounded-2xl shadow-2xs transition-all text-left min-h-touch"
            >
              💬 "{prompt}"
            </button>
          ))}
        </div>
      </section>

      {/* Secondary Supporting Actions */}
      <section className="space-y-4 pt-4">
        <h2 className="text-base font-bold text-gov-navy">
          Supporting Citizen Services
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <QuickActionCard
            title={t('home.actionSchemesTitle')}
            description={t('home.actionSchemesDesc')}
            icon={Landmark}
            onClick={() => navigate('/assistant', { state: { initialMessage: "Mere liye koi government scheme hai?" } })}
            badge="Scheme Assistant"
          />
          <QuickActionCard
            title={t('home.actionGrievanceTitle')}
            description={t('home.actionGrievanceDesc')}
            icon={FileText}
            onClick={() => navigate('/assistant', { state: { initialMessage: "Mujhe complaint register karni hai" } })}
            badge="Grievance Assistant"
          />
          <QuickActionCard
            title={t('home.actionTrackTitle')}
            description={t('home.actionTrackDesc')}
            icon={Search}
            onClick={() => navigate('/track')}
          />
        </div>
      </section>
    </div>
  );
};
