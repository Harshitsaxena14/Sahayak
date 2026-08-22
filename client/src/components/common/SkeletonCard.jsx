import React from 'react';

export const SkeletonCard = () => {
  return (
    <div className="p-5 bg-white border border-slate-200/90 rounded-2xl shadow-2xs space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="w-1/3 h-4 skeleton-shimmer rounded-md"></div>
        <div className="w-24 h-6 skeleton-shimmer rounded-full"></div>
      </div>
      <div className="w-2/3 h-5 skeleton-shimmer rounded-md"></div>
      <div className="w-full h-12 skeleton-shimmer rounded-xl"></div>
      <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100">
        <div className="w-20 h-4 skeleton-shimmer rounded-md"></div>
        <div className="w-32 h-8 skeleton-shimmer rounded-xl"></div>
      </div>
    </div>
  );
};
