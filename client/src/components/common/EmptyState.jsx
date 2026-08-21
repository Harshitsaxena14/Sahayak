import React from 'react';
import { Inbox } from 'lucide-react';

export const EmptyState = ({ title = 'No records found', description = 'Try adjusting your search criteria or query.' }) => (
  <div className="flex flex-col items-center justify-center p-10 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
      <Inbox className="w-6 h-6" />
    </div>
    <h3 className="text-base font-bold text-gov-navy mb-1">{title}</h3>
    <p className="text-sm text-gov-subtle max-w-sm">{description}</p>
  </div>
);
