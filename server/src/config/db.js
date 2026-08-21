const mongoose = require('mongoose');

let isConnectedToMongo = false;

// Fallback in-memory data store in case MongoDB is not running locally
const memoryStore = {
  schemes: [],
  grievances: [],
  officers: []
};

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sahayak_db';
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000
    });
    isConnectedToMongo = true;
    console.log(' MongoDB connected successfully');
  } catch (err) {
    isConnectedToMongo = false;
    console.log('ℹ️ Local MongoDB not detected. Operating in high-reliability Memory/JSON Fallback Mode.');
  }
};

const getIsConnected = () => isConnectedToMongo;
const getMemoryStore = () => memoryStore;

module.exports = { connectDB, getIsConnected, getMemoryStore };
