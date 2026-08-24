const express = require('express');
const router = express.Router();

const prisma = require('../lib/prisma');

router.get('/track/:ticketId', async (req, res) => {
  try {
    const searchId = req.params.ticketId.trim().toUpperCase();

    const ticket = await prisma.grievance.findUnique({
      where: {
        ticketId: searchId
      }
    });

    if (!ticket) {
      return res.status(404).json({
        error: 'Grievance ticket not found'
      });
    }

    return res.json(ticket);
  } catch (err) {
    console.error('Error tracking ticket:', err);

    return res.status(500).json({
      error: 'Error tracking ticket'
    });
  }
});

router.get('/', async (req, res) => {
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
    console.error('Failed to fetch grievances:', err);

    return res.status(500).json({
      error: 'Failed to fetch grievances'
    });
  }
});

module.exports = router;