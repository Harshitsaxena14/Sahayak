const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true }, // GRV-2026-XXXXXX
  category: { type: String, required: true }, // Water, Electricity, Roads, Street Lights, Sanitation, Public Transport, Municipal Services
  department: { type: String, required: true },
  location: { type: String, required: true },
  duration: { type: String },
  description: { type: String, required: true },
  citizenPhone: { type: String, default: "Simulated Citizen" },
  status: {
    type: String,
    enum: ['Registered', 'Assigned', 'In Progress', 'Resolved'],
    default: 'Registered'
  },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  history: [{
    status: { type: String },
    updatedAt: { type: Date, default: Date.now },
    notes: { type: String },
    updatedBy: { type: String, default: 'System' }
  }],
  resolutionNotes: { type: String, default: '' },
  assignedOfficer: { type: String, default: 'Unassigned' }
}, { timestamps: true });

module.exports = mongoose.model('Grievance', grievanceSchema);
