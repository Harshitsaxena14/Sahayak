const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  applicationId: { type: String, required: true, unique: true }, // APP-2026-XXXXXX
  schemeId: { type: String, default: 'SCH-001' },
  schemeName: { type: String, required: true },
  applicantName: { type: String, default: 'Citizen' },
  details: { type: Object, default: {} },
  status: {
    type: String,
    enum: ['Submitted', 'Under Verification', 'Approved', 'Rejected'],
    default: 'Submitted'
  },
  history: [{
    status: { type: String },
    updatedAt: { type: Date, default: Date.now },
    notes: { type: String },
    updatedBy: { type: String, default: 'System' }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
