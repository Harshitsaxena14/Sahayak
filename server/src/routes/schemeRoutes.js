const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');
const { getIsConnected, getMemoryStore } = require('../config/db');
const { seedSchemes } = require('../data/seedData');

/**
 * GET /api/schemes
 * Returns list of government schemes with optional sector filtering
 */
router.get('/', async (req, res) => {
  try {
    const { sector } = req.query;
    let schemes = [];

    if (getIsConnected()) {
      const filter = sector ? { sector } : {};
      schemes = await Scheme.find(filter);
    } else {
      const memory = getMemoryStore();
      schemes = memory.schemes.length > 0 ? memory.schemes : [...seedSchemes];
      if (sector) {
        schemes = schemes.filter(s => s.sector.toLowerCase() === sector.toLowerCase());
      }
    }

    return res.json({ count: schemes.length, schemes });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch schemes', details: err.message });
  }
});

/**
 * GET /api/schemes/:id
 * Get single scheme details by schemeId
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let scheme = null;

    if (getIsConnected()) {
      scheme = await Scheme.findOne({ schemeId: id });
    } else {
      const memory = getMemoryStore();
      const all = memory.schemes.length > 0 ? memory.schemes : seedSchemes;
      scheme = all.find(s => s.schemeId === id);
    }

    if (!scheme) {
      return res.status(404).json({ error: 'Scheme not found' });
    }

    return res.json(scheme);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch scheme', details: err.message });
  }
});

module.exports = router;
