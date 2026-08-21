import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Landmark, MessageSquare, Search, ShieldCheck } from 'lucide-react';

export const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const citizenLinks = [
    { path: '/', label: t('nav.home'), icon: Landmark },
    { path: '/assistant', label: 'Ask Sahayak', icon: MessageSquare },
    { path: '/track', label: t('nav.track'), icon: Search }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gov-border shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand & Logo */}
        <Link to="/" className="flex items-center gap-3 text-gov-navy focus:outline-none rounded-lg">
          <div className="w-10 h-10 rounded-xl bg-gov-navy text-gov-accent flex items-center justify-center font-bold text-xl shadow-md">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-gov-navy">{t('nav.title')}</span>
              <span className="text-[11px] bg-amber-100 text-gov-accentDark font-bold px-2 py-0.5 rounded-full border border-amber-200">
                Demo Mode
              </span>
            </div>
            <p className="text-xs text-gov-subtle font-medium hidden sm:block">
              Multilingual Voice & AI Citizen Assistant
            </p>
          </div>
        </Link>

        {/* Citizen Navigation Links */}
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="hidden md:flex items-center gap-1" aria-label="Citizen Navigation">
            {citizenLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-colors min-h-touch ${
                    isActive
                      ? 'bg-slate-100 text-gov-primary border border-slate-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-gov-navy'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          <LanguageSelector />

          {/* Visually Separated Officer Portal Button */}
          <Link
            to="/officer"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gov-navy hover:bg-gov-primary text-white text-xs font-bold rounded-xl transition-colors min-h-touch shadow-2xs ml-1"
          >
            <ShieldCheck className="w-4 h-4 text-gov-accent" />
            <span className="hidden sm:inline">Officer Portal</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
