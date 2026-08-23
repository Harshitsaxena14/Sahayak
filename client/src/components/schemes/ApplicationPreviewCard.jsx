import React, { useState } from 'react';
import { CheckCircle2, Edit3, User, FileText, ChevronDown, ChevronUp, Save, Layers } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ApplicationPreviewCard = ({ preview, onConfirm, onEditField }) => {
  const { t, language } = useLanguage();

  // Dynamic derivation of sections from preview payload
  const sections = preview?.sections || [
    {
      sectionLabel: language === 'hi' ? "आवेदक का विवरण" : "Applicant Details",
      fields: [
        { id: "applicantName", label: language === 'hi' ? "आवेदक का नाम" : "Applicant Name", value: preview.applicantName || "Citizen" },
        { id: "aadhaarNumber", label: language === 'hi' ? "आधार संख्या" : "Aadhaar Number", value: preview.aadhaarNumber || "XXXX-XXXX-1234" }
      ]
    },
    {
      sectionLabel: language === 'hi' ? "बैंक खाता विवरण" : "Bank Account Details",
      fields: [
        { id: "bankAccount", label: language === 'hi' ? "खाता संख्या" : "Bank Account No.", value: preview.bankAccount || "XXXXXX9876" },
        { id: "ifscCode", label: language === 'hi' ? "IFSC कोड" : "IFSC Code", value: preview.ifscCode || "SBIN0001234" }
      ]
    }
  ];

  const [expandedSections, setExpandedSections] = useState(() => {
    const initial = {};
    sections.forEach((sec, idx) => {
      initial[idx] = true;
    });
    return initial;
  });

  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const toggleSection = (idx) => {
    setExpandedSections((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const handleStartEdit = (fieldId, currentVal) => {
    setEditingFieldId(fieldId);
    setEditValue(currentVal || '');
  };

  const handleSaveEdit = () => {
    if (editingFieldId && editValue.trim()) {
      if (onEditField) onEditField(editingFieldId, editValue.trim());
      setEditingFieldId(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 text-left">
      <div>
        <span className="text-[10px] font-extrabold text-sahayak-primary uppercase tracking-wider block mb-1">
          {t('appWorkspace.title') || "APPLICATION WORKSPACE"}
        </span>
        <h2 className="text-xl sm:text-2xl font-black text-sahayak-ink tracking-tight">
          {preview.schemeName || 'Scheme Application Review'}
        </h2>
        <p className="text-xs text-sahayak-inkSoft font-medium mt-0.5">
          {t('appWorkspace.subtitle') || "Please review the details below before finalizing your submission."}
        </p>
      </div>

      <div className="bg-sahayak-surface border border-sahayak-border rounded-2xl sm:rounded-3xl shadow-sahayak-card overflow-hidden p-4 sm:p-6 space-y-4">
        {/* Dynamic Section Accordions */}
        <div className="space-y-3">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="border border-sahayak-border rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection(secIdx)}
                className="w-full p-3.5 bg-sahayak-surfaceWarm flex items-center justify-between font-extrabold text-xs sm:text-sm text-sahayak-ink"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-sahayak-primary" />
                  <span>{sec.sectionLabel}</span>
                </div>
                {expandedSections[secIdx] ? (
                  <ChevronUp className="w-4 h-4 text-sahayak-inkMuted" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-sahayak-inkMuted" />
                )}
              </button>

              {expandedSections[secIdx] && (
                <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-sahayak-surface border-t border-sahayak-border">
                  {sec.fields?.map((field) => (
                    <div key={field.id} className="p-3 bg-sahayak-canvas border border-sahayak-border rounded-xl flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold text-sahayak-inkMuted uppercase block mb-0.5">{field.label}</span>
                        <span className="text-xs font-extrabold text-sahayak-ink">{field.value || 'Not provided'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(field.id, field.value)}
                        className="p-1.5 text-sahayak-inkMuted hover:text-sahayak-primary hover:bg-sahayak-surfaceWarm rounded-lg transition-colors"
                        title="Edit field"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Inline Edit Form Overlay */}
        {editingFieldId && (
          <div className="p-3.5 bg-sahayak-warningBg border border-amber-300 rounded-2xl space-y-2 animate-in fade-in">
            <label className="text-xs font-bold text-sahayak-ink block">Edit field value:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-3 py-2 border border-sahayak-border rounded-xl text-xs font-medium focus:outline-none focus:border-sahayak-primary"
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white text-xs font-bold rounded-xl flex items-center gap-1 min-h-touch"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer Action Bar */}
        <div className="pt-3 border-t border-sahayak-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-sahayak-inkMuted font-medium italic">
            {t('appWorkspace.confirmDisclaimer') || "By submitting, you confirm all details are correct."}
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onConfirm(preview)}
              className="w-full sm:w-auto px-6 py-3 bg-sahayak-primary hover:bg-sahayak-primaryHover text-white font-extrabold text-xs rounded-full transition-all shadow-sahayak-float flex items-center justify-center gap-2 min-h-touch active:scale-97"
            >
              <span>{t('appWorkspace.confirmSubmit') || "Confirm & Submit"}</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
