import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { getRecommendationsFromLLM } from '../services/llmService.js';

dotenv.config();

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

function getDatabase() {
  return db;
}

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return res.status(400).json({ error: 'Input is required' });
    }

    const llmResponse = await getRecommendationsFromLLM(input.trim());

    const db = getDatabase();
    if (db) {
      await db.collection('recommendations').insertOne({
        userInput: input.trim(),
        llmResponse: llmResponse,
        timestamp: new Date(),
      });
    }

    res.json({ recommendations: llmResponse });

  } catch (error) {
    console.error('Error in recommendations endpoint:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    const errorResponse = {
      error: 'AI is temporarily unavailable',
      details: error.message,
      type: error.constructor.name
    };
    
    if (error.code) errorResponse.code = error.code;
    if (error.status) errorResponse.status = error.status;
    
    res.status(500).json(errorResponse);
  }
});

export default router;
