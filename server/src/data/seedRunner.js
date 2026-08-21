const dotenv = require('dotenv');
dotenv.config();

const { connectDB, getIsConnected, getMemoryStore } = require('../config/db');
const Scheme = require('../models/Scheme');
const Grievance = require('../models/Grievance');
const { seedSchemes, seedGrievances } = require('./seedData');

const runSeed = async () => {
  console.log('🌱 Starting Sahayak Seed Data Initialization...');
  await connectDB();

  if (getIsConnected()) {
    try {
      await Scheme.deleteMany({});
      await Grievance.deleteMany({});

      await Scheme.insertMany(seedSchemes);
      await Grievance.insertMany(seedGrievances);

      console.log(` Successfully seeded ${seedSchemes.length} schemes into MongoDB.`);
      console.log(` Successfully seeded ${seedGrievances.length} grievances into MongoDB.`);
    } catch (err) {
      console.error('❌ MongoDB seed error:', err);
    } finally {
      process.exit(0);
    }
  } else {
    // Populate Memory Fallback Store
    const store = getMemoryStore();
    store.schemes = [...seedSchemes];
    store.grievances = [...seedGrievances];
    console.log(` Populated ${seedSchemes.length} schemes into Memory Store.`);
    console.log(` Populated ${seedGrievances.length} grievances into Memory Store.`);
    console.log(' Memory Seed Initialization Complete!');
    process.exit(0);
  }
};

runSeed();
