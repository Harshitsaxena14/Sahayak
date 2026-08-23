import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, Compass, FileText, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MobileBottomNav = () => {
  const { t, language } = useLanguage();
  const location = useLocation();

  const links = [
    { path: '/', label: t('nav.home') || 'Home', icon: Landmark },
    { path: '/assistant', label: language === 'hi' ? 'सहायक' : 'Ask Sahayak', icon: Compass },
    { path: '/track', label: t('nav.track') || 'Track', icon: FileText },
    { path: '/profile', label: language === 'hi' ? 'प्रोफ़ाइल' : 'Profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-sahayak-surface/95 backdrop-blur-md border-t border-sahayak-border py-1.5 px-3 flex items-center justify-around shadow-lg pb-[env(safe-area-inset-bottom)]">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;

        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center gap-0.5 transition-all min-h-touch justify-center ${
              isActive
                ? 'px-3.5 py-1 bg-sahayak-primary text-white font-extrabold rounded-full shadow-xs'
                : 'text-sahayak-inkSoft hover:text-sahayak-ink font-semibold text-xs'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-sahayak-inkSoft'}`} />
            <span className="text-[10px] uppercase tracking-wider">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
