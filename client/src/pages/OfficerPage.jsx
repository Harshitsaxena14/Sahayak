import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { DashboardCard } from '../components/officer/DashboardCard';
import { DepartmentTable } from '../components/officer/DepartmentTable';
import { ErrorState } from '../components/common/ErrorState';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ShieldCheck, LogOut, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const OfficerPageContent = () => {
  const { t } = useLanguage();
  const [token, setToken] = useState(() => localStorage.getItem('sahayak_officer_token'));
  const [officerInfo, setOfficerInfo] = useState(() => {
    try {
      const saved = localStorage.getItem('sahayak_officer_info');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [username, setUsername] = useState('officer');
  const [password, setPassword] = useState('sahayak2026');
  const [loginError, setLoginError] = useState(null);

  const [grievances, setGrievances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await apiClient.officerLogin({ username, password });
      if (res.token) {
        setToken(res.token);
        const info = { name: res.officerName || 'Ramesh Sharma (EE)' };
        setOfficerInfo(info);
        localStorage.setItem('sahayak_officer_token', res.token);
        localStorage.setItem('sahayak_officer_info', JSON.stringify(info));
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials');
    }
  };

  const handleLogout = () => {
    setToken(null);
    setOfficerInfo(null);
    localStorage.removeItem('sahayak_officer_token');
    localStorage.removeItem('sahayak_officer_info');
  };

  const fetchGrievances = async () => {
    if (!token) return;
    setIsLoading(true);
    setFetchError(null);
    try {
      const data = await apiClient.getOfficerGrievances(token);
      setGrievances(data.grievances || []);
    } catch (err) {
      setFetchError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGrievances();
    }
  }, [token]);

  const handleUpdateStatus = async (ticketId, payload) => {
    try {
      await apiClient.updateGrievanceStatus(ticketId, payload, token);
      fetchGrievances();
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    }
  };

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center animate-in fade-in duration-200">
        <div className="p-6 sm:p-8 bg-sahayak-surface border border-sahayak-border rounded-3xl shadow-sahayak-card space-y-6 text-left">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-sahayak-ink text-sahayak-primary flex items-center justify-center font-bold text-xl mx-auto shadow-xs">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-black text-sahayak-ink">{t('officer.loginTitle')}</h1>
            <p className="text-xs text-sahayak-inkSoft font-medium">
              {t('officer.subtitle')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-sahayak-ink block mb-1">{t('officer.username')}</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-sahayak-canvas border border-sahayak-border rounded-xl text-xs font-bold text-sahayak-ink focus:outline-none focus:border-sahayak-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-sahayak-ink block mb-1">{t('officer.password')}</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-sahayak-canvas border border-sahayak-border rounded-xl text-xs font-bold text-sahayak-ink focus:outline-none focus:border-sahayak-primary"
              />
            </div>

            {loginError && (
              <div className="p-3 bg-sahayak-errorBg border border-red-200 rounded-xl text-xs text-sahayak-error font-medium">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white font-extrabold text-xs rounded-xl transition-all min-h-touch shadow-sahayak-float active:scale-97"
            >
              {t('officer.loginBtn')}
            </button>
          </form>

          <p className="text-[11px] text-sahayak-inkMuted text-center italic border-t border-sahayak-border pt-4">
            {t('officer.demoCreds')}
          </p>
        </div>
      </div>
    );
  }

  const total = grievances.length;
  const pending = grievances.filter(g => g.status === 'Registered' || g.status === 'Assigned').length;
  const inProgress = grievances.filter(g => g.status === 'In Progress').length;
  const resolved = grievances.filter(g => g.status === 'Resolved').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6 animate-in fade-in duration-200 text-left">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-sahayak-border pb-4">
        <div>
          <span className="text-[10px] font-extrabold bg-sahayak-ink text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            OFFICER PORTAL
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-sahayak-ink mt-1">{t('officer.title')}</h1>
          <p className="text-xs text-sahayak-inkSoft font-medium">{t('officer.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-extrabold text-sahayak-ink block">{officerInfo?.name || 'Officer'}</span>
            <span className="text-[10px] text-sahayak-inkSoft font-bold block">Executive Engineer</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-sahayak-error bg-sahayak-errorBg hover:bg-red-100 rounded-xl transition-colors min-h-touch min-w-touch flex items-center justify-center"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <DashboardCard title={t('officer.totalGrievances')} count={total} color="blue" icon={ShieldCheck} />
        <DashboardCard title={t('officer.pendingReview')} count={pending} color="amber" icon={AlertCircle} />
        <DashboardCard title={t('officer.inProgress')} count={inProgress} color="blue" icon={Clock} />
        <DashboardCard title={t('officer.resolved')} count={resolved} color="emerald" icon={CheckCircle2} />
      </div>

      {/* Grievances List Table */}
      {isLoading ? (
        <LoadingState message="Fetching assigned department grievances..." />
      ) : fetchError ? (
        <ErrorState error={fetchError} onRetry={fetchGrievances} />
      ) : (
        <DepartmentTable grievances={grievances} onUpdateStatus={handleUpdateStatus} />
      )}
    </div>
  );
};

export const OfficerPage = () => (
  <ErrorBoundary>
    <OfficerPageContent />
  </ErrorBoundary>
);
