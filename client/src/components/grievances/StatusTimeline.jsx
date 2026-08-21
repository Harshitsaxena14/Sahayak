import React from 'react';
import { CheckCircle2, Clock, MapPin, Building2, UserCheck, ShieldCheck } from 'lucide-react';

export const StatusTimeline = ({ ticket }) => {
  if (!ticket) return null;

  const humanSteps = [
    { key: 'Registered', label: 'Complaint received', detail: 'Successfully registered in system' },
    { key: 'Assigned', label: 'Sent to department', detail: `Assigned to ${ticket.department}` },
    { key: 'In Progress', label: 'Being worked on', detail: 'Action team dispatched' },
    { key: 'Resolved', label: 'Resolved', detail: 'Issue fixed & verified' }
  ];

  const currentIdx = humanSteps.findIndex(s => s.key === ticket.status);
  const activeIdx = currentIdx !== -1 ? currentIdx : 0;

  return (
    <div className="p-6 bg-white border border-gov-border rounded-3xl shadow-sm space-y-6 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-gov-accent uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-gov-accent" />
            <span>Complaint Reference ID</span>
          </div>
          <h3 className="text-2xl font-extrabold text-gov-navy font-mono tracking-tight">
            {ticket.ticketId}
          </h3>
          <p className="text-xs text-gov-subtle font-medium mt-0.5">
            Registered on: {new Date(ticket.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-gov-subtle block mb-1">Current Status</span>
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span>{ticket.status}</span>
          </span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
        <div>
          <span className="text-gov-subtle font-semibold flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-gov-primary" />
            <span>Department & Category</span>
          </span>
          <span className="font-bold text-gov-navy block mt-0.5">{ticket.category}</span>
          <span className="text-slate-500">{ticket.department}</span>
        </div>
        <div>
          <span className="text-gov-subtle font-semibold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-gov-primary" />
            <span>Location</span>
          </span>
          <span className="font-bold text-gov-navy block mt-0.5">{ticket.location}</span>
        </div>
        <div>
          <span className="text-gov-subtle font-semibold flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-gov-primary" />
            <span>Assigned Officer</span>
          </span>
          <span className="font-bold text-gov-navy block mt-0.5">{ticket.assignedOfficer || 'Unassigned'}</span>
        </div>
      </div>

      {/* Plain Language Human Journey */}
      <div>
        <h4 className="text-xs font-bold text-gov-subtle uppercase tracking-wider mb-4">
          Your Complaint Journey
        </h4>
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-emerald-600 transition-all duration-300 z-0"
            style={{ width: `${(activeIdx / (humanSteps.length - 1)) * 100}%` }}
          ></div>

          {humanSteps.map((step, idx) => {
            const isPassed = idx <= activeIdx;
            const isCurrent = idx === activeIdx;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isPassed
                      ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  }`}
                >
                  {isPassed ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>
                <span className={`text-xs font-extrabold mt-2 text-center whitespace-nowrap ${isCurrent ? 'text-gov-navy font-black' : isPassed ? 'text-emerald-800' : 'text-slate-400'}`}>
                  {step.label}
                </span>
                <span className="text-[10px] text-gov-subtle text-center max-w-[100px] hidden sm:block">
                  {step.detail}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Verification History Logs */}
      {ticket.history?.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold text-gov-subtle uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gov-accent" />
            <span>Official Update Trail</span>
          </h4>
          <div className="space-y-2">
            {ticket.history.map((h, i) => (
              <div key={i} className="flex items-start justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                <div>
                  <span className="font-bold text-gov-navy block">{h.status}</span>
                  <p className="text-slate-600 mt-0.5">{h.notes}</p>
                </div>
                <span className="text-[11px] text-gov-subtle shrink-0">
                  {new Date(h.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {ticket.resolutionNotes && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs space-y-1">
          <span className="font-bold text-emerald-950 block uppercase tracking-wider">Official Resolution Note</span>
          <p className="text-emerald-900 font-medium">{ticket.resolutionNotes}</p>
        </div>
      )}
    </div>
  );
};
