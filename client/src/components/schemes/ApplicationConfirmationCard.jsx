import React from 'react';
import { CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ApplicationConfirmationCard = ({ application }) => {
  if (!application) return null;

  return (
    <div className="p-6 bg-emerald-50/90 border-2 border-emerald-400 rounded-3xl shadow-sm space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xl shadow-md shrink-0">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
            Scheme Application Submitted
          </span>
          <h3 className="text-2xl font-black text-gov-navy font-mono">
            {application.applicationId}
          </h3>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-emerald-200 text-xs space-y-2 text-gov-navy shadow-2xs">
        <div className="flex justify-between border-b border-slate-100 pb-1.5">
          <span className="text-slate-500 font-semibold">Scheme Name:</span>
          <span className="font-extrabold">{application.schemeName}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-1.5">
          <span className="text-slate-500 font-semibold">Submission Status:</span>
          <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">{application.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 font-semibold">Submitted On:</span>
          <span className="font-medium">{new Date(application.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Prototype Disclaimer Banner */}
      <div className="bg-amber-100/70 border border-amber-300 text-amber-950 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0" />
        <span>Demo/Prototype Submission · Simulated government integration</span>
      </div>

      <div className="flex items-center justify-between gap-3 pt-1">
        <span className="text-[11px] font-semibold text-emerald-800 italic">
          Keep this Application ID for tracking inside Sahayak
        </span>
        <Link
          to={`/track?appId=${application.applicationId}`}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-sm min-h-touch"
        >
          <span>Track Application</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
