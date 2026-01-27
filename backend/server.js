import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recommendationsRouter from "./routes/recommendations.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: [
      "https://movieai717.vercel.app",
      "http://localhost:5173",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "AI Movie Recommendation API" });
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.use("/api/recommendations", recommendationsRouter);

app.listen(PORT, () => {
  console.log("ENV CHECK:", {
    groq: !!process.env.GROQ_API_KEY,
    omdb: !!process.env.OMDB_API_KEY,
  });

  if (!process.env.GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY missing");
  }

  if (!process.env.OMDB_API_KEY) {
    console.error("❌ OMDB_API_KEY missing");
  }

  console.log(`Server running on http://localhost:${PORT}`);
  console.log("LLM: Ready (using Groq)");
});