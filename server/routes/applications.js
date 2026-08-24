const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');

router.get('/track/:appId', async (req, res) => {
  try {
    const searchId = req.params.appId.trim().toUpperCase();

    const app = await prisma.application.findUnique({
      where: {
        applicationId: searchId
      }
    });

    if (!app) {
      return res.status(404).json({
        error: 'Application not found'
      });
    }

    return res.json(app);
  } catch (err) {
    console.error('Application tracking error:', err);
    return res.status(500).json({
      error: 'Failed to track application'
    });
  }
});

module.exports = router;