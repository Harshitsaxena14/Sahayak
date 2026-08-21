const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const { getIsConnected, getMemoryStore } = require('../config/db');
const { seedGrievances } = require('../data/seedData');

/**
 * GET /api/grievances/track/:ticketId
 * Track grievance status by Ticket ID (GRV-2026-XXXXXX)
 */
router.get('/track/:ticketId', async (req, res) => {
  try {
    const searchId = req.params.ticketId.trim().toUpperCase();
    let ticket = null;

    if (getIsConnected()) {
      ticket = await Grievance.findOne({ ticketId: searchId });
    } else {
      const memory = getMemoryStore();
      const all = memory.grievances.length > 0 ? memory.grievances : seedGrievances;
      ticket = all.find(g => g.ticketId.toUpperCase() === searchId);
    }

    if (!ticket) {
      return res.status(404).json({ error: 'Grievance ticket not found' });
    }

    return res.json(ticket);
  } catch (err) {
    return res.status(500).json({ error: 'Error tracking ticket', details: err.message });
  }
});

/**
 * GET /api/grievances
 * Citizen list of sample/submitted grievances
 */
router.get('/', async (req, res) => {
  try {
    let grievances = [];

    if (getIsConnected()) {
      grievances = await Grievance.find({}).sort({ createdAt: -1 });
    } else {
      const memory = getMemoryStore();
      grievances = memory.grievances.length > 0 ? memory.grievances : seedGrievances;
    }

    return res.json({ count: grievances.length, grievances });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch grievances', details: err.message });
  }
});

module.exports = router;
