import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
        : 'https://localhost:8000';
      
      const apiUrl = `${codespaceUrl}/api/leaderboard/`;
      console.log('Fetching Leaderboard from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Leaderboard API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const leaderboardList = Array.isArray(data) ? data : (data.results || []);
      console.log('Processed Leaderboard List:', leaderboardList);
      
      setLeaderboard(leaderboardList);
      setError(null);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError(error.message);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="alert alert-info">Loading leaderboard...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <button className="btn btn-primary mb-3" onClick={fetchLeaderboard}>
        Refresh Leaderboard
      </button>
      
      {leaderboard.length === 0 ? (
        <div className="alert alert-warning">No leaderboard data found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Score</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{entry.user}</td>
                  <td>{entry.score}</td>
                  <td>{entry.team}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Leaderboard;
