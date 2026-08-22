import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { Landmark, MessageSquare, Search, ShieldCheck, Menu, X } from 'lucide-react';

export const Navbar = () => {
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const citizenLinks = [
    { path: '/', label: t('nav.home'), icon: Landmark },
    { path: '/assistant', label: 'Ask Sahayak', icon: MessageSquare },
    { path: '/track', label: t('nav.track'), icon: Search }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs h-[64px]">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 h-full flex items-center justify-between gap-2 overflow-hidden">
        {/* Mobile Left: Hamburger Icon */}
        <div className="md:hidden flex items-center shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 text-stitch-navy hover:bg-slate-100 rounded-xl min-h-[40px] min-w-[40px] flex items-center justify-center"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Center: SAHAYAK Text Logo */}
        <Link to="/" className="flex items-center gap-1.5 text-stitch-navy focus:outline-none shrink-0">
          <span className="font-black text-lg sm:text-xl tracking-tight text-stitch-navy uppercase truncate">
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
                      ? 'bg-stitch-accent text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-stitch-navy'
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

        {/* Right: Language Selector & Officer Link */}
        <div className="flex items-center gap-1.5 shrink-0">
          <LanguageSelector />

          <Link
            to="/officer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-stitch-navy hover:bg-stitch-navyLight text-white text-xs font-bold rounded-full transition-all shadow-2xs"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-stitch-accent" />
            <span>Officer</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {citizenLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm ${
                  isActive ? 'bg-amber-50 text-stitch-accent border border-amber-200' : 'text-stitch-navy hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
