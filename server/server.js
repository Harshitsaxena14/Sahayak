const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();

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

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    dbConnected: mongoose.connection.readyState === 1
  });
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/sahayak_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected'))
  .catch(err => console.log('MongoDB connection warning (falling back to local data):', err.message));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
