import React from 'react';

export const DashboardCard = ({ title, count, icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-white border-slate-200/90 text-gov-navy shadow-civic',
    amber: 'bg-white border-amber-200/90 text-gov-navy shadow-civic',
    emerald: 'bg-white border-emerald-200/90 text-gov-navy shadow-civic',
    red: 'bg-white border-red-200/90 text-gov-navy shadow-civic'
  };

  const iconBgMap = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    red: 'bg-red-50 text-red-700 border-red-200'
  };

  return (
    <div className={`p-5 rounded-3xl border ${colorMap[color] || colorMap.blue} flex items-center justify-between transition-all hover:shadow-civic-hover`}>
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider block text-gov-subtle mb-1">{title}</span>
        <span className="text-3xl font-extrabold text-gov-navy">{count}</span>
      </div>
      <div className={`p-3 rounded-2xl border ${iconBgMap[color] || iconBgMap.blue} shadow-2xs`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  );
};
