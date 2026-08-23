import React from 'react';

export const DashboardCard = ({ title, count, icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-sahayak-surface border-sahayak-border text-sahayak-ink shadow-sahayak-card',
    amber: 'bg-sahayak-surface border-amber-200 text-sahayak-ink shadow-sahayak-card',
    emerald: 'bg-sahayak-surface border-emerald-200 text-sahayak-ink shadow-sahayak-card',
    red: 'bg-sahayak-surface border-red-200 text-sahayak-ink shadow-sahayak-card'
  };

  const iconBgMap = {
    blue: 'bg-sahayak-surfaceWarm text-sahayak-primary',
    amber: 'bg-sahayak-warningBg text-sahayak-warning',
    emerald: 'bg-sahayak-successBg text-sahayak-success',
    red: 'bg-sahayak-errorBg text-sahayak-error'
  };

  return (
    <div className={`p-5 rounded-2xl sm:rounded-3xl border transition-all flex items-center justify-between ${colorMap[color] || colorMap.blue}`}>
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider block text-sahayak-inkMuted mb-1">{title}</span>
        <span className="text-2xl sm:text-3xl font-extrabold text-sahayak-ink">{count}</span>
      </div>
      {Icon && (
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shrink-0 ${iconBgMap[color] || iconBgMap.blue}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};
