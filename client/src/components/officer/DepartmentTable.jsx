import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { ShieldCheck, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const DepartmentTable = ({ grievances = [], onUpdateStatus }) => {
  const { t } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');

  const handleOpenUpdate = (g) => {
    setSelectedTicket(g);
    setNewStatus(g.status || 'Registered');
    setNotes(g.resolutionNotes || '');
  };

  const handleSave = () => {
    if (selectedTicket) {
      onUpdateStatus(selectedTicket.ticketId, { status: newStatus, notes });
      setSelectedTicket(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block overflow-x-auto bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl shadow-sahayak-card">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-sahayak-surfaceWarm border-b border-sahayak-border text-xs font-bold text-sahayak-ink uppercase tracking-wider">
              <th className="py-3.5 px-4">{t('officer.tableHeaderTicket') || 'Ticket ID'}</th>
              <th className="py-3.5 px-4">{t('officer.tableHeaderCategory') || 'Category & Dept'}</th>
              <th className="py-3.5 px-4">{t('officer.tableHeaderLocation') || 'Location'}</th>
              <th className="py-3.5 px-4">{t('officer.tableHeaderStatus') || 'Status'}</th>
              <th className="py-3.5 px-4 text-right">{t('officer.tableHeaderAction') || 'Actions'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sahayak-border text-xs font-medium text-sahayak-ink">
            {grievances.map((g) => (
              <tr key={g.ticketId} className="hover:bg-sahayak-canvas/60 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-sahayak-ink">{g.ticketId}</td>
                <td className="py-3.5 px-4">
                  <span className="font-bold text-sahayak-ink block">{g.category}</span>
                  <span className="text-[10px] text-sahayak-inkSoft block">{g.department}</span>
                </td>
                <td className="py-3.5 px-4 text-xs text-sahayak-ink max-w-[200px] truncate">{g.location}</td>
                <td className="py-3.5 px-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    g.status === 'Resolved' ? 'bg-sahayak-successBg text-sahayak-success border border-emerald-200' :
                    g.status === 'In Progress' ? 'bg-sahayak-warningBg text-sahayak-warning border border-amber-200' :
                    'bg-sahayak-surfaceViolet text-sahayak-intelligence border border-purple-200'
                  }`}>
                    {g.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleOpenUpdate(g)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-sahayak-primary text-white text-xs font-bold rounded-xl hover:bg-sahayak-primaryHover transition-colors min-h-touch"
                  >
                    <span>Update</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Stack */}
      <div className="sm:hidden space-y-3">
        {grievances.map((g) => (
          <div key={g.ticketId} className="p-4 bg-sahayak-surface border border-sahayak-border rounded-2xl shadow-xs space-y-2 text-left">
            <div className="flex items-center justify-between">
              <span className="font-mono font-black text-sm text-sahayak-ink">{g.ticketId}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                g.status === 'Resolved' ? 'bg-sahayak-successBg text-sahayak-success' : 'bg-sahayak-warningBg text-sahayak-warning'
              }`}>
                {g.status}
              </span>
            </div>
            <div className="text-xs">
              <span className="font-bold text-sahayak-ink block">{g.category}</span>
              <span className="text-[10px] text-sahayak-inkSoft block">{g.location}</span>
            </div>
            <button
              type="button"
              onClick={() => handleOpenUpdate(g)}
              className="w-full py-2 bg-sahayak-primary text-white font-bold text-xs rounded-xl min-h-touch"
            >
              Update Status
            </button>
          </div>
        ))}
      </div>

      {/* Modal / Overlay for Status Update */}
      {selectedTicket && (
        <div className="p-5 bg-sahayak-surfaceWarm border border-sahayak-border rounded-2xl space-y-3 animate-in fade-in">
          <h4 className="text-sm font-extrabold text-sahayak-ink">
            Update Ticket: <span className="font-mono text-sahayak-primary">{selectedTicket.ticketId}</span>
          </h4>
          <p className="text-xs text-sahayak-inkSoft">{selectedTicket.description}</p>

          <div className="space-y-2">
            <label className="text-xs font-bold text-sahayak-ink block">Status:</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 bg-sahayak-surface border border-sahayak-border rounded-xl text-xs font-bold text-sahayak-ink"
            >
              <option value="Registered">Registered</option>
              <option value="Assigned">Assigned</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-sahayak-ink block">Inspection / Resolution Notes:</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter official resolution details..."
              className="w-full px-3 py-2 bg-sahayak-surface border border-sahayak-border rounded-xl text-xs font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              className="px-4 py-2 bg-sahayak-canvas text-sahayak-ink text-xs font-bold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Save Update
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
