import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./BasicComponents/Button/Button";
import WorkerCard from "./BasicComponents/WorkerCard/WorkerCard";
import "./css/WorkerDashboard.css";

const WorkerDashboard = () => {
  const [head, setHead] = useState(null);
  const [showHead, setShowHead] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const fetchMyHead = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/workers/my-head", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHead(res.data.head);
      setShowHead(true);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to fetch your department head");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/workers/my-complaints", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setComplaints(res.data.complaints);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch your assigned complaints.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyComplaints();
  }, [token]);

  return (
    <div className="worker-dashboard">
      <h1 className="dashboard-title">Worker Dashboard</h1>

      <div className="actions">
        <Button onClick={fetchMyHead}>View My Head</Button>
      </div>

      {loading && <p className="loading-text">Loading...</p>}

      {/* Department Head Card */}
      {showHead && head && (
        <div className="head-card">
          <h2>Department Head Details</h2>
          <div className="head-details">
            <p><strong>Name:</strong> {head.name}</p>
            <p><strong>Enrollment No:</strong> {head.enrollmentNumber}</p>
            <p><strong>Phone:</strong> {head.phone}</p>
            <p><strong>Department:</strong> {head.department}</p>
            <p><strong>Address:</strong> {head.address}</p>
          </div>
        </div>
      )}

      {/* Assigned Complaints */}
      <div className="complaints-section">
        <h2>My Assigned Complaints ({complaints.length})</h2>
        {complaints.length === 0 ? (
          <p className="no-complaints">No assigned complaints yet.</p>
        ) : (
          <div className="complaints-grid">
            {complaints.map((c) => (
              <div key={c._id} className="complaint-card">
                <p><strong>ID:</strong> {c._id}</p>
                <p><strong>Location:</strong> {c.location}</p>
                <p><strong>Department:</strong> {c.department}</p>
                <p><strong>Description:</strong> {c.description}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={`status ${c.status.toLowerCase()}`}>{c.status}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
