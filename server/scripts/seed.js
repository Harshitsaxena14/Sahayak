const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const Scheme = require('../models/Scheme');
const Grievance = require('../models/Grievance');
const Application = require('../models/Application');

const DATA_PATH = path.join(__dirname, '../data/schemes.json');

async function seed() {
  console.log('Seeding SAHAYAK Data Store...');
  
  if (!fs.existsSync(DATA_PATH)) {
    console.error('Data file server/data/schemes.json not found!');
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_PATH, 'utf-8');
  const data = JSON.parse(raw);

  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
      console.log('Connected to MongoDB for seeding...');

      await Scheme.deleteMany({});
      await Grievance.deleteMany({});
      await Application.deleteMany({});

      if (data.schemes?.length) await Scheme.insertMany(data.schemes);
      if (data.grievances?.length) await Grievance.insertMany(data.grievances);
      if (data.applications?.length) await Application.insertMany(data.applications);

      console.log('MongoDB Seed Completed Successfully!');
      await mongoose.disconnect();
    } catch (err) {
      console.log('MongoDB Seeding skipped (using JSON file fallback):', err.message);
    }
  } else {
    console.log('JSON Data Fallback Verified (Schemes:', data.schemes?.length, 'Grievances:', data.grievances?.length, ')');
  }

  console.log('Seeding procedure finished.');
}

seed();
