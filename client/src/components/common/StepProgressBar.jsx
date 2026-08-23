import React from 'react';

export const StepProgressBar = ({ currentStep = 1, totalSteps = 6 }) => {
  const percentage = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="w-full space-y-1.5 max-w-xl mx-auto">
      <div className="flex items-center justify-between text-[11px] font-bold text-sahayak-inkSoft">
        <span>Step {currentStep} of {totalSteps}</span>
        <span>{Math.round(percentage)}% Completed</span>
      </div>
      <div className="w-full bg-sahayak-border h-2 rounded-full overflow-hidden">
        <div
          className="bg-sahayak-primary h-full transition-all duration-300 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
