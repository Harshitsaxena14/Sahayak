import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { apiClient } from '../services/apiClient';
import { DepartmentTable } from '../components/officer/DepartmentTable';
import { DashboardCard } from '../components/officer/DashboardCard';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { ShieldCheck, LogOut, CheckCircle2, Clock, AlertCircle, FileText } from 'lucide-react';

export const OfficerPage = () => {
  const { t } = useLanguage();

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

  // Metrics counts
  const totalCount = grievances.length;
  const registeredCount = grievances.filter(g => g.status === 'Registered').length;
  const inProgressCount = grievances.filter(g => g.status === 'In Progress' || g.status === 'Assigned').length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;

  if (!token) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 animate-in fade-in duration-200">
        <div className="p-8 bg-white border border-gov-border rounded-3xl shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-gov-navy text-gov-accent flex items-center justify-center font-bold text-xl mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-gov-navy">{t('officer.loginTitle')}</h1>
            <p className="text-xs font-semibold text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
              {t('officer.demoCreds')}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gov-navy block mb-1">{t('officer.username')}</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gov-navy block mb-1">{t('officer.password')}</label>
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
              className="w-full py-3 bg-gov-navy hover:bg-gov-primary text-white font-bold text-sm rounded-xl transition-colors min-h-touch"
            >
              {t('officer.loginBtn')}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gov-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-gov-navy text-white px-2.5 py-0.5 rounded-full">
              Officer Portal
            </span>
            <span className="text-xs font-semibold text-gov-subtle">
              {officerInfo?.department}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-gov-navy mt-1">{t('officer.title')}</h1>
          <p className="text-xs text-gov-subtle">{t('officer.subtitle')}</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="font-bold text-gov-navy block">{officerInfo?.name || 'Officer'}</span>
            <span className="text-slate-500">{officerInfo?.designation || 'Nodal Officer'}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="p-2.5 text-slate-500 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors min-h-touch min-w-touch flex items-center justify-center border border-slate-200"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <DashboardCard title="Total Grievances" count={totalCount} icon={FileText} color="blue" />
        <DashboardCard title="Pending Review" count={registeredCount} icon={AlertCircle} color="red" />
        <DashboardCard title="In Progress" count={inProgressCount} icon={Clock} color="amber" />
        <DashboardCard title="Resolved" count={resolvedCount} icon={CheckCircle2} color="emerald" />
      </div>

      {/* Department Grievance Table */}
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
