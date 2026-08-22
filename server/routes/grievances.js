const express = require('express');
const router = express.Router();
const Grievance = require('../models/Grievance');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

router.get('/track/:ticketId', async (req, res) => {
  try {
    const searchId = req.params.ticketId.trim().toUpperCase();
    let ticket = null;
    if (mongoose.connection.readyState === 1) {
      ticket = await Grievance.findOne({ ticketId: searchId });
    } else {
      const dataPath = path.join(__dirname, '../data/schemes.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      ticket = data.grievances.find(g => g.ticketId.toUpperCase() === searchId);
    }
    if (!ticket) return res.status(404).json({ error: 'Grievance ticket not found' });
    return res.json(ticket);
  } catch (err) {
    return res.status(500).json({ error: 'Error tracking ticket' });
  }
});

router.get('/', async (req, res) => {
  try {
    let grievances = [];
    if (mongoose.connection.readyState === 1) {
      grievances = await Grievance.find({}).sort({ createdAt: -1 });
    } else {
      const dataPath = path.join(__dirname, '../data/schemes.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      grievances = data.grievances;
    }
    return res.json({ count: grievances.length, grievances });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch grievances' });
  }
});

module.exports = router;
