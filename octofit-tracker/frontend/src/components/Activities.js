import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      // Use Codespace URL if available, otherwise fallback to localhost
      const codespaceUrl = process.env.REACT_APP_CODESPACE_NAME
        ? `https://${process.env.REACT_APP_CODESPACE_NAME}-8000.app.github.dev`
        : 'https://localhost:8000';
      
      // Construct API endpoint URL
      const apiUrl = `${codespaceUrl}/api/activities/`;
      
      // API Reference: https://{CODESPACE_NAME}-8000.app.github.dev/api/activities
      console.log('Fetching Activities from:', apiUrl);
      
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Activities API Response:', data);
      
      // Handle both paginated (.results) and plain array responses
      const activitiesList = Array.isArray(data) ? data : (data.results || []);
      console.log('Processed Activities List:', activitiesList);
      
      setActivities(activitiesList);
      setError(null);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setError(error.message);
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="alert alert-info">Loading activities...</div>;
  if (error) return <div className="alert alert-danger">Error: {error}</div>;

  return (
    <div className="activities-container">
      <h2>Activities</h2>
      <button className="btn btn-primary mb-3" onClick={fetchActivities}>
        Refresh Activities
      </button>
      
      {activities.length === 0 ? (
        <div className="alert alert-warning">No activities found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Description</th>
                <th>Date</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id}>
                  <td>{activity.id}</td>
                  <td>{activity.name}</td>
                  <td>{activity.description}</td>
                  <td>{activity.date}</td>
                  <td>{activity.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Activities;
