# AI Movie Recommendation System

An AI-first movie recommendation system where **the LLM is the brain** - all decision-making, genre inference, and recommendations come from the AI, not rule-based logic.

## 🏗️ Architecture

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB (storage only, not for recommendations)
- **AI**: OpenAI GPT (all intelligence and decision-making)

## 🧠 Core Principle: AI-First Design

**The LLM is the single source of truth for ALL recommendation logic.**

- ✅ LLM understands if input is a movie name OR description
- ✅ LLM infers genre, tone, and intent automatically
- ✅ LLM decides which movies to recommend
- ✅ LLM generates explanations

**NO:**
- ❌ Rule-based genre detection
- ❌ Keyword matching logic
- ❌ Hardcoded recommendation lists
- ❌ Fallback movie databases

## 📁 Project Structure

```
movie-ai/
├── backend/
│   ├── config/
│   │   └── database.js       # MongoDB connection (storage only)
│   ├── routes/
│   │   └── recommendations.js # API endpoint
│   ├── services/
│   │   └── llmService.js     # LLM integration (THE BRAIN)
│   ├── server.js             # Express server
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx           # React component
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚀 Setup

### Prerequisites

- Node.js (v18+)
- MongoDB (running locally or connection string)
- OpenAI API key

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file:

```env
OPENAI_API_KEY=your_openai_api_key_here
MONGODB_URI=mongodb://localhost:27017/movie-ai
PORT=3001
FRONTEND_URL=http://localhost:5173
```

Start the backend:

```bash
npm start
# or for development with auto-reload:
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file (optional, defaults to localhost:3001):

```env
VITE_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

## 🎯 How It Works

1. **User Input**: User enters either:
   - A movie name (e.g., "Rush", "Interstellar")
   - A description (e.g., "racing movies based on real stories")

2. **Backend Processing**:
   - Receives raw user input
   - Sends it directly to the LLM with a carefully designed prompt
   - LLM analyzes and generates recommendations

3. **LLM Decision-Making**:
   - If input is a movie name → LLM infers genre, tone, themes
   - If input is a description → LLM understands preferences
   - LLM recommends 5 movies with explanations

4. **Storage**:
   - MongoDB stores the interaction (input + LLM response + timestamp)
   - **MongoDB does NOT influence recommendations** - it's for persistence/analytics only

5. **Response**:
   - Backend returns ONLY the LLM output
   - Frontend displays it to the user

## 🔑 Key Files Explained

### `backend/services/llmService.js`
**The Brain** - Contains the LLM prompt and integration. This is where all intelligence lives.

### `backend/routes/recommendations.js`
**The API** - Receives input, calls LLM, stores in MongoDB (for analytics only).

### `backend/config/database.js`
**Storage Only** - MongoDB connection. Used for persistence, NOT for recommendations.

### `frontend/src/App.jsx`
**Simple UI** - No logic, just sends input and displays LLM response.

## 🎨 Example Usage

**Input**: "Rush"

**LLM Output**:
```
MOVIE 1: Ford v Ferrari
Explanation: Like Rush, this is a high-octane racing film based on true events, focusing on the intense rivalry and technical challenges of motorsport.

MOVIE 2: Senna
Explanation: A documentary about Formula 1 legend Ayrton Senna, capturing the same passion and danger of racing that Rush portrays.

...
```

**Input**: "dark emotional sci-fi in space"

**LLM Output**:
```
MOVIE 1: Interstellar
Explanation: A deeply emotional sci-fi epic set in space, exploring themes of love, sacrifice, and humanity's future.

MOVIE 2: Moon
Explanation: A psychological sci-fi thriller set in space that delves into isolation and identity with emotional depth.

...
```

## 🛠️ Technology Choices

- **OpenAI GPT-4o-mini**: Cost-effective model that handles all reasoning
- **MongoDB**: Simple document storage for interaction history
- **Express**: Lightweight API server
- **React + Vite**: Fast, modern frontend

## 📝 Notes

- The system is intentionally simple - no authentication, no complex features
- All intelligence comes from the LLM prompt design
- MongoDB is purely for storage/analytics, never queried for recommendations
- Error handling is minimal - if LLM fails, user sees a simple message

## 🔄 Future Enhancements (Optional)

- Conversation history (still LLM-driven)
- User preferences (stored but LLM interprets them)
- Rate recommendations (feedback loop)
- Multiple LLM providers (fallback)

---

**Remember**: The LLM is the brain. Everything else is infrastructure.
