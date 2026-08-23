import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SahayakVoiceOrb } from '../components/voice/SahayakVoiceOrb';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Send, ArrowRight, Sparkles, MessageSquare, Compass, ShieldCheck } from 'lucide-react';

const HomePageContent = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [voiceState, setVoiceState] = useState('idle');
  const [textInput, setTextInput] = useState('');

  const handleVoiceTranscript = (text) => {
    navigate('/assistant', { state: { initialMessage: text } });
  };

  const handlePromptClick = (promptText) => {
    navigate('/assistant', { state: { initialMessage: promptText } });
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (textInput.trim()) {
      navigate('/assistant', { state: { initialMessage: textInput.trim() } });
    }
  };

  const suggestionChips = [
    {
      label: language === 'hi' ? "PM-KISAN ₹6,000 योजना की जानकारी" : "PM-KISAN ₹6,000 scheme info",
      query: language === 'hi' ? "मुझे PM-KISAN योजना के बारे में बताओ" : "Tell me about PM-KISAN scheme"
    },
    {
      label: language === 'hi' ? "पानी नहीं आ रहा शिकायत दर्ज करें" : "No water supply complaint",
      query: language === 'hi' ? "मेरे वार्ड में 3 दिन से पानी नहीं आ रहा है" : "There has been no water supply for 3 days in my ward"
    },
    {
      label: language === 'hi' ? "आयुष्मान भारत गोल्डन कार्ड पात्रता" : "Ayushman Bharat Golden Card eligibility",
      query: language === 'hi' ? "आयुष्मान भारत गोल्डन कार्ड की पात्रता क्या है?" : "What is the eligibility for Ayushman Bharat Golden Card?"
    },
    {
      label: language === 'hi' ? "शिकायत की स्थिति जांचें" : "Track complaint status",
      query: language === 'hi' ? "मेरी शिकायत GRV-2026-894102 का स्टेटस बताओ" : "Check status of complaint GRV-2026-894102"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-in fade-in duration-300">
      {/* Central Hero Assistant Card Surface */}
      <div className="bg-sahayak-surface border border-sahayak-border rounded-3xl p-6 md:p-10 shadow-sahayak-card text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sahayak-surfaceWarm border border-sahayak-border rounded-full text-sahayak-primary text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SAHAYAK AI CITIZEN ASSISTANT</span>
        </div>

        <div className="max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl md:text-5xl font-black text-sahayak-ink tracking-tight leading-tight">
            {t('home.heroTitle') || 'Government Services at Your Voice'}
          </h1>
          <p className="text-xs md:text-sm text-sahayak-inkSoft font-medium leading-relaxed max-w-xl mx-auto">
            {t('home.heroSubtitle') || 'Ask questions about schemes, apply directly inside Sahayak, or register civil grievances in your natural language.'}
          </p>
        </div>

        {/* Hero Voice Orb Surface */}
        <div className="py-4 flex flex-col items-center justify-center">
          <SahayakVoiceOrb
            state={voiceState}
            setState={setVoiceState}
            onTranscript={handleVoiceTranscript}
            size="hero"
          />
        </div>

        {/* Text Input Composer */}
        <form onSubmit={handleTextSubmit} className="max-w-xl mx-auto relative">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={t('chat.placeholder') || "Ask anything about schemes, applications, or complaints..."}
            className="w-full pl-5 pr-14 py-3.5 bg-sahayak-canvas border border-sahayak-border rounded-full text-xs md:text-sm font-medium text-sahayak-ink focus:outline-none focus:border-sahayak-primary shadow-xs transition-colors placeholder:text-sahayak-inkMuted"
          />
          <button
            type="submit"
            disabled={!textInput.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-sahayak-primary hover:bg-sahayak-primaryHover disabled:opacity-40 text-white rounded-full transition-all min-h-touch min-w-touch flex items-center justify-center"
            title="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

        {/* Citizen Natural Language Suggestion Chips */}
        <div className="pt-2 max-w-3xl mx-auto space-y-2">
          <span className="text-[10px] font-extrabold text-sahayak-inkMuted uppercase tracking-wider block">
            {t('home.suggestions') || "Suggested Queries — Tap to try"}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestionChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(chip.query)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sahayak-surfaceWarm hover:bg-amber-100 border border-sahayak-border rounded-full text-xs font-bold text-sahayak-ink transition-all shadow-xs active:scale-97 min-h-touch"
              >
                <MessageSquare className="w-3.5 h-3.5 text-sahayak-primary shrink-0" />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div
          onClick={() => navigate('/assistant', { state: { initialMessage: "Mujhe saari yojnayein batao" } })}
          className="p-5 bg-sahayak-surface border border-sahayak-border rounded-2xl shadow-sahayak-card hover:shadow-sahayak-hover transition-all cursor-pointer space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-sahayak-surfaceWarm text-sahayak-primary flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-sahayak-ink group-hover:text-sahayak-primary transition-colors">
            {t('home.actionSchemesTitle') || 'Scheme Discovery'}
          </h3>
          <p className="text-xs text-sahayak-inkSoft leading-relaxed font-medium">
            {t('home.actionSchemesDesc') || 'Find eligible central & state welfare schemes based on age, income, and occupation.'}
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-sahayak-primary pt-1">
            <span>{t('home.exploreNow') || 'Discover Schemes'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => navigate('/assistant', { state: { initialMessage: "Mujhe complaint register karni hai" } })}
          className="p-5 bg-sahayak-surface border border-sahayak-border rounded-2xl shadow-sahayak-card hover:shadow-sahayak-hover transition-all cursor-pointer space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 text-sahayak-error flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-sahayak-ink group-hover:text-sahayak-primary transition-colors">
            {t('home.actionGrievanceTitle') || 'Grievance Filing'}
          </h3>
          <p className="text-xs text-sahayak-inkSoft leading-relaxed font-medium">
            {t('home.actionGrievanceDesc') || 'Report water, road, electricity, or sanitation issues directly to municipal departments.'}
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-sahayak-primary pt-1">
            <span>{t('home.startProcess') || 'File Grievance'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div
          onClick={() => navigate('/track')}
          className="p-5 bg-sahayak-surface border border-sahayak-border rounded-2xl shadow-sahayak-card hover:shadow-sahayak-hover transition-all cursor-pointer space-y-2 group"
        >
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-sahayak-success flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-black text-sahayak-ink group-hover:text-sahayak-primary transition-colors">
            {t('home.actionTrackTitle') || 'Real-time Tracking'}
          </h3>
          <p className="text-xs text-sahayak-inkSoft leading-relaxed font-medium">
            {t('home.actionTrackDesc') || 'Track application progress and grievance ticket status live with real officer history.'}
          </p>
          <div className="flex items-center gap-1 text-xs font-bold text-sahayak-primary pt-1">
            <span>{t('home.checkStatus') || 'Track Ticket'}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const HomePage = () => (
  <ErrorBoundary>
    <HomePageContent />
  </ErrorBoundary>
);
