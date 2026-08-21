import React from 'react';

export const DashboardCard = ({ title, count, icon: Icon, color = 'blue' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-800 border-blue-200',
    amber: 'bg-amber-50 text-amber-800 border-amber-200',
    emerald: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    red: 'bg-red-50 text-red-800 border-red-200'
  };

  return (
    <div className={`p-5 rounded-2xl border ${colorMap[color] || colorMap.blue} flex items-center justify-between shadow-xs`}>
      <div>
        <span className="text-xs font-bold uppercase tracking-wider block opacity-80 mb-1">{title}</span>
        <span className="text-3xl font-extrabold">{count}</span>
      </div>
      <div className="p-3 bg-white rounded-xl shadow-xs">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
