import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';

export const GrievanceForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    category: 'Water Supply',
    location: '',
    duration: '3 days',
    description: ''
  });

  const categories = [
    'Water Supply',
    'Electricity',
    'Roads & Potholes',
    'Sanitation & Garbage',
    'Street Lights',
    'Public Transport',
    'Municipal Services'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.location || !formData.description) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white border border-gov-border rounded-2xl shadow-sm space-y-4">
      <h3 className="text-base font-bold text-gov-navy border-b border-slate-100 pb-2">
        Register Complaint (Manual Fallback Form)
      </h3>

      <div>
        <label className="text-xs font-bold text-gov-navy block mb-1">Grievance Category</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-bold text-gov-navy block mb-1">Exact Location / Ward / Landmark *</label>
        <input
          type="text"
          required
          placeholder="e.g. Ward 12, Subhash Nagar near Main Water Tank"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gov-navy block mb-1">How long has this issue existed?</label>
        <input
          type="text"
          placeholder="e.g. 3 days, 1 week, since yesterday"
          value={formData.duration}
          onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
        />
      </div>

      <div>
        <label className="text-xs font-bold text-gov-navy block mb-1">Detailed Description *</label>
        <textarea
          rows={4}
          required
          placeholder="Describe your issue clearly..."
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium"
        />
      </div>

      <div className="flex items-center gap-2 text-xs text-gov-subtle bg-slate-50 p-3 rounded-xl">
        <AlertCircle className="w-4 h-4 text-gov-accent shrink-0" />
        <span>Your complaint will generate a preview summary before submission.</span>
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-gov-navy hover:bg-gov-primary text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2 min-h-touch"
      >
        <Send className="w-4 h-4" />
        <span>Generate Complaint Preview</span>
      </button>
    </form>
  );
};
