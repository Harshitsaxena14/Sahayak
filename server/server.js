const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const prisma = require('./lib/prisma');

const schemeRoutes = require('./routes/schemes');
const grievanceRoutes = require('./routes/grievances');
const aiRoutes = require('./routes/ai');
const applicationRoutes = require('./routes/applications');
const officerRoutes = require('./routes/officer');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/schemes', schemeRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/officer', officerRoutes);

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'online',
      dbConnected: true,
      database: 'postgresql'
    });
  } catch (error) {
    console.error('Database health check failed:', error);

    res.status(503).json({
      status: 'online',
      dbConnected: false,
      database: 'postgresql',
      error: error.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});