import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AssignedComplaintCard.css";

const AssignedComplaintCard = ({ complaint }) => {
  const [showWorkers, setShowWorkers] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showImages, setShowImages] = useState(false);
  const [images, setImages] = useState([]);
  const [resolving, setResolving] = useState(false);

  const token = localStorage.getItem("token");

  // Fetch allocated workers
  const fetchAllocatedWorkers = async () => {
    try {
      setLoading(true);
      if (!complaint.assignedWorkers || complaint.assignedWorkers.length === 0) {
        setWorkers([]);
        setShowWorkers(true);
        return;
      }

      const res = await axios.get(
        "http://localhost:5000/api/complaints/allocated-workers",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { workerIds: complaint.assignedWorkers.join(",") },
        }
      );

      setWorkers(res.data.allocatedWorkers);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch allocated workers");
    } finally {
      setLoading(false);
    }
  };

  const toggleWorkers = () => {
    if (!showWorkers) {
      setShowWorkers(true);
    } else {
      setShowWorkers(false);
    }
  };

  // Fetch submitted images
  const fetchSubmittedImages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/complaints/${complaint._id}/completion-images`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setImages(res.data.images || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch submitted images");
    } finally {
      setLoading(false);
    }
  };

  const toggleImages = () => {
    if (!showImages) {
      fetchSubmittedImages();
      setShowImages(true);
    } else {
      setShowImages(false);
    }
  };

  // Mark complaint as resolved
  const markResolved = async () => {
    const confirm = window.confirm("Are you sure you want to mark this complaint as resolved?");
    if (!confirm) return;

    const workersID = workers.map((worker) => worker._id);

    try {
      setResolving(true);
      const res = await axios.put(
        "http://localhost:5000/api/complaints/update-complaint",
        {
          complaintId: complaint._id,
          status: "resolved",
          workerIDs: workersID,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert(res.data.message || "Complaint marked as resolved!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to mark as resolved.");
    } finally {
      setResolving(false);
    }
  };

  useEffect(() => {
    fetchAllocatedWorkers();
  }, []);

  return (
    <div
      className={`assigned-complaint-card ${
        complaint.isOverdue ? "sla-breached" : ""
      }`}
    >
      <div className="complaint-header">
        <h3>{complaint.title}</h3>
        <p>
          <strong>Status:</strong> {complaint.status}
        </p>
      </div>

      <p>
        <strong>Description:</strong> {complaint.description}
      </p>
      <p>
        <strong>Category:</strong> {complaint.category}
      </p>
      <p>
        <strong>Date:</strong>{" "}
        {new Date(complaint.createdAt).toLocaleDateString()}
      </p>

      {/* SLA Information */}
      <p>
        <strong>SLA:</strong>{" "}
        {complaint.isOverdue ? (
          <span className="sla-overdue-text">⚠️ SLA Breached</span>
        ) : (
          <span className="sla-ok-text">{complaint.timeRemaining}</span>
        )}
      </p>

      {/* Buttons */}
      <div className="buttons-row">
        <button className="toggle-btn" onClick={toggleWorkers}>
          {showWorkers ? "Hide Allocated Workers" : "See Allocated Workers"}
        </button>

        <button className="toggle-btn" onClick={toggleImages}>
          {showImages ? "Hide Submitted Images" : "Show Submitted Images"}
        </button>

        <button
          className="resolve-btn"
          onClick={markResolved}
          disabled={resolving || complaint.status === "resolved"}
        >
          {resolving
            ? "Marking..."
            : complaint.status === "resolved"
            ? "Already Resolved"
            : "Resolve Complaint"}
        </button>
      </div>

      {/* Workers List */}
      {showWorkers && (
        <div className="workers-list">
          {loading ? (
            <p>Loading allocated workers...</p>
          ) : workers.length > 0 ? (
            workers.map((worker) => (
              <div key={worker._id} className="worker-item">
                <p>
                  <strong>Name:</strong> {worker.name}
                </p>
                <p>
                  <strong>Email:</strong> {worker.email}
                </p>
                <p>
                  <strong>Status:</strong> {worker.status}
                </p>
              </div>
            ))
          ) : (
            <p>No workers allocated to this complaint.</p>
          )}
        </div>
      )}

      {/* Submitted Images */}
      {showImages && (
        <div className="submitted-images">
          {loading ? (
            <p>Loading images...</p>
          ) : images.length > 0 ? (
            <div className="images-grid">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={`http://localhost:5000/${img}`}
                  alt={`submitted-${idx}`}
                  className="submitted-img"
                />
              ))}
            </div>
          ) : (
            <p>No images submitted yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AssignedComplaintCard;
