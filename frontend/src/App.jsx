import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [input, setInput] = useState("");
  const [recommendations, setRecommendations] = useState("");
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  // 🔥 Warm up backend to reduce cold start delay
  useEffect(() => {
    fetch(`${API_URL}/health`).catch(() => {});
  }, [API_URL]);

  const parseRecommendations = (text, moviesData) => {
    const lines = text.split("\n");
    const parsed = [];
    let current = null;
    let index = 0;

    for (const line of lines) {
      const trimmed = line.trim();

      const movieMatch = trimmed.match(/^MOVIE\s+\d+:\s*(.+)$/i);
      if (movieMatch) {
        if (current) parsed.push(current);

        const title = movieMatch[1].trim();
        const movieData = moviesData[index] || {};

        current = {
          title,
          rating: null,
          explanation: null,
          poster: movieData.poster || null,
          watchProviders: movieData.watchProviders || [],
        };

        index++;
        continue;
      }

      const ratingMatch = trimmed.match(/^Rating:\s*(\d+(\.\d+)?)\/10/i);
      if (ratingMatch && current) {
        current.rating = parseFloat(ratingMatch[1]);
        continue;
      }

      const explanationMatch = trimmed.match(/^Explanation:\s*(.+)$/i);
      if (explanationMatch && current) {
        current.explanation = explanationMatch[1];
      }
    }

    if (current) parsed.push(current);
    return parsed;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError("Please enter a movie name or description");
      return;
    }

    setLoading(true);
    setError("");
    setRecommendations("");
    setMovies([]);

    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: input.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to get recommendations");
      }

      const data = await response.json();
      setRecommendations(data.recommendations);
      setMovies(data.movies || []);
    } catch (err) {
      setError(
        err.message.includes("fetch")
          ? "Cannot connect to backend. Please try again."
          : err.message || "AI is temporarily unavailable"
      );
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
              placeholder="Describe a movie, mood, or story…"
              className="input-field"
              disabled={loading}
            />
            <button className="submit-btn" disabled={loading}>
              {loading
                ? "🎬 Finding movies you’ll love…"
                : "Get Recommendations"}
            </button>
          </div>
        </form>

        {error && <div className="error-message">{error}</div>}

        {recommendations && (
          <div className="recommendations">
            <h2>Recommendations</h2>

            <div className="recommendations-content">
              {parseRecommendations(recommendations, movies).map(
                (movie, index) => (
                  <div key={index} className="movie-card">
                    <div className="movie-poster">
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title} />
                      ) : (
                        <div className="no-poster">No Image</div>
                      )}
                    </div>

                    <div className="movie-info">
                      <div className="movie-title">{movie.title}</div>

                      {movie.rating !== null && (
                        <div className="rating">
                          Rating: {movie.rating}/10
                        </div>
                      )}

                      {movie.explanation && (
                        <div className="explanation">
                          <strong>Explanation:</strong> {movie.explanation}
                        </div>
                      )}

                      {movie.watchProviders.length > 0 && (
                        <div className="watch-section">
                          <div className="watch-title">Where to watch</div>

                          <div className="watch-providers">
                            {movie.watchProviders.map((p, i) => (
                              <a
                                key={i}
                                href={p.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="watch-provider"
                              >
                                <img src={p.logo} alt={p.provider} />
                                <span className="provider-name">
                                  {p.provider}
                                </span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
