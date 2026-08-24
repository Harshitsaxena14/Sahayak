const express = require('express');
const router = express.Router();

const prisma = require('../lib/prisma');

// POST /api/officer/login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === 'officer' && password === 'sahayak2026') {
    return res.json({
      success: true,
      token: 'demo-officer-token-2026',
      officerName: 'Ramesh Sharma (EE)'
    });
  }

  return res.json({
    success: true,
    token: 'demo-officer-token-2026',
    officerName: 'Nodal Officer'
  });
});

// GET /api/officer/grievances
router.get('/grievances', async (req, res) => {
  try {
    const grievances = await prisma.grievance.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.json({
      count: grievances.length,
      grievances
    });
  } catch (err) {
    console.error('Failed to fetch officer grievances:', err);

    return res.status(500).json({
      error: 'Failed to fetch officer grievances'
    });
  }
});

// PATCH /api/officer/grievances/:ticketId
router.patch('/grievances/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, notes } = req.body;

    const searchId = ticketId.trim().toUpperCase();

    const grievance = await prisma.grievance.findUnique({
      where: {
        ticketId: searchId
      }
    });

    if (!grievance) {
      return res.status(404).json({
        error: 'Ticket not found'
      });
    }

    const newStatus = status || grievance.status;

    const updatedHistory = Array.isArray(grievance.history)
      ? [
          ...grievance.history,
          {
            status: newStatus,
            updatedAt: new Date().toISOString(),
            notes: notes || 'Status updated by Officer',
            updatedBy: 'Nodal Officer'
          }
        ]
      : [
          {
            status: newStatus,
            updatedAt: new Date().toISOString(),
            notes: notes || 'Status updated by Officer',
            updatedBy: 'Nodal Officer'
          }
        ];

    const updatedGrievance = await prisma.grievance.update({
      where: {
        ticketId: searchId
      },
      data: {
        status: newStatus,
        resolutionNotes: notes || grievance.resolutionNotes,
        history: updatedHistory
      }
    });

    return res.json({
      success: true,
      ticket: updatedGrievance
    });
  } catch (err) {
    console.error('Failed to update grievance:', err);

    return res.status(500).json({
      error: 'Failed to update grievance'
    });
  }
});

module.exports = router;