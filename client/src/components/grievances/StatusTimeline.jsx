import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';

export const StatusTimeline = ({ ticket }) => {
  const isResolved = ticket.status === 'Resolved';
  const isInProgress = ticket.status === 'In Progress' || ticket.status === 'Assigned';

  const history = ticket.history || [
    { status: 'Submitted', notes: 'Application successfully recorded in the system.', updatedAt: ticket.createdAt || new Date('2026-10-12') },
    { status: 'Assigned', notes: 'Officer R. Sharma assigned for preliminary review.', updatedAt: new Date('2026-10-14') },
    { status: 'In Progress', notes: 'Document verification ongoing. Additional address proof might be required.', updatedAt: new Date('2026-10-15') },
    { status: 'Resolved', notes: 'Final decision pending.', updatedAt: new Date() }
  ];

  return (
    <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card text-left space-y-6 animate-in fade-in duration-200">
      {/* Reference Subhead & Title (Matching Stitch Screenshots 3 & 5) */}
      <div>
        <span className="text-[11px] font-mono font-bold text-stitch-accent uppercase tracking-wider block mb-1">
          {ticket.ticketId || ticket.applicationId || 'APP-8492-MK'}
        </span>
        <h2 className="text-2xl font-black text-stitch-navy tracking-tight">
          Track your status
        </h2>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {/* Step 1: Submitted (Completed) */}
        <div className="relative flex items-start gap-4">
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0 z-10">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-stitch-navy">Submitted</h4>
            <p className="text-xs text-stitch-subtle mt-0.5 font-medium">
              Application successfully recorded in the system.
            </p>
            <span className="text-[10px] font-mono font-bold text-slate-400 block mt-1 uppercase">
              OCT 12, 09:41 AM
            </span>
          </div>
        </div>

        {/* Step 2: Assigned (Completed / Active) */}
        <div className="relative flex items-start gap-4">
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0 z-10">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-stitch-navy">Assigned</h4>
            <p className="text-xs text-stitch-subtle mt-0.5 font-medium">
              Officer assigned for preliminary review.
            </p>
            <span className="text-[10px] font-mono font-bold text-slate-400 block mt-1 uppercase">
              OCT 14, 02:15 PM
            </span>
          </div>
        </div>

        {/* Step 3: In Progress (Active Highlighted Card - Screenshot 3 & 5) */}
        <div className="relative flex items-start gap-4">
          <div className="absolute -left-6 top-2 w-5 h-5 rounded-full bg-amber-500/30 border-4 border-amber-600 flex items-center justify-center shrink-0 z-10"></div>
          <div className="flex-1 p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-stitch-navy">In Progress</h4>
              <span className="text-[10px] font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
                IN PROGRESS
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              {ticket.resolutionNotes || "Document verification ongoing. Additional inspection or address proof might be required."}
            </p>
            <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-100 uppercase">
              <AlertCircle className="w-3 h-3 text-slate-400" />
              <span>AWAITING SYSTEM UPDATE · OCT 15, 10:05 AM (LAST UPDATE)</span>
            </div>
          </div>
        </div>

        {/* Step 4: Resolved (Pending) */}
        <div className="relative flex items-start gap-4 opacity-50">
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center shrink-0 z-10"></div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-400">Resolved</h4>
            <p className="text-xs text-slate-400 mt-0.5">Final decision pending.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
