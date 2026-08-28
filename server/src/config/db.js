const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/resolveflow_db';
    console.log(`Connecting to MongoDB at ${mongoUri}...`);
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 1000
    });
    isConnected = true;
    console.log('MongoDB Connected successfully!');
  } catch (error) {
    console.warn(`MongoDB Notice: (${error.message}). Operating in ResolveFlow High-Performance Memory Engine mode.`);
    isConnected = false;
  }
};

module.exports = { connectDB, getIsConnected: () => isConnected };
