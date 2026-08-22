const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  schemeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  hindiName: { type: String },
  ministry: { type: String, required: true },
  sector: { type: String, required: true }, // Healthcare, Education, Agriculture, etc.
  description: { type: String, required: true },
  purpose: { type: String, required: true },
  targetBeneficiaries: { type: String, required: true },
  eligibility: {
    minAge: { type: Number },
    maxAge: { type: Number },
    maxIncome: { type: Number },
    occupation: [{ type: String }],
    gender: { type: String }, // 'All', 'Female', 'Male'
    customCriteria: [{ type: String }]
  },
  benefits: [{ type: String }],
  documentsRequired: [{ type: String }],
  applicationSteps: [{ type: String }],
  officialUrl: { type: String, required: true },
  sourceMetadata: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Scheme', schemeSchema);
