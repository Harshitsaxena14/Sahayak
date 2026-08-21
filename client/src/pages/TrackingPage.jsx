import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { StatusTimeline } from '../components/grievances/StatusTimeline';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { Search, ShieldCheck } from 'lucide-react';

export const TrackingPage = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [ticketIdInput, setTicketIdInput] = useState(searchParams.get('ticket') || 'GRV-2026-894102');
  const [ticketData, setTicketData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTicket = async (searchId) => {
    const idToSearch = searchId || ticketIdInput;
    if (!idToSearch) return;

    setIsLoading(true);
    setError(null);

    try {
      const data = await apiClient.trackTicket(idToSearch);
      setTicketData(data);
    } catch (err) {
      setTicketData(null);
      setError(err.message || 'No grievance record found with that Ticket ID.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchParams.get('ticket')) {
      fetchTicket(searchParams.get('ticket'));
    } else {
      // Load default demo ticket for quick inspection
      fetchTicket('GRV-2026-894102');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTicket();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs font-bold text-gov-primary">
          <ShieldCheck className="w-4 h-4 text-gov-accent" />
          <span>Official Public Grievance Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gov-navy">{t('tracking.title')}</h1>
        <p className="text-sm text-gov-subtle max-w-lg mx-auto">{t('tracking.subtitle')}</p>
      </div>

      {/* Ticket Lookup Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border border-gov-border rounded-2xl shadow-xs max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={ticketIdInput}
          onChange={(e) => setTicketIdInput(e.target.value)}
          placeholder={t('tracking.inputPlaceholder')}
          className="w-full sm:flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold text-gov-navy focus:border-gov-navy min-h-touch uppercase"
        />

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-gov-navy hover:bg-gov-primary text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 min-h-touch shrink-0"
        >
          <Search className="w-4 h-4" />
          <span>{t('tracking.search')}</span>
        </button>
      </form>

      {/* Results / Status Timeline */}
      {isLoading && <LoadingState message="Fetching official grievance audit trail..." />}

      {error && (
        <div className="max-w-2xl mx-auto">
          <ErrorState title="Ticket Not Found" message={error} onRetry={() => fetchTicket()} />
        </div>
      )}

      {ticketData && !isLoading && (
        <div className="max-w-3xl mx-auto">
          <StatusTimeline ticket={ticketData} />
        </div>
      )}
    </div>
  );
};
