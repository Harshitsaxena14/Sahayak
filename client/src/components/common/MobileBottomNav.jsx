import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, MessageSquare, Search } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MobileBottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const links = [
    { path: '/', label: t('nav.home'), icon: Landmark },
    { path: '/assistant', label: 'Ask Sahayak', icon: MessageSquare, isPrimary: true },
    { path: '/track', label: t('nav.track'), icon: Search }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gov-border shadow-lg py-2 px-4 flex items-center justify-around">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;

        if (link.isPrimary) {
          return (
            <Link
              key={link.path}
              to={link.path}
              className="flex flex-col items-center justify-center -mt-6 bg-gov-navy text-gov-accent w-14 h-14 rounded-full shadow-lg border-4 border-white transition-transform active:scale-95"
              aria-label={link.label}
            >
              <Icon className="w-6 h-6 text-gov-accent" />
            </Link>
          );
        }

        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center gap-1 min-h-touch justify-center text-xs font-bold transition-colors ${
              isActive ? 'text-gov-primary' : 'text-slate-500 hover:text-gov-navy'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
