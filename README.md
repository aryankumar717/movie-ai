# 🎬 AI Movie Recommendation System

**LLM-based movie recommendation system built with Node.js and modern APIs.**

## 🏗️ Architecture

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Database**: MongoDB (storage only, not for recommendations)
- **AI**: LLM (Groq / OpenAI – all intelligence and decision-making)

## 🧠 Core Principle: AI-First Design

**The LLM is the single source of truth for ALL recommendation logic.**

- ✅ LLM understands whether input is a movie name or a description
- ✅ LLM infers genre, tone, and intent automatically
- ✅ LLM decides which movies to recommend
- ✅ LLM generates human-like explanations

## 📁 Project Structure

movie-ai/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── routes/
│   │   └── recommendations.js
│   ├── services/
│   │   ├── llmService.js
│   │   └── moviePosterService.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   └── package.json
└── README.md

## 🚀 Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)
- LLM API key (Groq / OpenAI)

### Backend Setup

```bash
cd backend
npm install

Create .env file:

GROQ_API_KEY=your_llm_api_key
OMDB_API_KEY=your_omdb_api_key
MONGODB_URI=mongodb://localhost:27017/movie-ai
PORT=3001
FRONTEND_URL=http://localhost:5173

Start backend:

npm start

Frontend Setup

cd frontend
npm install
npm run dev

🎯 How It Works
	1.	User enters a movie name or description
	2.	Backend sends raw input to the LLM
	3.	LLM understands intent and generates recommendations
	4.	MongoDB stores interaction (analytics only)
	5.	Frontend displays results

🛠️ Tech Stack
	•	Node.js
	•	Express.js
	•	React + Vite
	•	MongoDB (storage only)
	•	LLM (Groq / OpenAI)
	•	OMDb API

🔮 Future Enhancements
	•	User history
	•	Feedback-based recommendations
	•	Multiple LLM providers
	•	Improved UI

⸻

👨‍💻 Author

Aryan Kumar
B.Tech CSE Student
Passionate about AI, backend development, and real-world problem solving
