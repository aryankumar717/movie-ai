import { useState } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Vercel env variable
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Please enter a movie name or description");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations("");

    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ input: input.trim() })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get recommendations");
      }

      const data = await response.json();

      // ✅ correct response key
      setRecommendations(data.recommendations);
    } catch (err) {
      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError")
      ) {
        setError(
          "Cannot connect to backend. Backend may be waking up (Render free tier). Please try again."
        );
      } else {
        setError(err.message || "AI is temporarily unavailable");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <header>
          <h1>🎬 AI Movie Recommendations</h1>
          <p className="subtitle">
            Enter a movie name or describe what you're looking for.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="input-form">
          <div className="input-group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="e.g. Rush or racing movies based on real stories"
              className="input-field"
              disabled={loading}
            />
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Thinking..." : "Get Recommendations"}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {recommendations && (
          <div className="recommendations">
            <h2>Recommendations</h2>
            <div className="recommendations-content">
              {recommendations.split("\n").map((line, index) => {
                if (line.startsWith("MOVIE")) {
                  return (
                    <div key={index} className="movie-item">
                      <strong>{line}</strong>
                    </div>
                  );
                }

                if (line.startsWith("Rating:")) {
                  const ratingMatch = line.match(/(\d+(\.\d+)?)/);
                  const rating = ratingMatch ? Number(ratingMatch[1]) : 0;

                  return (
                    <div key={index} className="rating-container">
                      <span>{line}</span>
                      <div className="rating-stars">
                        {Array.from({ length: 10 }, (_, i) => (
                          <span
                            key={i}
                            className={`star ${
                              i < Math.round(rating) ? "filled" : ""
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }

                if (line.startsWith("Explanation:")) {
                  return (
                    <div key={index} className="explanation">
                      {line}
                    </div>
                  );
                }

                return line.trim() ? (
                  <div key={index} className="recommendation-line">
                    {line}
                  </div>
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
