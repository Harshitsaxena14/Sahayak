import React, { useState } from 'react';
import { CheckCircle2, Edit3, MapPin, AlertCircle, Camera, Save } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ComplaintPreview = ({ preview, onConfirm, onEdit }) => {
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [edited, setEdited] = useState({ ...preview });

  const handleSaveEdit = () => {
    setIsEditing(false);
    if (onEdit) onEdit(edited);
  };

  const photoUrl = preview?.photoAttachment || preview?.attachedImagePreview;

  return (
    <div className="space-y-3 animate-in fade-in duration-200 text-left">
      <span className="text-[11px] font-extrabold text-sahayak-primary uppercase tracking-wider block">
        {t('grievance.previewTitle') || "Grievance Preview"}
      </span>

      <div className="bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl shadow-sahayak-card overflow-hidden">
        {/* Top Header */}
        <div className="p-4 bg-sahayak-surfaceWarm border-b border-sahayak-border space-y-2">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-sahayak-inkMuted uppercase tracking-wider block">
              {t('grievance.category') || "Category"}
            </span>
            <div className="flex items-center gap-2 text-base sm:text-lg font-black text-sahayak-ink">
              <AlertCircle className="w-5 h-5 text-sahayak-primary shrink-0" />
              <span>{preview?.category || 'Civil Issue'}</span>
            </div>
          </div>

          <div className="space-y-0.5 pt-1">
            <span className="text-[10px] font-extrabold text-sahayak-inkMuted uppercase tracking-wider block">
              {t('grievance.location') || "Location"}
            </span>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sahayak-ink">
              <MapPin className="w-3.5 h-3.5 text-sahayak-inkSoft shrink-0" />
              <span>{preview?.location || 'Location Not Specified'}</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sahayak-canvas text-sahayak-inkSoft border border-sahayak-border">
              • {t('grievance.statusDraft') || "Status: Draft"}
            </span>

            {photoUrl && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-sahayak-warningBg text-sahayak-warning border border-amber-300">
                <Camera className="w-3 h-3 text-sahayak-warning" />
                <span>Photo Attached</span>
              </span>
            )}
          </div>
        </div>

        {/* Attached Photo Display Section */}
        {photoUrl && (
          <div className="p-4 bg-sahayak-canvas border-b border-sahayak-border">
            <span className="text-[10px] font-extrabold text-sahayak-inkMuted uppercase tracking-wider block mb-2">
              Attached Photo Proof:
            </span>
            <div className="rounded-xl overflow-hidden border border-sahayak-border max-w-[240px] max-h-[160px] bg-black">
              {typeof photoUrl === 'string' && photoUrl.startsWith('data:') ? (
                <img src={photoUrl} alt="Complaint Evidence" className="w-full h-full object-cover" />
              ) : (
                <div className="p-3 bg-sahayak-surfaceWarm text-xs text-sahayak-ink font-mono flex items-center gap-2">
                  <Camera className="w-4 h-4 text-sahayak-primary shrink-0" />
                  <span className="truncate">{photoUrl}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Description & Action Footer */}
        <div className="p-4 space-y-3">
          <div>
            <span className="text-[10px] font-extrabold text-sahayak-inkMuted uppercase tracking-wider block mb-1">
              {t('grievance.description') || "Description"}
            </span>
            <p className="text-xs font-semibold text-sahayak-ink leading-relaxed italic">
              "{preview?.description || 'Details pending...'}"
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className="w-full sm:w-auto px-4 py-2.5 bg-sahayak-canvas hover:bg-sahayak-surfaceWarm text-sahayak-ink font-bold text-xs rounded-full transition-colors flex items-center justify-center gap-1.5 min-h-touch active:scale-97"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{t('grievance.editBtn') || "Edit details"}</span>
            </button>

            <button
              type="button"
              onClick={() => onConfirm(edited)}
              className="w-full sm:w-auto px-6 py-3 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white font-extrabold text-xs rounded-full transition-all shadow-sahayak-float flex items-center justify-center gap-2 min-h-touch active:scale-97"
            >
              <span>{t('grievance.confirmBtn') || "Confirm & Submit"}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Edit Details Overlay */}
        {isEditing && (
          <div className="p-4 bg-sahayak-warningBg border-t border-amber-300 space-y-2 animate-in fade-in">
            <label className="text-xs font-bold text-sahayak-ink block">Location / Ward:</label>
            <input
              type="text"
              value={edited.location || ''}
              onChange={(e) => setEdited({ ...edited, location: e.target.value })}
              className="w-full px-3 py-2 border border-sahayak-border rounded-xl text-xs font-medium focus:outline-none focus:border-sahayak-primary"
              placeholder="Edit Location"
            />
            <label className="text-xs font-bold text-sahayak-ink block pt-1">Detailed Description:</label>
            <textarea
              rows={2}
              value={edited.description || ''}
              onChange={(e) => setEdited({ ...edited, description: e.target.value })}
              className="w-full px-3 py-2 border border-sahayak-border rounded-xl text-xs font-medium focus:outline-none focus:border-sahayak-primary"
              placeholder="Edit Description"
            />
            <button
              type="button"
              onClick={handleSaveEdit}
              className="px-4 py-2 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white text-xs font-bold rounded-xl flex items-center gap-1 min-h-touch"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Details</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
