const express = require('express');
const router = express.Router();

const prisma = require('../lib/prisma');

router.get('/', async (req, res) => {
  try {
    const { sector } = req.query;

    const schemes = await prisma.scheme.findMany({
      where: sector
        ? {
            sector: {
              equals: sector,
              mode: 'insensitive'
            }
          }
        : undefined,
      orderBy: {
        name: 'asc'
      }
    });

    return res.json({
      count: schemes.length,
      schemes
    });
  } catch (err) {
    console.error('Failed to fetch schemes:', err);

    return res.status(500).json({
      error: 'Failed to fetch schemes'
    });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const scheme = await prisma.scheme.findUnique({
      where: {
        schemeId: id
      }
    });

    if (!scheme) {
      return res.status(404).json({
        error: 'Scheme not found'
      });
    }

    return res.json(scheme);
  } catch (err) {
    console.error('Failed to fetch scheme:', err);

    return res.status(500).json({
      error: 'Failed to fetch scheme'
    });
  }
});

module.exports = router;