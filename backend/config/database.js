import { MongoClient } from 'mongodb';

/**
 * MongoDB Connection
 * 
 * IMPORTANT: MongoDB is used ONLY for storage and analytics.
 * It does NOT influence recommendations in any way.
 * 
 * The LLM is the single source of truth for all recommendation logic.
 * We store user inputs and LLM responses for:
 * - Persistence/history
 * - Analytics
 * - Future improvements
 */
let client = null;
let db = null;

export async function connectDatabase() {
  if (client) {
    return db;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-ai';
  
  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    console.log('✅ Connected to MongoDB');
    return db;
  } catch (error) {
    // MongoDB is optional - only used for storage/analytics
    // Don't fail server startup if MongoDB is unavailable
    console.warn('⚠️  MongoDB connection failed (optional - storage only):', error.message);
    console.warn('⚠️  Server will continue without MongoDB. Recommendations will still work.');
    return null;
  }
}

export async function closeDatabase() {
  if (client) {
    await client.close();
    client = null;
    db = null;
  }
}

export function getDatabase() {
  return db;
}
