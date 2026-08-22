import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Landmark, Compass, FileText, User } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const MobileBottomNav = () => {
  const { t } = useLanguage();
  const location = useLocation();

  const links = [
    { path: '/', label: 'Home', icon: Landmark },
    { path: '/assistant', label: 'Explore', icon: Compass },
    { path: '/track', label: 'Status', icon: FileText },
    { path: '/officer', label: 'Profile', icon: User }
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-2 px-4 flex items-center justify-around shadow-lg">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.path;

        return (
          <Link
            key={link.path}
            to={link.path}
            className={`flex flex-col items-center gap-1 transition-all min-h-touch justify-center ${
              isActive
                ? 'px-4 py-1.5 bg-stitch-accent text-white font-extrabold rounded-full shadow-2xs'
                : 'text-slate-500 hover:text-stitch-navy font-semibold text-xs'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
            <span className="text-[10px] uppercase tracking-wider">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
};
