import React from 'react';
import { Check, Clock, AlertCircle, CheckCircle2, CircleDashed } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const StatusTimeline = ({ ticket }) => {
  const { t } = useLanguage();

  if (!ticket) return null;

  const currentStatus = ticket.status || 'Registered';
  const history = (ticket.history && ticket.history.length > 0)
    ? ticket.history
    : [
        {
          status: 'Registered',
          notes: ticket.description || 'Request recorded in SAHAYAK system',
          updatedAt: ticket.createdAt || new Date().toISOString(),
          updatedBy: 'System'
        }
      ];

  const formatTime = (isoString) => {
    if (!isoString) return '';
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).toUpperCase();
    } catch (e) {
      return String(isoString);
    }
  };

  const statusOrder = ['Registered', 'Assigned', 'In Progress', 'Resolved'];

  const getStepState = (historyStatus) => {
    const itemIdx = statusOrder.indexOf(historyStatus);
    const currentIdx = statusOrder.indexOf(currentStatus);

    if (itemIdx < currentIdx || (historyStatus === 'Resolved' && currentStatus === 'Resolved')) {
      return 'completed';
    }
    if (historyStatus === currentStatus) {
      return 'current';
    }
    return 'pending';
  };

  return (
    <div className="p-5 sm:p-6 bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl shadow-sahayak-card text-left space-y-5 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-mono font-bold text-sahayak-primary uppercase tracking-wider">
            {ticket.ticketId || ticket.applicationId || 'GRV-2026'}
          </span>
          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
            currentStatus === 'Resolved' ? 'bg-sahayak-successBg text-sahayak-success border border-emerald-200' :
            currentStatus === 'In Progress' ? 'bg-sahayak-warningBg text-sahayak-warning border border-amber-200' :
            'bg-sahayak-surfaceViolet text-sahayak-intelligence border border-purple-200'
          }`}>
            {currentStatus}
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-sahayak-ink tracking-tight">
          {ticket.category || ticket.schemeName || t('tracking.title') || 'Track Status'}
        </h2>
        {ticket.location && (
          <p className="text-xs text-sahayak-inkSoft mt-0.5">{ticket.location}</p>
        )}
      </div>

      {/* Dynamic History Timeline */}
      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-sahayak-border">
        {history.map((step, idx) => {
          const stepState = getStepState(step.status);
          const isCurrent = stepState === 'current';
          const isCompleted = stepState === 'completed';

          return (
            <div key={idx} className="relative flex items-start gap-4">
              {/* Indicator Circle */}
              {isCompleted ? (
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-sahayak-success text-white flex items-center justify-center font-bold text-xs shrink-0 z-10">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              ) : isCurrent ? (
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-sahayak-primary/20 border-4 border-sahayak-primary flex items-center justify-center shrink-0 z-10" />
              ) : (
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-sahayak-border flex items-center justify-center shrink-0 z-10" />
              )}

              {/* Step Content */}
              <div className={`flex-1 ${isCurrent ? 'p-4 bg-sahayak-surfaceWarm border border-sahayak-border rounded-2xl shadow-xs' : ''}`}>
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-extrabold ${isCurrent ? 'text-sahayak-primary' : isCompleted ? 'text-sahayak-ink' : 'text-sahayak-inkMuted'}`}>
                    {step.status}
                  </h4>
                  {step.updatedBy && (
                    <span className="text-[10px] text-sahayak-inkSoft font-medium">
                      by {step.updatedBy}
                    </span>
                  )}
                </div>

                <p className={`text-xs mt-1 leading-relaxed ${isCurrent ? 'text-sahayak-ink font-medium' : isCompleted ? 'text-sahayak-inkSoft' : 'text-sahayak-inkMuted'}`}>
                  {step.notes || 'Status update recorded'}
                </p>

                {step.updatedAt && (
                  <span className="text-[10px] font-mono font-bold text-sahayak-inkMuted block mt-1.5 uppercase">
                    {formatTime(step.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {ticket.resolutionNotes && (
        <div className="p-3 bg-sahayak-successBg border border-emerald-200 rounded-xl text-xs text-sahayak-success font-medium">
          <span className="font-bold block mb-0.5">Resolution Notes:</span>
          {ticket.resolutionNotes}
        </div>
      )}
    </div>
  );
};
