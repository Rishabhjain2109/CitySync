import React, { useState } from 'react';
import axios from 'axios';
import Button from './BasicComponents/Button/Button';
import './css/HeadDashboard.css';

const HeadDashboard = () => {
  const [showComplaints, setShowComplaints] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleViewComplaints = async () => {
    // Mock data for testing
    setComplaints([
      { _id: 1, type: "Water Leakage", location: "Hostel A - Room 203", status: "Pending" },
      { _id: 2, type: "Broken Light", location: "Library Hall", status: "Resolved" },
      { _id: 3, type: "Internet Issue", location: "CSE Department", status: "In Progress" }
    ]);
    setShowComplaints(true);
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <Button onClick={handleViewComplaints} className="sidebar-btn">
          View Complaints
        </Button>
      </div>

      {/* Main content */}
      <div className="main-content">
        <h1>Department Head Dashboard</h1>

        {loading && <p>Loading complaints...</p>}

        {showComplaints && complaints.length === 0 && <p>No complaints found.</p>}

        {showComplaints &&
          complaints.map((c) => (
            <div key={c._id} className="complaint-card">
              <p><strong>Type:</strong> {c.type}</p>
              <p><strong>Location:</strong> {c.location}</p>
              <p><strong>Status:</strong> {c.status}</p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default HeadDashboard;
