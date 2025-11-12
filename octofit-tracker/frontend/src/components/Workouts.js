import React, { useState, useEffect } from 'react';

function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    try {
      const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
        : 'https://localhost:8000';
      
      const apiUrl = `${codespaceUrl}/api/workouts/`;
      console.log('Fetching Workouts from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Workouts API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const workoutsList = Array.isArray(data) ? data : (data.results || []);
      console.log('Processed Workouts List:', workoutsList);
      
      setWorkouts(workoutsList);
      setError(null);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      setError(error.message);
      setWorkouts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="alert alert-info">Loading workouts...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="workouts-container">
      <h2>Workouts</h2>
      <button className="btn btn-primary mb-3" onClick={fetchWorkouts}>
        Refresh Workouts
      </button>
      
      {workouts.length === 0 ? (
        <div className="alert alert-warning">No workouts found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Intensity</th>
              </tr>
            </thead>
            <tbody>
              {workouts.map((workout) => (
                <tr key={workout.id}>
                  <td>{workout.id}</td>
                  <td>{workout.name}</td>
                  <td>{workout.description}</td>
                  <td>{workout.duration}</td>
                  <td>{workout.intensity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Workouts;
