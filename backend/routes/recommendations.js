import express from 'express';
import { getDatabase } from '../config/database.js';
import { getRecommendationsFromLLM } from '../services/llmService.js';

const router = express.Router();

/**
 * POST /api/recommendations
 * 
 * AI-FIRST ARCHITECTURE:
 * This endpoint receives raw user input and sends it directly to the LLM.
 * The LLM is responsible for ALL decision-making:
 * - Understanding if input is a movie name or description
 * - Inferring genre, tone, and intent
 * - Deciding which movies to recommend
 * - Generating explanations
 * 
 * NO rule-based logic.
 * NO keyword matching.
 * NO hardcoded movie lists.
 * 
 * MongoDB is used ONLY to store the interaction for persistence/analytics.
 */
router.post('/', async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== 'string' || input.trim().length === 0) {
      return res.status(400).json({ error: 'Input is required' });
    }

    // Send user input directly to LLM - the LLM is the brain
    const llmResponse = await getRecommendationsFromLLM(input.trim());

    // Store in MongoDB for persistence/analytics only
    // This does NOT influence future recommendations
    const db = getDatabase();
    if (db) {
      await db.collection('recommendations').insertOne({
        userInput: input.trim(),
        llmResponse: llmResponse,
        timestamp: new Date(),
      });
    }

    // Return ONLY the LLM output
    res.json({ 
      recommendations: llmResponse 
    });

  } catch (error) {
    console.error('Error in recommendations endpoint:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    // Return detailed error for debugging
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
