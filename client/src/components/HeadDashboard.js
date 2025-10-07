import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './BasicComponents/Button/Button';
import './css/HeadDashboard.css';
import HeadComplaintCard from './BasicComponents/HeadComplaintCard/HeadComplaintCard';

const HeadDashboard = () => {
  const [showComplaints, setShowComplaints] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [workers, setWorkers] = useState([]);
  
  const [workers,setWorkers]=useState([]);
  const [showWorkers,setShowWorkers]=useState(false);

  const token = localStorage.getItem("token")

  const handleViewComplaints = async () => {
    
    setShowComplaints(true);
    
    setShowWorkers(false);
  };
  
  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/heads/workers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkers(res.data.workers);
      setShowWorkers(true);
      setShowComplaints(false);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch workers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      const complaintsResponse = await axios.get("http://localhost:5000/api/complaints/headComplaints", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setComplaints(complaintsResponse.data.complaints);
      console.log(complaintsResponse.data.complaints);
    };

    const fetchWorkers = async () => {
      const workersResponse = await axios.get("http://localhost:5000/api/workers/get-workers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkers(workersResponse.data.workers);
      console.log(workersResponse.data.workers);
      setShowWorkers(true);
    };

    fetchWorkers();
    fetchComplaints();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <Button onClick={handleViewComplaints} className="sidebar-btn">
          View Complaints
        </Button>

        <Button onClick={fetchWorkers} className="sidebar-btn">
          View Workers
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

           {/* Workers Section */}
        {showWorkers && !loading && (
          <div className="workers-section">
            <h2>Your Workers ({workers.length})</h2>
            {workers.length === 0 ? (
              <p>No workers found under you.</p>
            ) : (
              workers.map((worker) => (
                <div key={worker._id} className="worker-card">
                  <p><strong>Name:</strong> {worker.name}</p>
                  <p><strong>Status:</strong> {worker.status}</p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadDashboard;
