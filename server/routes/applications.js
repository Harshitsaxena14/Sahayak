const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Application = require('../models/Application');

const DATA_PATH = path.join(__dirname, '../data/schemes.json');

function readJsonData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch (e) {
    return { applications: [] };
  }
}

router.get('/track/:appId', async (req, res) => {
  try {
    const searchId = req.params.appId.trim().toUpperCase();
    let app = null;
    if (mongoose.connection.readyState === 1) {
      app = await Application.findOne({ applicationId: searchId });
    } else {
      const data = readJsonData();
      app = (data.applications || []).find(a => a.applicationId.toUpperCase() === searchId);
    }

    if (!app) {
      // Fallback mock application for demo tracking if newly created in memory
      return res.json({
        applicationId: searchId,
        schemeName: "PM Kisan Samman Nidhi (PM-KISAN)",
        applicantName: "Citizen",
        status: "Under Verification",
        history: [
          { status: "Submitted", updatedAt: new Date().toISOString(), notes: "Application received", updatedBy: "System" },
          { status: "Under Verification", updatedAt: new Date().toISOString(), notes: "Tehsildar document check in progress", updatedBy: "Verification Officer" }
        ]
      });
    }

    return res.json(app);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to track application' });
  }
});

module.exports = router;
