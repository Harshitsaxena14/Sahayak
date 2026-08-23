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
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-sahayak-surfaceWarm border border-sahayak-border rounded-full text-xs font-bold text-sahayak-primary shadow-xs">
          <ShieldCheck className="w-4 h-4 text-sahayak-primary" />
          <span>{t('tracking.title') || "Track Status"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-sahayak-ink tracking-tight">{t('tracking.title') || "Track your status"}</h1>
        <p className="text-xs sm:text-sm text-sahayak-inkSoft max-w-lg mx-auto font-medium">
          {t('tracking.subtitle') || "Enter your reference ID (e.g. GRV-2026-894102 or APP-2026-XXXXXX)"}
        </p>
      </div>

      {/* Lookup Form */}
      <form onSubmit={handleSubmit} className="p-4 bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl shadow-sahayak-card max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
        <input
          type="text"
          value={idInput}
          onChange={(e) => setIdInput(e.target.value)}
          placeholder={t('tracking.inputPlaceholder') || "Enter Ticket / Application ID"}
          className="w-full sm:flex-1 px-4 py-3 bg-sahayak-canvas border border-sahayak-border rounded-full text-sm font-mono font-bold text-sahayak-ink focus:border-sahayak-primary focus:bg-white min-h-touch uppercase shadow-xs"
        />

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white font-extrabold text-xs rounded-full transition-all flex items-center justify-center gap-2 min-h-touch shrink-0 shadow-sahayak-float active:scale-97"
        >
          <Search className="w-4 h-4 text-white" />
          <span>{t('tracking.search') || "Track Status"}</span>
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

          <div className="p-6 bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl shadow-sahayak-card space-y-4">
            <h3 className="text-base font-black text-sahayak-ink border-b border-sahayak-border pb-2 flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-sahayak-success" />
              <span>{language === 'hi' ? 'आवेदन का विवरण' : 'Application Summary & Submitted Data'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(appData.details || appData.applicantData || {}).map(([key, val]) => (
                <div key={key} className="p-3 bg-sahayak-canvas border border-sahayak-border rounded-xl">
                  <span className="text-sahayak-inkMuted font-bold block uppercase text-[10px] tracking-wider">{key}</span>
                  <span className="font-extrabold text-sahayak-ink text-sm">{String(val)}</span>
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
