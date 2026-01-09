import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database.js';
import recommendationsRouter from './routes/recommendations.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Movie Recommendation API' });
});

// API Routes
app.use('/api/recommendations', recommendationsRouter);

// Start server
async function startServer() {
  try {
    // Check for required environment variables
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ ERROR: GROQ_API_KEY is required in .env file');
      console.error('   Create backend/.env with: GROQ_API_KEY=your_key_here');
      process.exit(1);
    }

    // Start server immediately - MongoDB connection is optional and non-blocking
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🤖 LLM: Ready (using Groq)`);
    });
    
    // Connect to MongoDB in background (for storage only, not for recommendations)
    // MongoDB is optional - server will work without it
    connectDatabase().catch(err => {
      console.warn('⚠️  MongoDB connection failed (optional):', err.message);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  const { closeDatabase } = await import('./config/database.js');
  await closeDatabase();
  process.exit(0);
});
