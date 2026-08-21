import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TicketCard = ({ ticket }) => {
  if (!ticket) return null;

  return (
    <div className="p-6 bg-emerald-50/80 border-2 border-emerald-300 rounded-2xl shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Official Complaint Registered
          </span>
          <h3 className="text-2xl font-black text-gov-navy font-mono">
            {ticket.ticketId}
          </h3>
        </div>
      </div>

      <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs space-y-1 text-gov-navy">
        <div className="flex justify-between">
          <span className="text-slate-500">Category:</span>
          <span className="font-bold">{ticket.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Department:</span>
          <span className="font-bold">{ticket.department}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Location:</span>
          <span className="font-bold">{ticket.location}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-2">
        <span className="text-[11px] font-semibold text-emerald-800 italic">
          Keep this Ticket ID for tracking
        </span>
        <Link
          to={`/track?ticket=${ticket.ticketId}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl transition-colors min-h-touch"
        >
          <span>Track Complaint Status</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
