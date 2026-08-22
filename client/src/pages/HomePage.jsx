import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { SahayakVoiceOrb } from '../components/voice/SahayakVoiceOrb';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Landmark, FileText, Search, Send, ArrowRight, Compass } from 'lucide-react';

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

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-10 space-y-8 animate-in fade-in duration-300">
      {/* Desktop 2-Column Hero */}
      <div className="hidden md:grid md:grid-cols-2 gap-8 items-center bg-white/80 border border-slate-200/90 rounded-3xl p-8 shadow-stitch-card">
        {/* Left Column */}
        <div className="space-y-4 text-left">
          <span className="text-[11px] font-extrabold text-stitch-accent uppercase tracking-widest block">
            CITIZEN ASSISTANT
          </span>
          <h1 className="text-4xl lg:text-5xl font-black text-stitch-navy tracking-tight leading-tight">
            {t('home.desktopHeadline')}
          </h1>
          <p className="text-sm text-stitch-subtle leading-relaxed font-medium">
            {t('home.desktopSubtitle')}
          </p>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/assistant')}
              className="px-6 py-3 bg-black hover:bg-slate-800 text-white font-extrabold text-xs rounded-full transition-all shadow-stitch-float flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>{t('home.startListening')}</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/assistant', { state: { initialMessage: "Mujhe saari sarkari yojnayein dikhao" } })}
              className="px-6 py-3 bg-white hover:bg-slate-100 text-stitch-navy border border-slate-300 font-extrabold text-xs rounded-full transition-all"
            >
              <span>{t('home.exploreDirectory')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Elevated Voice Card */}
        <div className="p-8 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card flex flex-col items-center justify-center space-y-4 text-center">
          <span className="text-[10px] font-extrabold text-stitch-subtle uppercase tracking-wider">
            • Awaiting input...
          </span>

          <SahayakVoiceOrb
            state={voiceState}
            setState={setVoiceState}
            onTranscript={handleVoiceTranscript}
          />

          <p className="text-xs text-slate-400 italic font-medium">
            "{language === 'hi' ? 'मुझे योजनाओं के बारे में बताओ' : 'Find housing schemes in Mumbai'}"
          </p>
        </div>
      </div>

      {/* Mobile Hero */}
      <div className="md:hidden space-y-5 text-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-stitch-navy tracking-tight">
            {t('home.heroTitle')}
          </h1>
          <p className="text-xs text-stitch-subtle font-medium">
            {t('home.heroSubtitle')}
          </p>
        </div>

        {/* Soft Lavender Voice Orb Box */}
        <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card space-y-4">
          <SahayakVoiceOrb
            state={voiceState}
            setState={setVoiceState}
            onTranscript={handleVoiceTranscript}
          />

          <form onSubmit={handleTextSubmit} className="relative">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder={t('chat.placeholder')}
              className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-full text-xs font-medium focus:outline-none focus:border-stitch-accent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-stitch-accent hover:text-stitch-navy"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Suggestion Chips */}
      <div className="space-y-2 text-center md:text-left">
        <span className="text-[10px] font-extrabold text-stitch-subtle uppercase tracking-wider block">
          {t('home.suggestions')}
        </span>
        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
          {[
            { label: t('home.actionSchemesTitle'), icon: Search, query: "Mere paas 2 acre zameen hai Gwalior mein, PM-KISAN ke baare mein batao" },
            { label: t('home.actionGrievanceTitle'), icon: FileText, query: "Mere area Ward 12 mein 5 din se paani nahi aa raha" },
            { label: t('home.actionTrackTitle'), icon: Landmark, query: "Meri complaint GRV-2026-894102 ka status kya hai?" }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handlePromptClick(item.query)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-amber-50 border border-slate-200/90 rounded-full text-xs font-bold text-stitch-navy transition-all shadow-2xs"
              >
                <Icon className="w-3.5 h-3.5 text-stitch-accent" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Core Capabilities 3-Card Grid */}
      <div className="space-y-3 text-left">
        <div>
          <h2 className="text-xl font-black text-stitch-navy tracking-tight">{t('home.coreCapabilities')}</h2>
          <p className="text-xs text-stitch-subtle font-medium">{t('home.coreCapabilitiesDesc')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/assistant', { state: { initialMessage: "Mere liye koi government scheme hai?" } })}
            className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card hover:shadow-stitch-hover transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Landmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stitch-navy">{t('home.actionSchemesTitle')}</h3>
              <p className="text-xs text-stitch-subtle mt-1 font-medium leading-relaxed">
                {t('home.actionSchemesDesc')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-stitch-accent pt-1">
              <span>{t('home.exploreNow')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate('/assistant', { state: { initialMessage: "Mujhe complaint register karni hai" } })}
            className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card hover:shadow-stitch-hover transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 text-red-700 flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stitch-navy">{t('home.actionGrievanceTitle')}</h3>
              <p className="text-xs text-stitch-subtle mt-1 font-medium leading-relaxed">
                {t('home.actionGrievanceDesc')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-stitch-accent pt-1">
              <span>{t('home.startProcess')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => navigate('/track')}
            className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card hover:shadow-stitch-hover transition-all cursor-pointer space-y-3"
          >
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-stitch-navy">{t('home.actionTrackTitle')}</h3>
              <p className="text-xs text-stitch-subtle mt-1 font-medium leading-relaxed">
                {t('home.actionTrackDesc')}
              </p>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-stitch-accent pt-1">
              <span>{t('home.checkStatus')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
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
