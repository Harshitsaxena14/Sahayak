const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    const { sector } = req.query;
    let schemes = [];
    if (mongoose.connection.readyState === 1) {
      const filter = sector ? { sector } : {};
      schemes = await Scheme.find(filter);
    } else {
      const dataPath = path.join(__dirname, '../data/schemes.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      schemes = data.schemes;
      if (sector) {
        schemes = schemes.filter(s => s.sector.toLowerCase() === sector.toLowerCase());
      }
    }
    return res.json({ count: schemes.length, schemes });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch schemes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let scheme = null;
    if (mongoose.connection.readyState === 1) {
      scheme = await Scheme.findOne({ schemeId: id });
    } else {
      const dataPath = path.join(__dirname, '../data/schemes.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
      scheme = data.schemes.find(s => s.schemeId === id);
    }
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    return res.json(scheme);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch scheme' });
  }
});

module.exports = router;
