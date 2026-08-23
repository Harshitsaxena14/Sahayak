const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Grievance = require('../models/Grievance');

const DATA_PATH = path.join(__dirname, '../data/schemes.json');

function readJsonData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch (e) {
    return { grievances: [] };
  }
}

function writeJsonData(data) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {}
}

// POST /api/officer/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'officer' && password === 'sahayak2026') {
    return res.json({ success: true, token: 'demo-officer-token-2026', officerName: 'Ramesh Sharma (EE)' });
  }
  return res.json({ success: true, token: 'demo-officer-token-2026', officerName: 'Nodal Officer' });
});

// GET /api/officer/grievances
router.get('/grievances', async (req, res) => {
  try {
    let grievances = [];
    if (mongoose.connection.readyState === 1) {
      grievances = await Grievance.find({}).sort({ createdAt: -1 });
    } else {
      const data = readJsonData();
      grievances = data.grievances || [];
    }
    return res.json({ count: grievances.length, grievances });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch officer grievances' });
  }
});

// PATCH /api/officer/grievances/:ticketId
router.patch('/grievances/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, notes } = req.body;
    const searchId = ticketId.trim().toUpperCase();

    if (mongoose.connection.readyState === 1) {
      const g = await Grievance.findOne({ ticketId: searchId });
      if (!g) return res.status(404).json({ error: 'Ticket not found' });
      if (status) g.status = status;
      if (notes) g.resolutionNotes = notes;
      g.history.push({
        status: status || g.status,
        updatedAt: new Date(),
        notes: notes || 'Status updated by Officer',
        updatedBy: 'Nodal Officer'
      });
      await g.save();
      return res.json({ success: true, ticket: g });
    } else {
      const data = readJsonData();
      const idx = (data.grievances || []).findIndex(g => g.ticketId.toUpperCase() === searchId);
      if (idx === -1) return res.status(404).json({ error: 'Ticket not found' });
      
      const item = data.grievances[idx];
      if (status) item.status = status;
      if (notes) item.resolutionNotes = notes;
      if (!item.history) item.history = [];
      item.history.push({
        status: status || item.status,
        updatedAt: new Date().toISOString(),
        notes: notes || 'Status updated by Officer',
        updatedBy: 'Nodal Officer'
      });
      data.grievances[idx] = item;
      writeJsonData(data);
      return res.json({ success: true, ticket: item });
    }
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update grievance' });
  }
});

module.exports = router;
