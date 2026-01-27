import express from "express";
import { getRecommendationsFromLLM } from "../services/llmService.js";
import express from 'express';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { getRecommendationsFromLLM } from '../services/llmService.js';
import { getMoviesWithWatchProviders } from '../services/moviePosterService.js';

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
>>>>>>> Stashed changes

// Lightweight fallback recommendations when the LLM is unavailable.
// These are static, safe, and avoid leaking internal errors to clients.
const FALLBACK_RECOMMENDATIONS = [
  {
    title: 'The Shawshank Redemption',
    rating: '9/10',
    explanation: 'A powerful drama with outstanding storytelling and performances.'
  },
  {
    title: 'Inception',
    rating: '8/10',
    explanation: 'A smart, visually striking sci-fi thriller that appeals to fans of mind-bending stories.'
  },
  {
    title: 'The Dark Knight',
    rating: '9/10',
    explanation: 'Gripping superhero drama with a standout performance and cinematic scale.'
  },
  {
    title: 'Spirited Away',
    rating: '9/10',
    explanation: 'A beautifully crafted animated fantasy with deep emotional themes.'
  },
  {
    title: 'Parasite',
    rating: '9/10',
    explanation: 'A genre-bending social thriller with sharp writing and tension.'
  }
];

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { input } = req.body;

    if (!input || !input.trim()) {
      return res.status(400).json({ error: "Input is required" });
    }

<<<<<<< Updated upstream
    const recommendations = await getRecommendationsFromLLM(input.trim());
=======
    const llmResponse = await getRecommendationsFromLLM(input.trim());

    // Extract movie titles from the LLM response
    // Format: "MOVIE 1: Title" or "MOVIE 1: Title (Year)"
    const movieTitleLines = llmResponse
      .split('\n')
      .filter(line => line.trim().match(/^MOVIE\s+\d+:/i))
      .map(line => {
        // Extract title after "MOVIE X:"
        const match = line.match(/^MOVIE\s+\d+:\s*(.+)$/i);
        return match ? match[1].trim() : null;
      })
      .filter(title => title !== null);

    // Fetch movie data including posters and watch providers
    let moviesWithData = [];
    if (movieTitleLines.length > 0) {
      console.log(`🎬 Extracted ${movieTitleLines.length} movie titles:`, movieTitleLines);
      moviesWithData = await getMoviesWithWatchProviders(movieTitleLines);
      const postersFound = moviesWithData.filter(m => m.poster).length;
      const watchProvidersFound = moviesWithData.filter(m => m.watchProviders && m.watchProviders.length > 0).length;
      console.log(`📸 Fetched ${postersFound} posters out of ${moviesWithData.length} movies`);
      console.log(`🎬 Fetched watch providers for ${watchProvidersFound} movies`);
      
      // Log each movie's status
      moviesWithData.forEach((m, i) => {
        console.log(`  ${i + 1}. "${m.title}" - Poster: ${m.poster ? '✅' : '❌'} | Watch Providers: ${m.watchProviders?.length || 0}`);
      });
    }

    const db = getDatabase();
    if (db) {
      await db.collection('recommendations').insertOne({
        userInput: input.trim(),
        llmResponse: llmResponse,
        timestamp: new Date(),
      });
    }

    res.json({ 
      recommendations: llmResponse,
      movies: moviesWithData
    });
>>>>>>> Stashed changes

    res.json({
      recommendations // ✅ frontend expects this key
    });
  } catch (error) {
<<<<<<< Updated upstream
    console.error("Recommendation error:", error.message);
    res.status(500).json({
      error: "AI is temporarily unavailable"
=======
    // Log full error details server-side for debugging.
    console.error('Error in recommendations endpoint:', error);

    // Return a safe, user-friendly error to clients and provide a lightweight
    // static fallback so the UI can still show something useful.
    res.status(503).json({
      error: 'AI is temporarily unavailable',
      message: 'We are unable to generate AI recommendations right now. Please try again shortly.',
      fallback: true,
      recommendations: FALLBACK_RECOMMENDATIONS
>>>>>>> Stashed changes
    });
  }
});

export default router;
