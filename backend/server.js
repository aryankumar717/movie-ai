import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import recommendationsRouter, { connectDatabase, closeDatabase } from './routes/recommendations.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'AI Movie Recommendation API' });
});

app.use('/api/recommendations', recommendationsRouter);

async function startServer() {
  try {
    if (!process.env.GROQ_API_KEY) {
      console.error('❌ ERROR: GROQ_API_KEY is required in .env file');
      console.error('   Create backend/.env with: GROQ_API_KEY=your_key_here');
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`LLM: Ready (using Groq)`);
    });
    
    connectDatabase().catch(err => {
      console.warn('MongoDB connection failed (optional):', err.message);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGTERM', async () => {
  await closeDatabase();
  process.exit(0);
});
