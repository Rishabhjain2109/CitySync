import React, { useState } from "react";
import axios from "axios";
import "./AssignedComplaintCard.css";

const AssignedComplaintCard = ({ complaint }) => {
  const [showWorkers, setShowWorkers] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchAllocatedWorkers = async () => {
    try {
      setLoading(true);
      
      if (!complaint.assignedWorkers || complaint.assignedWorkers.length === 0) {
        setWorkers([]);
        setShowWorkers(true);
        return;
      }

      // Fetch worker details using their IDs
      const res = await axios.get(
        "http://localhost:5000/api/complaints/allocated-workers",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { workerIds: complaint.assignedWorkers.join(',') }
        }
      );

      console.log(res.data);
      setWorkers(res.data.allocatedWorkers);
      setShowWorkers(true);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch allocated workers");
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkers = () => {
    if (!showWorkers) {
      fetchAllocatedWorkers();
    } else {
      setShowWorkers(false);
    }
  };

  return (
    <div className="assigned-complaint-card">
      <div className="complaint-header">
        <h3>{complaint.title}</h3>
        <p><strong>Status:</strong> {complaint.status}</p>
      </div>

      <p><strong>Description:</strong> {complaint.description}</p>
      <p><strong>Category:</strong> {complaint.category}</p>
      <p><strong>Date:</strong> {new Date(complaint.createdAt).toLocaleDateString()}</p>

      {/* Toggle Button */}
      <button className="toggle-btn" onClick={toggleWorkers}>
        {showWorkers ? "Hide Allocated Workers" : "See Allocated Workers"}
      </button>

      {/* Allocated Workers */}
      {showWorkers && (
        <div className="workers-list">
          {loading ? (
            <p>Loading allocated workers...</p>
          ) : workers.length > 0 ? (
            workers.map((worker) => (
              <div key={worker._id} className="worker-item">
                <p><strong>Name:</strong> {worker.name}</p>
                <p><strong>Email:</strong> {worker.email}</p>
                <p><strong>Status:</strong> {worker.status}</p>
              </div>
            ))
          ) : (
            <p>No workers allocated to this complaint.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignedComplaintCard;
