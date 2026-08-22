import React from 'react';

export const StepProgressBar = ({ currentStep = 2, totalSteps = 6 }) => {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full space-y-1 my-2">
      <div className="flex items-center justify-between text-[11px] font-bold text-stitch-subtle">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{currentStep} / {totalSteps}</span>
      </div>
      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};
