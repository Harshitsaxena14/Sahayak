import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { NotificationCenter } from './NotificationCenter';
import { Landmark, MessageSquare, Search, ShieldCheck, User, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { t, language } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const citizenLinks = [
    { path: '/', label: t('nav.home') || 'Home', icon: Landmark },
    { path: '/assistant', label: language === 'hi' ? 'सहायक से पूछें' : 'Ask Sahayak', icon: MessageSquare },
    { path: '/track', label: t('nav.track') || 'Track Status', icon: Search },
    { path: '/profile', label: language === 'hi' ? 'प्रोफ़ाइल' : 'Profile', icon: User }
  ];

  return (
    <header className="sticky top-0 z-40 bg-sahayak-surface/95 backdrop-blur-md border-b border-sahayak-border shadow-xs h-[64px]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-full flex items-center justify-between gap-2 overflow-hidden">
        {/* Mobile Left: Hamburger Icon */}
        <div className="md:hidden flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-sahayak-ink hover:bg-sahayak-surfaceWarm rounded-xl min-h-touch min-w-touch flex items-center justify-center"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Center: SAHAYAK Text Logo */}
        <Link to="/" className="flex items-center gap-1.5 text-sahayak-ink focus:outline-none shrink-0">
          <span className="font-black text-lg sm:text-xl tracking-tight text-sahayak-ink uppercase truncate">
            SAHAYAK
          </span>
        </Link>

        {/* Desktop Citizen Navigation Links */}
        <div className="hidden md:flex items-center gap-2">
          <nav className="flex items-center gap-1" aria-label="Citizen Navigation">
            {citizenLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs font-extrabold rounded-full transition-all min-h-touch ${
                    isActive
                      ? 'bg-sahayak-primary text-white shadow-xs'
                      : 'text-sahayak-inkSoft hover:bg-sahayak-surfaceWarm hover:text-sahayak-ink'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right: Language Selector, Notification Center & Officer Link */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <NotificationCenter />
          <LanguageSelector />

          <Link
            to="/officer"
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-sahayak-ink hover:bg-sahayak-primary text-white text-xs font-bold rounded-full transition-all shadow-xs min-h-touch"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sahayak-primary" />
            <span>Officer</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-sahayak-surface border-b border-sahayak-border px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {citizenLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm ${
                  isActive ? 'bg-sahayak-surfaceWarm text-sahayak-primary border border-sahayak-border' : 'text-sahayak-ink hover:bg-sahayak-canvas'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-2 border-t border-sahayak-border">
            <Link
              to="/officer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-sahayak-ink hover:bg-sahayak-canvas"
            >
              <ShieldCheck className="w-5 h-5 text-sahayak-primary" />
              <span>Officer Portal</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
