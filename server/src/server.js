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

// Root Information Endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'SAHAYAK AI Government & Citizen Assistant API',
    status: 'online',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      orchestrate: 'POST /api/ai/orchestrate',
      confirmGrievance: 'POST /api/ai/confirm-grievance',
      schemes: '/api/schemes',
      grievances: '/api/grievances',
      trackGrievance: '/api/grievances/track/:ticketId',
      officerLogin: 'POST /api/officer/login',
      officerGrievances: '/api/officer/grievances'
    },
    documentation: 'SIH 2026 Prototype API'
  });
});

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

// 404 Route Handler for Unrecognized Endpoints
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found', path: req.originalUrl });
});

// Global Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(' Centralized Server Error:', err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

// Bind to 0.0.0.0 to support both IPv4 and IPv6 localhost resolutions
app.listen(PORT, '0.0.0.0', async () => {
  console.log(`🚀 Sahayak API Server running on http://127.0.0.1:${PORT}`);
  await connectDB();
  
  if (!getIsConnected()) {
    const memory = getMemoryStore();
    memory.schemes = [...seedSchemes];
    memory.grievances = [...seedGrievances];
    console.log(` Memory fallback initialized with ${seedSchemes.length} schemes and ${seedGrievances.length} grievances.`);
  }
});
