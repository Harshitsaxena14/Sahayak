import React from 'react';
import { FileCheck } from 'lucide-react';

export const DocumentChecklist = ({ documents = [] }) => {
  if (!documents.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-gov-subtle uppercase tracking-wider flex items-center gap-1.5">
        <FileCheck className="w-4 h-4 text-gov-accent" />
        <span>Required Documents Checklist</span>
      </h4>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {documents.map((doc, idx) => (
          <li key={idx} className="flex items-center gap-2 text-xs font-medium text-gov-navy bg-white border border-slate-200 px-3 py-2 rounded-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-gov-accent"></span>
            <span>{doc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
