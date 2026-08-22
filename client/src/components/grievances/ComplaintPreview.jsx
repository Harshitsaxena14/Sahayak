import React, { useState } from 'react';
import { CheckCircle2, Edit3, MapPin, Droplets, Camera } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ComplaintPreview = ({ preview, onConfirm, onEdit }) => {
  const { t, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({ ...preview });

  const handleSaveEdit = () => {
    setIsEditing(false);
    onEdit(edited);
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-200 text-left">
      <span className="text-[11px] font-extrabold text-stitch-accent uppercase tracking-wider block">
        {t('grievance.previewTitle')}
      </span>

      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card overflow-hidden">
        {/* Top Section */}
        <div className="p-4 bg-slate-100/80 border-b border-slate-200/80 space-y-2">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-stitch-subtle uppercase tracking-wider block">
              {t('grievance.category')}
            </span>
            <div className="flex items-center gap-2 text-lg font-black text-stitch-navy">
              <Droplets className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{preview.category || 'Water Supply'}</span>
            </div>
          </div>

          <div className="space-y-0.5 pt-1">
            <span className="text-[10px] font-extrabold text-stitch-subtle uppercase tracking-wider block">
              {t('grievance.location')}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-stitch-navy">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{preview.location || 'Thatipur, Gwalior'}</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-200 text-slate-700 border border-slate-300">
              • {t('grievance.statusDraft')}
            </span>

            {preview.photoAttachment && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-900 border border-amber-300">
                <Camera className="w-3 h-3 text-amber-700" />
                <span>Photo Attached</span>
              </span>
            )}
          </div>
        </div>

        {/* Bottom Description & Actions */}
        <div className="p-4 space-y-3">
          <div>
            <span className="text-[10px] font-extrabold text-stitch-subtle uppercase tracking-wider block mb-1">
              {t('grievance.description')}
            </span>
            <p className="text-xs font-semibold text-stitch-navy leading-relaxed italic">
              "{preview.description || 'Waiting for input...'}"
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full sm:w-auto px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-1.5 min-h-touch"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>✎ {t('grievance.editBtn')}</span>
            </button>

            <button
              type="button"
              onClick={() => onConfirm(edited)}
              className="w-full sm:w-auto px-6 py-3 bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-xs rounded-full transition-all shadow-md flex items-center justify-center gap-2 min-h-touch"
            >
              <span>{t('grievance.confirmBtn')}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2">
            <input
              type="text"
              value={edited.location}
              onChange={(e) => setEdited({ ...edited, location: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
              placeholder="Edit Location"
            />
            <textarea
              rows={2}
              value={edited.description}
              onChange={(e) => setEdited({ ...edited, description: e.target.value })}
              className="w-full px-3 py-2 border rounded-xl text-xs font-medium"
              placeholder="Edit Description"
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-stitch-navy text-white text-xs font-bold rounded-xl"
            >
              Save Details
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
