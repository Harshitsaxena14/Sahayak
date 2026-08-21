import React, { useState } from 'react';
import { CheckCircle2, Edit3, ShieldCheck, MapPin, Clock, Building2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ComplaintPreview = ({ preview, onConfirm, onEdit }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({ ...preview });

  const handleSaveEdit = () => {
    setIsEditing(false);
    onEdit(edited);
  };

  return (
    <div className="p-6 bg-amber-50/80 border-2 border-amber-300 rounded-3xl shadow-sm space-y-4 animate-in fade-in duration-200">
      {/* Signature Confirmation Header */}
      <div className="flex items-center gap-2.5 text-amber-950 border-b border-amber-200 pb-3">
        <ShieldCheck className="w-6 h-6 text-amber-700 shrink-0" />
        <div>
          <h4 className="text-sm font-extrabold uppercase tracking-wider">Here is what Sahayak understood</h4>
          <p className="text-xs text-amber-800 font-medium">Please review and confirm before we submit your complaint to the department.</p>
        </div>
      </div>

      {!isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
              <span className="text-gov-subtle font-bold block flex items-center gap-1.5 uppercase text-[10px] tracking-wider mb-1">
                <Building2 className="w-4 h-4 text-amber-600" />
                <span>Department</span>
              </span>
              <span className="font-extrabold text-gov-navy text-sm block">{preview.category}</span>
              <span className="text-slate-500 font-medium">{preview.department}</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
              <span className="text-gov-subtle font-bold block flex items-center gap-1.5 uppercase text-[10px] tracking-wider mb-1">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Exact Location</span>
              </span>
              <span className="font-extrabold text-gov-navy text-sm block">{preview.location || 'Not provided'}</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-amber-200 shadow-2xs">
              <span className="text-gov-subtle font-bold block flex items-center gap-1.5 uppercase text-[10px] tracking-wider mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Duration</span>
              </span>
              <span className="font-extrabold text-gov-navy text-sm block">{preview.duration || 'Not provided'}</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs">
            <span className="text-[10px] font-bold text-gov-subtle uppercase tracking-wider block mb-1">Complaint Summary</span>
            <p className="text-sm font-semibold text-gov-navy leading-relaxed">"{preview.description}"</p>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white text-slate-700 border border-slate-300 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors min-h-touch"
            >
              <Edit3 className="w-4 h-4" />
              <span>✎ Edit details</span>
            </button>
            <button
              type="button"
              onClick={() => onConfirm(edited)}
              className="inline-flex items-center gap-1.5 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl transition-all shadow-md active:scale-95 min-h-touch"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Yes, register complaint</span>
            </button>
          </div>
        </div>
      ) : (
        /* Edit Mode */
        <div className="space-y-3 bg-white p-4 rounded-2xl border border-amber-300 shadow-xs">
          <div>
            <label className="text-xs font-bold text-gov-navy block mb-1">Category</label>
            <input
              type="text"
              value={edited.category}
              onChange={(e) => setEdited({ ...edited, category: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gov-navy block mb-1">Location / Ward</label>
            <input
              type="text"
              value={edited.location}
              onChange={(e) => setEdited({ ...edited, location: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gov-navy block mb-1">Duration</label>
            <input
              type="text"
              value={edited.duration}
              onChange={(e) => setEdited({ ...edited, duration: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gov-navy block mb-1">Description</label>
            <textarea
              rows={3}
              value={edited.description}
              onChange={(e) => setEdited({ ...edited, description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-medium"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-5 py-2.5 bg-gov-navy text-white text-xs font-bold rounded-xl min-h-touch"
            >
              Save Details
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
