import React, { useState } from 'react';
import axios from 'axios';

const HeadDashboard = () => {
  const [showComplaints, setShowComplaints] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleViewComplaints = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/complaints/department', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data.complaints);
      setShowComplaints(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch complaints');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Department Head Dashboard</h1>
      <button onClick={handleViewComplaints}>View Complaints</button>

      {loading && <p>Loading complaints...</p>}

      {showComplaints && complaints.length === 0 && <p>No complaints found.</p>}

      {showComplaints && complaints.map(c => (
        <div key={c._id} style={{ border: '1px solid black', margin: '10px 0', padding: '10px' }}>
          <p>Type: {c.type}</p>
          <p>Location: {c.location}</p>
          <p>Status: {c.status}</p>
        </div>
      ))}
    </div>
  );
};

export default HeadDashboard;
