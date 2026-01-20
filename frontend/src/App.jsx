import { useState } from 'react';
import './App.css';

function App() {
  const [input, setInput] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      setError('Please enter a movie name or description');
      return;
    }

    setLoading(true);
    setError('');
    setRecommendations('');

    try {
      const response = await fetch(`${API_URL}/api/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: input.trim() }),
      });

      const data = await response.json();
      console.log('BACKEND RESPONSE:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get recommendations');
      }

      // ✅ FIXED LINE
      setRecommendations(data.recommendations || '');
    } catch (err) {
      setError('AI is temporarily unavailable');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🎬 AI Movie Recommendations</h1>

        <form onSubmit={handleSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Rush"
            disabled={loading}
          />
          <button disabled={loading}>
            {loading ? 'Thinking...' : 'Get Recommendations'}
          </button>
        </form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {recommendations && (
          <pre style={{ whiteSpace: 'pre-wrap' }}>
            {recommendations}
          </pre>
        )}
      </div>
    </div>
  );
}

export default App;
