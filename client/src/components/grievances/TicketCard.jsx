import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

export const TicketCard = ({ ticket }) => {
  const { t, language } = useLanguage();
  if (!ticket) return null;

  return (
    <div className="p-5 sm:p-6 bg-sahayak-successBg border-2 border-emerald-300 rounded-2xl sm:rounded-3xl shadow-xs space-y-4 text-left animate-in fade-in duration-200">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-sahayak-success text-white flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
          <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>
        <div>
          <span className="text-xs font-bold text-sahayak-success uppercase tracking-wider block">
            {t('grievance.ticketCreated') || "Official Complaint Registered"}
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-sahayak-ink font-mono">
            {ticket.ticketId}
          </h3>
        </div>
      </div>

      <div className="p-3.5 bg-sahayak-surface rounded-xl border border-emerald-200 text-xs space-y-1.5 text-sahayak-ink shadow-xs">
        <div className="flex justify-between">
          <span className="text-sahayak-inkMuted font-medium">{t('grievance.category') || "Category"}:</span>
          <span className="font-bold">{ticket.category}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sahayak-inkMuted font-medium">Department:</span>
          <span className="font-bold">{ticket.department}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-sahayak-inkMuted font-medium">{t('grievance.location') || "Location"}:</span>
          <span className="font-bold">{ticket.location}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <span className="text-[11px] font-semibold text-sahayak-success italic">
          {language === 'hi' ? "ट्रैकिंग के लिए यह टिकट आईडी सुरक्षित रखें" : "Keep this Ticket ID for tracking inside Sahayak"}
        </span>
        <Link
          to={`/track?ticket=${ticket.ticketId}`}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-sahayak-success hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl transition-colors min-h-touch active:scale-97"
        >
          <span>{t('tracking.search') || "Track Complaint Status"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
