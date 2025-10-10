import React, { useState, useEffect } from 'react';
import './css/ComplaintStats.css';

const ComplaintStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    resolved: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/complaints/platform-stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    
    // Update stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="stats-loading">Loading statistics...</div>;
  }

  return (
    <div className="stats-container">
      <h2>Platform Complaint Statistics</h2>
      <p className="stats-subtitle">Real-time overview of all complaints on the platform</p>
      
      <div className="stats-grid">
        <div className="stat-card total">
          <h3>Total Complaints</h3>
          <div className="stat-number">{stats.total}</div>
        </div>
        
        <div className="stat-card pending">
          <h3>Pending</h3>
          <div className="stat-number">{stats.pending}</div>
        </div>
        
        <div className="stat-card assigned">
          <h3>Assigned</h3>
          <div className="stat-number">{stats.assigned}</div>
        </div>
        
        <div className="stat-card resolved">
          <h3>Resolved</h3>
          <div className="stat-number">{stats.resolved}</div>
        </div>
      </div>

      <div className="stats-chart">
        <h3>Complaint Status Chart</h3>
        <div className="chart-container">
          <div className="chart-bar">
            <div className="bar-label">Pending</div>
            <div className="bar-container">
              <div 
                className="bar pending-bar" 
                style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="bar-value">{stats.pending}</div>
          </div>
          
          <div className="chart-bar">
            <div className="bar-label">Assigned</div>
            <div className="bar-container">
              <div 
                className="bar assigned-bar" 
                style={{ width: `${stats.total > 0 ? (stats.assigned / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="bar-value">{stats.assigned}</div>
          </div>
          
          <div className="chart-bar">
            <div className="bar-label">Resolved</div>
            <div className="bar-container">
              <div 
                className="bar resolved-bar" 
                style={{ width: `${stats.total > 0 ? (stats.resolved / stats.total) * 100 : 0}%` }}
              ></div>
            </div>
            <div className="bar-value">{stats.resolved}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintStats;
