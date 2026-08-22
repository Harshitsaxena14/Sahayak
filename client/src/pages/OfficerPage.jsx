import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { DepartmentTable } from '../components/officer/DepartmentTable';
import { DashboardCard } from '../components/officer/DashboardCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { ShieldCheck, LogOut, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';

const OfficerPageContent = () => {
  const { t, language } = useLanguage();

  const [token, setToken] = useState(localStorage.getItem('sahayak_officer_token') || '');
  const [officerInfo, setOfficerInfo] = useState(JSON.parse(localStorage.getItem('sahayak_officer_info') || 'null'));

  // Login form state
  const [username, setUsername] = useState('officer');
  const [password, setPassword] = useState('sahayak2026');
  const [loginError, setLoginError] = useState('');

  // Dashboard Data State
  const [grievances, setGrievances] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchGrievances = async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiClient.getOfficerGrievances(token);
      setGrievances(data.grievances || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchGrievances();
    }
  }, [token]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const res = await apiClient.officerLogin({ username, password });
      if (res.token) {
        setToken(res.token);
        setOfficerInfo(res.officer);
        localStorage.setItem('sahayak_officer_token', res.token);
        localStorage.setItem('sahayak_officer_info', JSON.stringify(res.officer));
      }
    } catch (err) {
      setLoginError(err.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    setToken('');
    setOfficerInfo(null);
    localStorage.removeItem('sahayak_officer_token');
    localStorage.removeItem('sahayak_officer_info');
  };

  const handleUpdateStatus = async (ticketId, payload) => {
    try {
      await apiClient.updateGrievanceStatus(ticketId, payload, token);
      await fetchGrievances();
    } catch (err) {
      alert(`Update Error: ${err.message}`);
    }
  };

  const totalCount = grievances.length;
  const registeredCount = grievances.filter(g => g.status === 'Registered').length;
  const inProgressCount = grievances.filter(g => g.status === 'In Progress' || g.status === 'Assigned').length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 sm:py-12 animate-in fade-in duration-200">
        <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card space-y-6 text-left">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-stitch-navy text-stitch-accent flex items-center justify-center font-bold text-xl mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-stitch-navy">{t('officer.loginTitle')}</h1>
            <p className="text-xs font-semibold text-amber-950 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
              {t('officer.demoCreds')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-stitch-navy block mb-1">{t('officer.username')}</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-stitch-navy block mb-1">{t('officer.password')}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>

            {loginError && (
              <p className="text-xs font-semibold text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-stitch-navy hover:bg-stitch-navyLight text-white font-extrabold text-xs rounded-xl transition-all min-h-touch"
            >
              {t('officer.loginBtn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 animate-in fade-in duration-200 text-left">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold bg-stitch-navy text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {t('nav.officer')}
            </span>
            <span className="text-xs font-semibold text-stitch-subtle truncate max-w-[180px] sm:max-w-none">
              {officerInfo?.department}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-stitch-navy mt-1">{t('officer.title')}</h1>
          <p className="text-xs text-stitch-subtle font-medium">{t('officer.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="font-extrabold text-stitch-navy block">{officerInfo?.name || 'Officer'}</span>
            <span className="text-slate-500 font-medium">{officerInfo?.designation || 'Nodal Officer'}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center border border-slate-200"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <DashboardCard title={t('officer.totalGrievances')} count={totalCount} icon={FileText} color="blue" />
        <DashboardCard title={t('officer.pendingReview')} count={registeredCount} icon={AlertCircle} color="red" />
        <DashboardCard title={t('officer.inProgress')} count={inProgressCount} icon={Clock} color="amber" />
        <DashboardCard title={t('officer.resolved')} count={resolvedCount} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Department Grievance Table / Cards */}
      {isLoading ? (
        <LoadingState message="Loading department grievance registry..." />
      ) : error ? (
        <ErrorState title="Failed to Load Dashboard" message={error} onRetry={fetchGrievances} />
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
