const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Grievance = require('../models/Grievance');
const { getIsConnected, getMemoryStore } = require('../config/db');
const { seedGrievances } = require('../data/seedData');

const JWT_SECRET = process.env.JWT_SECRET || 'sahayak_sih2026_jwt_secret_key';

// Officer Auth Middleware
const authenticateOfficer = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Officer authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.officer = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired officer token' });
  }
};

/**
 * POST /api/officer/login
 * Demo Officer Login (Credential: officer / sahayak2026)
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if ((username === 'officer' || username === 'admin') && (password === 'sahayak2026' || password === 'admin')) {
    const token = jwt.sign(
      { username, department: 'Municipal Administration', role: 'Nodal Officer' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return res.json({
      success: true,
      token,
      officer: {
        username,
        name: 'Officer Rajesh Kumar',
        department: 'Municipal Corporation',
        designation: 'Senior Nodal Officer'
      }
    });
  }

  return res.status(401).json({ error: 'Invalid officer credentials. (Demo: officer / sahayak2026)' });
});

/**
 * GET /api/officer/grievances
 * Fetch all grievances for officer table view
 */
router.get('/grievances', authenticateOfficer, async (req, res) => {
  try {
    let grievances = [];
    if (getIsConnected()) {
      grievances = await Grievance.find({}).sort({ updatedAt: -1 });
    } else {
      const memory = getMemoryStore();
      grievances = memory.grievances.length > 0 ? memory.grievances : [...seedGrievances];
    }
    return res.json({ count: grievances.length, grievances });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch officer grievances', details: err.message });
  }
});

/**
 * PATCH /api/officer/grievances/:ticketId
 * Update grievance status and resolution notes
 */
router.patch('/grievances/:ticketId', authenticateOfficer, async (req, res) => {
  try {
    const searchId = req.params.ticketId.trim().toUpperCase();
    const { status, notes, resolutionNotes, assignedOfficer } = req.body;

    let updatedTicket = null;

    if (getIsConnected()) {
      const ticket = await Grievance.findOne({ ticketId: searchId });
      if (!ticket) return res.status(404).json({ error: 'Grievance ticket not found' });

      if (status) ticket.status = status;
      if (resolutionNotes !== undefined) ticket.resolutionNotes = resolutionNotes;
      if (assignedOfficer) ticket.assignedOfficer = assignedOfficer;

      ticket.history.push({
        status: status || ticket.status,
        updatedAt: new Date(),
        notes: notes || `Status updated to ${status} by Officer`,
        updatedBy: req.officer.name || req.officer.username || 'Nodal Officer'
      });

      await ticket.save();
      updatedTicket = ticket;
    } else {
      const memory = getMemoryStore();
      const grievances = memory.grievances.length > 0 ? memory.grievances : seedGrievances;
      const index = grievances.findIndex(g => g.ticketId.toUpperCase() === searchId);

      if (index === -1) return res.status(404).json({ error: 'Grievance ticket not found' });

      const ticket = grievances[index];
      if (status) ticket.status = status;
      if (resolutionNotes !== undefined) ticket.resolutionNotes = resolutionNotes;
      if (assignedOfficer) ticket.assignedOfficer = assignedOfficer;

      if (!ticket.history) ticket.history = [];
      ticket.history.push({
        status: status || ticket.status,
        updatedAt: new Date(),
        notes: notes || `Status updated to ${status} by Officer`,
        updatedBy: req.officer.username || 'Nodal Officer'
      });

      grievances[index] = ticket;
      memory.grievances = grievances;
      updatedTicket = ticket;
    }

    return res.json({ success: true, ticket: updatedTicket });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update grievance', details: err.message });
  }
});

module.exports = router;
