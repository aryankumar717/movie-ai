# Quick Setup Guide

## Fix "Failed to Fetch" Error

The backend needs an OpenAI API key to work. Here's how to set it up:

### Step 1: Create Backend .env File

```bash
cd backend
cp env.example .env
```

### Step 2: Add Your OpenAI API Key

Edit `backend/.env` and add your OpenAI API key:

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
MONGODB_URI=mongodb://localhost:27017/movie-ai
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**Get your API key from:** https://platform.openai.com/api-keys

### Step 3: (Optional) MongoDB Setup

MongoDB is optional - the server will work without it. If you want to store interactions:

- **Local MongoDB**: Make sure MongoDB is running locally
- **MongoDB Atlas**: Use your connection string in `MONGODB_URI`

### Step 4: Restart Backend

After creating `.env`, restart the backend:

```bash
cd backend
npm start
```

The server should now start successfully and the frontend will be able to connect!

---

**Note**: The frontend is already running. Once the backend starts, refresh your browser and try again.
