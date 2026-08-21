const express = require('express');
const router = express.Router();
const { processCitizenTurn, submitConfirmedGrievance } = require('../services/orchestratorService');

/**
 * POST /api/ai/orchestrate
 * Primary AI Orchestration Endpoint for natural language inputs
 */
router.post('/orchestrate', async (req, res) => {
  try {
    const { message, conversationState, language } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const result = await processCitizenTurn({
      message,
      conversationState: conversationState || {},
      language: language || 'en'
    });

    return res.json(result);
  } catch (err) {
    console.error('AI Orchestration Error:', err);
    return res.status(500).json({ error: 'Failed to process AI response', details: err.message });
  }
});

/**
 * POST /api/ai/confirm-grievance
 * Confirms previewed grievance and issues official ticket ID
 */
router.post('/confirm-grievance', async (req, res) => {
  try {
    const { pendingGrievance } = req.body;
    if (!pendingGrievance || !pendingGrievance.category) {
      return res.status(400).json({ error: 'Valid grievance details required for submission' });
    }

    const submissionResult = await submitConfirmedGrievance(pendingGrievance);
    return res.json(submissionResult);
  } catch (err) {
    console.error('Grievance Submission Error:', err);
    return res.status(500).json({ error: 'Failed to record grievance', details: err.message });
  }
});

module.exports = router;
