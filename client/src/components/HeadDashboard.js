import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './BasicComponents/Button/Button';
import './css/HeadDashboard.css';
import HeadComplaintCard from './BasicComponents/HeadComplaintCard/HeadComplaintCard';

const HeadDashboard = () => {
  const [showComplaints, setShowComplaints] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  

  const handleViewComplaints = async () => {
    // Mock data for testing
    setComplaints([
      { _id: 1, type: "Water Leakage", location: "Hostel A - Room 203", status: "Pending" },
      { _id: 2, type: "Broken Light", location: "Library Hall", status: "Resolved" },
      { _id: 3, type: "Internet Issue", location: "CSE Department", status: "In Progress" }
    ]);
    setShowComplaints(true);
  };

  useEffect(() => {
    const workers = [
      { _id: "w001", name: "Amit Kumar", available: true },
      { _id: "w002", name: "Priya Sharma", available: false },
      { _id: "w003", name: "Ravi Verma", available: true },
      { _id: "w004", name: "Neha Singh", available: true },
      { _id: "w005", name: "Sanjay Patel", available: false },
      { _id: "w006", name: "Deepak Yadav", available: true },
      { _id: "w007", name: "Pooja Rani", available: true },
      { _id: "w008", name: "Arjun Mehta", available: false },
      { _id: "w009", name: "Kiran Gupta", available: true },
      { _id: "w010", name: "Rahul Tiwari", available: true }
    ];
    
    setWorkers(workers);
  }, []);

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
            <HeadComplaintCard complaint={c} workers={workers} setWorkers={setWorkers} />
          ))}
      </div>
    </div>
  );
};

export default HeadDashboard;
