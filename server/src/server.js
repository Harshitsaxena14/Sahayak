const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB, getIsConnected, getMemoryStore } = require('./config/db');
const { seedSchemes, seedGrievances } = require('./data/seedData');

const aiRoutes = require('./routes/aiRoutes');
const schemeRoutes = require('./routes/schemeRoutes');
const grievanceRoutes = require('./routes/grievanceRoutes');
const officerRoutes = require('./routes/officerRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/ai', aiRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/grievances', grievanceRoutes);
app.use('/api/officer', officerRoutes);

// Healthcheck Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'SAHAYAK AI Government & Citizen Assistant API',
    version: '1.0.0',
    dbConnected: getIsConnected()
  });
});

// Initialize server and seed memory store if mongo is offline
app.listen(PORT, async () => {
  console.log(`🚀 Sahayak API Server running on port ${PORT}`);
  await connectDB();
  
  if (!getIsConnected()) {
    const memory = getMemoryStore();
    memory.schemes = [...seedSchemes];
    memory.grievances = [...seedGrievances];
    console.log(` Memory fallback initialized with ${seedSchemes.length} schemes and ${seedGrievances.length} grievances.`);
  }
});
