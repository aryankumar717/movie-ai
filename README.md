🎬 AI Movie Recommendation System

An AI-first movie recommendation system powered by a Large Language Model (LLM), built with Node.js and modern web technologies.

This project focuses on understanding natural language (movie names, moods, or descriptions) and generating explainable recommendations, instead of using traditional rule-based or genre-filter approaches.

⸻

🏗️ Architecture
	•	Frontend: React (Vite)
	•	Backend: Node.js + Express
	•	Database: MongoDB (used for storage/analytics only)
	•	AI Engine: LLM (Groq / OpenAI)

⸻

🧠 Core Principle: AI-First Design

The LLM is the single source of truth for all recommendation logic.

	•	✅ Detects whether input is a movie name or a description
	•	✅ Infers genre, mood, tone, and intent automatically
	•	✅ Decides which movies to recommend
	•	✅ Generates human-like explanations for each recommendation

No hard-coded rules. No genre filters. Pure AI reasoning.

⸻

📁 Project Structure

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
│   │   └── main.jsx
│   └── package.json
└── README.md

⸻

🚀 Setup & Installation

🔧 Prerequisites
	•	Node.js v18+
	•	MongoDB (local or cloud)
	•	LLM API key (Groq or OpenAI)
	•	OMDb API key (for movie posters)

⸻

🖥 Backend Setup

cd backend
npm install

Create .env file (use .env.example as reference)

GROQ_API_KEY=your_llm_api_key
OMDB_API_KEY=your_omdb_api_key
MONGODB_URI=mongodb://localhost:27017/movie-ai
PORT=3001
FRONTEND_URL=http://localhost:5173

Start backend server

npm start

Backend runs at:

http://localhost:3001

Health check:

http://localhost:3001/health


⸻

🌐 Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173


⸻

🎯 How It Works
	1.	User enters a movie name or a natural-language description
	2.	Backend sends raw input to the LLM
	3.	LLM interprets intent and generates recommendations
	4.	Movie posters and streaming links are fetched
	5.	MongoDB stores interaction data (analytics only)
	6.	Frontend displays results with explanations and “Where to Watch” links

⸻

🛠️ Tech Stack
	•	Node.js
	•	Express.js
	•	React + Vite
	•	MongoDB (storage only)
	•	LLM (Groq / OpenAI)
	•	OMDb API

⸻

🔮 Future Enhancements
	•	User history & preferences
	•	Feedback-based recommendations
	•	Multiple LLM provider support
	•	Faster response with caching
	•	Improved UI & animations

⸻

👨‍💻 Author

Aryan Kumar
B.Tech CSE Student
Passionate about AI, backend development, and real-world problem solving

⸻
