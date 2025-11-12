import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
        : 'https://localhost:8000';
      
      const apiUrl = `${codespaceUrl}/api/teams/`;
      // API Reference: https://{CODESPACE_NAME}-8000.app.github.dev/api/teams
      console.log('Fetching Teams from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Teams API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const teamsList = Array.isArray(data) ? data : (data.results || []);
      console.log('Processed Teams List:', teamsList);
      
      setTeams(teamsList);
      setError(null);
    } catch (error) {
      console.error('Error fetching teams:', error);
      setError(error.message);
      setTeams([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="alert alert-info">Loading teams...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="teams-container">
      <h2>Teams</h2>
      <button className="btn btn-primary mb-3" onClick={fetchTeams}>
        Refresh Teams
      </button>
      
      {teams.length === 0 ? (
        <div className="alert alert-warning">No teams found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Team Name</th>
                <th>Description</th>
                <th>Members</th>
                <th>Created Date</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id}>
                  <td>{team.id}</td>
                  <td>{team.name}</td>
                  <td>{team.description}</td>
                  <td>{team.members_count || 0}</td>
                  <td>{team.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Teams;
