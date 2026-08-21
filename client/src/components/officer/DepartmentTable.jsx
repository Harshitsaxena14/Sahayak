import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { useLanguage } from '../../context/LanguageContext';
import { Edit3, CheckCircle2, Clock } from 'lucide-react';

export const DepartmentTable = ({ grievances = [], onUpdateStatus }) => {
  const { t } = useLanguage();
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState('In Progress');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const handleOpenModal = (g) => {
    setSelectedTicket(g);
    setNewStatus(g.status);
    setResolutionNotes(g.resolutionNotes || '');
  };

  const handleSave = () => {
    if (!selectedTicket) return;
    onUpdateStatus(selectedTicket.ticketId, {
      status: newStatus,
      resolutionNotes,
      notes: `Status changed to ${newStatus} by Nodal Officer`
    });
    setSelectedTicket(null);
  };

  const statusStyles = {
    Registered: 'bg-red-100 text-red-800 border-red-200',
    Assigned: 'bg-amber-100 text-amber-800 border-amber-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    Resolved: 'bg-emerald-100 text-emerald-800 border-emerald-200'
  };

  return (
    <>
      <div className="bg-white border border-gov-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50 border-b border-gov-border text-xs font-bold text-gov-navy uppercase tracking-wider">
                <th className="py-3.5 px-4">{t('officer.tableHeaderTicket')}</th>
                <th className="py-3.5 px-4">{t('officer.tableHeaderCategory')}</th>
                <th className="py-3.5 px-4">{t('officer.tableHeaderLocation')}</th>
                <th className="py-3.5 px-4">{t('officer.tableHeaderStatus')}</th>
                <th className="py-3.5 px-4 text-right">{t('officer.tableHeaderAction')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm font-medium">
              {grievances.map((g) => (
                <tr key={g.ticketId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-gov-navy">
                    {g.ticketId}
                    <span className="block text-[11px] font-normal text-gov-subtle">
                      {new Date(g.createdAt || Date.now()).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-gov-navy block">{g.category}</span>
                    <span className="text-xs text-slate-500">{g.department}</span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-gov-navy max-w-[200px] truncate">
                    {g.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border ${statusStyles[g.status] || 'bg-slate-100 text-slate-800'}`}>
                      {g.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenModal(g)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gov-navy text-white text-xs font-bold rounded-lg hover:bg-gov-primary transition-colors min-h-touch"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t('officer.updateStatus')}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Status Modal */}
      <Modal isOpen={!!selectedTicket} onClose={() => setSelectedTicket(null)} title={`Update Status: ${selectedTicket?.ticketId}`}>
        {selectedTicket && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-gov-navy block mb-0.5">Complaint Description:</span>
              <p className="text-slate-600 italic">"{selectedTicket.description}"</p>
            </div>

            <div>
              <label className="text-xs font-bold text-gov-navy block mb-1">New Resolution Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold"
              >
                <option value="Registered">Registered</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-gov-navy block mb-1">Official Resolution & Inspection Notes</label>
              <textarea
                rows={3}
                placeholder="e.g. Repair crew dispatched, leak sealed on site."
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm font-medium"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-xl min-h-touch"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl min-h-touch"
              >
                {t('officer.save')}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};
