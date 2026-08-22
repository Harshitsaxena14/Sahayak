import React, { useState } from 'react';
import { CheckCircle2, Edit3, Landmark, User, Mountain, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ApplicationPreviewCard = ({ preview, onConfirm, onEditField }) => {
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState('applicant');
  const [expandedSections, setExpandedSections] = useState({
    applicant: true,
    land: false,
    documents: false
  });

  const [editingFieldId, setEditingFieldId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const toggleSection = (section) => {
    setActiveSection(section);
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleStartEdit = (fieldId, currentVal) => {
    setEditingFieldId(fieldId);
    setEditValue(currentVal || '');
  };

  const handleSaveEdit = () => {
    if (editingFieldId && editValue.trim()) {
      onEditField(editingFieldId, editValue.trim());
      setEditingFieldId(null);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200 text-left">
      {/* Header */}
      <div>
        <span className="text-[10px] font-extrabold text-stitch-accent uppercase tracking-wider block mb-1">
          APPLICATION WORKSPACE
        </span>
        <h2 className="text-2xl font-black text-stitch-navy tracking-tight">Review Application</h2>
        <p className="text-xs text-stitch-subtle font-medium mt-0.5">
          Please review the details below before finalizing your submission for the {preview.schemeName || 'PM-KISAN'} scheme.
        </p>
      </div>

      {/* Desktop 2-Column Review Layout (Screenshot 3) */}
      <div className="bg-white border border-slate-200/90 rounded-3xl shadow-stitch-card overflow-hidden p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Summary Sidebar (Desktop >= 768px) */}
          <div className="hidden md:block md:col-span-4 border-r border-slate-100 pr-6 space-y-4">
            <span className="text-xs font-black text-stitch-navy uppercase tracking-wider block">Summary</span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => toggleSection('applicant')}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                  activeSection === 'applicant'
                    ? 'bg-indigo-100/70 text-indigo-900 shadow-2xs'
                    : 'text-stitch-subtle hover:bg-slate-50'
                }`}
              >
                <User className="w-4 h-4 text-indigo-600" />
                <span>Applicant Details</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSection('land')}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                  activeSection === 'land'
                    ? 'bg-indigo-100/70 text-indigo-900 shadow-2xs'
                    : 'text-stitch-subtle hover:bg-slate-50'
                }`}
              >
                <Mountain className="w-4 h-4 text-amber-600" />
                <span>Land Details</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSection('documents')}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all ${
                  activeSection === 'documents'
                    ? 'bg-indigo-100/70 text-indigo-900 shadow-2xs'
                    : 'text-stitch-subtle hover:bg-slate-50'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Documents</span>
              </button>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                • Status: Draft
              </span>
            </div>
          </div>

          {/* Right Accordion Workspace (Desktop md:col-span-8 & Mobile col-span-12) */}
          <div className="col-span-12 md:col-span-8 space-y-4">
            {/* Section 1: Applicant Details */}
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('applicant')}
                className="w-full p-4 bg-slate-50/80 flex items-center justify-between font-extrabold text-sm text-stitch-navy"
              >
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>Applicant Details</span>
                </div>
                {expandedSections.applicant ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {expandedSections.applicant && (
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border-t border-slate-100">
                  {preview.fields?.map((field) => (
                    <div key={field.id} className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-stitch-subtle uppercase block mb-0.5">{field.label}</span>
                        <span className="text-xs font-extrabold text-stitch-navy">{field.value || 'Not provided'}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleStartEdit(field.id, field.value)}
                        className="p-1 text-slate-400 hover:text-stitch-accent rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Section 2: Land Details */}
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('land')}
                className="w-full p-4 bg-slate-50/80 flex items-center justify-between font-extrabold text-sm text-stitch-navy"
              >
                <div className="flex items-center gap-2">
                  <Mountain className="w-4 h-4 text-amber-600" />
                  <span>Land Details</span>
                </div>
                {expandedSections.land ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {expandedSections.land && (
                <div className="p-4 bg-white border-t border-slate-100 text-xs font-medium space-y-2">
                  <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                    <span className="text-stitch-subtle">Cultivable Land Area:</span>
                    <span className="font-extrabold text-stitch-navy">
                      {preview.fields?.find(f => f.id === 'landArea')?.value || 'Registered'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Section 3: Documents Checklist */}
            <div className="border border-slate-200/80 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection('documents')}
                className="w-full p-4 bg-slate-50/80 flex items-center justify-between font-extrabold text-sm text-stitch-navy"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Documents</span>
                </div>
                {expandedSections.documents ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
              </button>

              {expandedSections.documents && (
                <div className="p-4 bg-white border-t border-slate-100 space-y-2">
                  <ul className="space-y-1.5 text-xs font-semibold text-stitch-navy">
                    {preview.documents?.map((doc, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                        <span>{doc.name}</span>
                      </li>
                    )) || (
                      <li className="flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">✓</span>
                        <span>Aadhaar Card & Bank Passbook</span>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Edit Field Overlay */}
        {editingFieldId && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <label className="text-xs font-bold text-stitch-navy block">Update Field Value:</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-xl text-xs font-medium"
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-stitch-navy text-white text-xs font-bold rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        )}

        {/* Footer Action Bar (Screenshot 3) */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-slate-400 font-medium italic">
            By submitting, you confirm all details are correct.
          </p>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              className="flex-1 sm:flex-initial px-5 py-3 bg-white hover:bg-slate-50 text-stitch-navy border border-slate-300 font-extrabold text-xs rounded-full transition-all min-h-touch"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={() => onConfirm(preview)}
              className="flex-1 sm:flex-initial px-6 py-3 bg-black hover:bg-slate-800 text-white font-extrabold text-xs rounded-full transition-all shadow-stitch-float flex items-center justify-center gap-2 min-h-touch"
            >
              <span>Confirm & Submit</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
