import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { User, MapPin, Phone, Globe, Save, FileText, CheckCircle2 } from 'lucide-react';
import { TicketCard } from '../components/grievances/TicketCard';
import { ApplicationConfirmationCard } from '../components/schemes/ApplicationConfirmationCard';

const ProfilePageContent = () => {
  const { language, switchLanguage, t } = useLanguage();

  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('sahayak_citizen_profile');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      name: 'Charchit Saxena',
      phone: '+91 98765 43210',
      location: 'Ward 12, Thatipur, Gwalior (M.P.)'
    };
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    try {
      localStorage.setItem('sahayak_citizen_profile', JSON.stringify(profile));
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (e) {}
  };

  // Mock list of past citizen submissions for profile overview
  const pastGrievances = [
    {
      ticketId: 'GRV-2026-894102',
      category: 'Water Supply',
      department: 'Municipal Jal Board',
      location: profile.location,
      duration: '3 days',
      status: 'In Progress',
      createdAt: '2026-08-19'
    }
  ];

  const pastApplications = [
    {
      applicationId: 'APP-2026-784912',
      schemeName: 'PM Kisan Samman Nidhi (PM-KISAN)',
      status: 'Submitted',
      createdAt: '2026-08-20'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-in fade-in duration-200 text-left">
      <div className="space-y-1">
        <span className="text-[10px] font-extrabold text-sahayak-primary uppercase tracking-wider block">
          CITIZEN ACCOUNT
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-sahayak-ink tracking-tight">
          {language === 'hi' ? 'नागरिक प्रोफ़ाइल' : 'Citizen Profile'}
        </h1>
        <p className="text-xs sm:text-sm text-sahayak-inkSoft font-medium">
          {language === 'hi' ? 'अपनी व्यक्तिगत जानकारी और पिछले आवेदनों को प्रबंधित करें।' : 'Manage your personal details and view your submitted applications & grievances.'}
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-sahayak-card space-y-4">
        <h3 className="text-base font-black text-sahayak-ink border-b border-sahayak-border pb-2 flex items-center gap-2">
          <User className="w-5 h-5 text-sahayak-primary" />
          <span>{language === 'hi' ? 'व्यक्तिगत विवरण' : 'Personal Details'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-sahayak-ink block mb-1">
              {language === 'hi' ? 'पूरा नाम' : 'Full Name'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-sahayak-canvas border border-sahayak-border rounded-xl font-semibold text-sahayak-ink focus:outline-none focus:border-sahayak-primary min-h-touch"
              />
              <User className="w-4 h-4 text-sahayak-inkMuted absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label className="font-bold text-sahayak-ink block mb-1">
              {language === 'hi' ? 'मोबाइल नंबर' : 'Phone Number'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-sahayak-canvas border border-sahayak-border rounded-xl font-semibold text-sahayak-ink focus:outline-none focus:border-sahayak-primary min-h-touch"
              />
              <Phone className="w-4 h-4 text-sahayak-inkMuted absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-sahayak-ink block mb-1">
              {language === 'hi' ? 'सटीक स्थान / वार्ड / लैंडमार्क' : 'Location / Ward / Landmark'}
            </label>
            <div className="relative">
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-sahayak-canvas border border-sahayak-border rounded-xl font-semibold text-sahayak-ink focus:outline-none focus:border-sahayak-primary min-h-touch"
              />
              <MapPin className="w-4 h-4 text-sahayak-inkMuted absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label className="font-bold text-sahayak-ink block mb-1">
              {language === 'hi' ? 'इंटरफ़ेस भाषा' : 'UI Language Preference'}
            </label>
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => switchLanguage('hi')}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all min-h-touch flex items-center justify-center gap-2 ${
                  language === 'hi'
                    ? 'bg-sahayak-primary text-white border-sahayak-primary shadow-xs'
                    : 'bg-sahayak-canvas text-sahayak-ink border-sahayak-border hover:bg-sahayak-surfaceWarm'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>हिंदी (Hindi)</span>
              </button>

              <button
                type="button"
                onClick={() => switchLanguage('en')}
                className={`flex-1 py-2.5 px-4 rounded-xl border text-xs font-bold transition-all min-h-touch flex items-center justify-center gap-2 ${
                  language === 'en'
                    ? 'bg-sahayak-primary text-white border-sahayak-primary shadow-xs'
                    : 'bg-sahayak-canvas text-sahayak-ink border-sahayak-border hover:bg-sahayak-surfaceWarm'
                }`}
              >
                <Globe className="w-4 h-4" />
                <span>English</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          {isSaved && (
            <span className="text-xs font-bold text-sahayak-success flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'hi' ? 'विवरण सुरक्षित हुआ!' : 'Profile saved successfully!'}</span>
            </span>
          )}
          <button
            type="submit"
            className="ml-auto px-6 py-2.5 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white font-extrabold text-xs rounded-full transition-all shadow-sahayak-float flex items-center gap-1.5 min-h-touch active:scale-97"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सुरक्षित करें' : 'Save Profile'}</span>
          </button>
        </div>
      </form>

      {/* Submitted Records Summary */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-sahayak-ink flex items-center gap-2">
          <FileText className="w-5 h-5 text-sahayak-primary" />
          <span>{language === 'hi' ? 'आपके पिछले आवेदन एवं शिकायतें' : 'Your Past Submissions'}</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-xs font-extrabold text-sahayak-inkMuted uppercase tracking-wider mb-2">
              {language === 'hi' ? 'शिकायत टिकट' : 'Grievance Tickets'}
            </h4>
            {pastGrievances.map((g) => (
              <TicketCard key={g.ticketId} ticket={g} />
            ))}
          </div>

          <div>
            <h4 className="text-xs font-extrabold text-sahayak-inkMuted uppercase tracking-wider mb-2">
              {language === 'hi' ? 'योजना आवेदन' : 'Scheme Applications'}
            </h4>
            {pastApplications.map((a) => (
              <ApplicationConfirmationCard key={a.applicationId} application={a} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfilePage = () => (
  <ErrorBoundary>
    <ProfilePageContent />
  </ErrorBoundary>
);
