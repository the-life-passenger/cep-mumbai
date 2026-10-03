import mongoose from 'mongoose';
import { initializeStore } from '../data/store.js';

let isMongoConnected = false;

export async function connectDB() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/mylocal_cep';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${mongoUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
    
    // Set a 3-second timeout for local detection so server doesn't hang
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });

    isMongoConnected = true;
    console.log('[Database] MongoDB connected successfully.');
  } catch (err) {
    isMongoConnected = false;
    console.warn(`[Database] MongoDB not available (${err.message}).`);
    console.log('[Database] Activating high-performance local persistent JSON store (zero-setup mode).');
  }

  // Always ensure the persistent store is seeded and ready
  await initializeStore();

  return { isMongoConnected };
}

export function getDBStatus() {
  return {
    mode: isMongoConnected ? 'mongodb' : 'persistent-store',
    connected: true,
    engine: isMongoConnected ? 'Mongoose v8' : 'Persistent JSON Storage Engine'
  };
}
