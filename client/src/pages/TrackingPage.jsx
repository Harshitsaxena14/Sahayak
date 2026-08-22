import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { StatusTimeline } from '../components/grievances/StatusTimeline';
import { ApplicationConfirmationCard } from '../components/schemes/ApplicationConfirmationCard';
import { SkeletonCard } from '../components/common/SkeletonCard';
import { EmptyState } from '../components/common/EmptyState';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { Search, ShieldCheck, FileCheck } from 'lucide-react';

const TrackingPageContent = () => {
  const { t, language } = useLanguage();
  const [searchParams] = useSearchParams();

  const initialSearchId = searchParams.get('appId') || searchParams.get('ticket') || 'GRV-2026-894102';
  const [idInput, setIdInput] = useState(initialSearchId);
  const [ticketData, setTicketData] = useState(null);
  const [appData, setAppData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStatus = async (searchId) => {
    const idToSearch = (searchId || idInput).trim().toUpperCase();
    if (!idToSearch) return;

    setIsLoading(true);
    setError(null);
    setTicketData(null);
    setAppData(null);

    if (idToSearch.startsWith('APP-')) {
      try {
        const data = await apiClient.trackApplication(idToSearch);
        setAppData(data);
      } catch (err) {
        setError(language === 'hi'
          ? 'इस आवेदन आईडी के साथ कोई रिकॉर्ड नहीं मिला।'
          : 'No scheme application record found matching that Application ID.');
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const data = await apiClient.trackTicket(idToSearch);
        setTicketData(data);
      } catch (err) {
        setError(language === 'hi'
          ? 'इस शिकायत टिकट आईडी के साथ कोई रिकॉर्ड नहीं मिला।'
          : 'No grievance ticket record found matching that Ticket ID.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    const appId = searchParams.get('appId');
    const ticket = searchParams.get('ticket');
    if (appId) {
      setIdInput(appId);
      fetchStatus(appId);
    } else if (ticket) {
      setIdInput(ticket);
      fetchStatus(ticket);
    } else {
      fetchStatus('GRV-2026-894102');
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchStatus();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-in fade-in duration-200 text-left">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-50 border border-amber-200/80 rounded-full text-xs font-bold text-amber-900 shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>{t('tracking.title')}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stitch-navy tracking-tight">{t('tracking.title')}</h1>
        <p className="text-xs sm:text-sm text-stitch-subtle max-w-lg mx-auto font-medium">
          {t('tracking.subtitle')}
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          placeholder={t('tracking.inputPlaceholder')}
          className="w-full sm:flex-1 px-4 py-3 bg-slate-50 border border-slate-300 rounded-full text-sm font-mono font-bold text-stitch-navy focus:border-stitch-accent focus:bg-white min-h-touch uppercase shadow-2xs"
        />

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-stitch-navy hover:bg-stitch-navyLight text-white font-extrabold text-xs rounded-full transition-all flex items-center justify-center gap-2 min-h-touch shrink-0 shadow-2xs"
        >
          <Search className="w-4 h-4 text-amber-400" />
          <span>{t('tracking.search')}</span>
        </button>
      </form>

      {/* Status Results */}
      {isLoading && (
        <div className="max-w-3xl mx-auto space-y-3">
          <SkeletonCard />
        </div>
      )}

      {error && !isLoading && (
        <EmptyState
          title={language === 'hi' ? 'रिकॉर्ड नहीं मिला' : 'Record Not Found'}
          message={error}
          onAction={() => fetchStatus()}
          actionLabel={language === 'hi' ? 'पुनः प्रयास करें' : 'Retry Lookup'}
        />
      )}

      {ticketData && !isLoading && (
        <div className="max-w-3xl mx-auto">
          <StatusTimeline ticket={ticketData} />
        </div>
      )}

      {appData && !isLoading && (
        <div className="max-w-3xl mx-auto space-y-4">
          <ApplicationConfirmationCard application={appData} />

          <div className="p-6 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card space-y-4">
            <h3 className="text-base font-black text-stitch-navy border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-emerald-600" />
              <span>{language === 'hi' ? 'आवेदन का विवरण' : 'Application Summary & Submitted Data'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(appData.applicantData || {}).map(([key, val]) => (
                <div key={key} className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl">
                  <span className="text-stitch-subtle font-bold block uppercase text-[10px] tracking-wider">{key}</span>
                  <span className="font-extrabold text-stitch-navy text-sm">{String(val)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const TrackingPage = () => (
  <ErrorBoundary>
    <TrackingPageContent />
  </ErrorBoundary>
);
