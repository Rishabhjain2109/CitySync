import React, { useState } from "react";
import "./HeadComplaintCard.css";
import axios from "axios";

const HeadComplaintCard = ({ complaint, workers, setWorkers }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const [showImages, setShowImages] = useState(false);
  const [submittedImages, setSubmittedImages] = useState([]);
  const token = localStorage.getItem("token");

  // ✅ Check SLA breach (48 hours = 172800000 ms)
  const isSLABreached =
    complaint.status !== "resolved" &&
    Date.now() - new Date(complaint.createdAt).getTime() > 48 * 60 * 60 * 1000;

  // 🔹 Open and close modals
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setSelectedWorkers([]);
    setShowModal(false);
  };

  // 🔹 Worker selection toggle
  const handleSelectWorker = (workerId) => {
    setSelectedWorkers((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId]
    );
  };

  // 🔹 Allocate selected workers
  const handleAllocateWorkers = async () => {
    if (!token) {
      alert("You are not authenticated. Please log in again.");
      return;
    }

    const updated = workers.map((w) =>
      selectedWorkers.includes(w._id) ? { ...w, status: "busy" } : w
    );

    try {
      await axios.put(
        "http://localhost:5000/api/workers/update-worker",
        {
          workerId: selectedWorkers,
          status: "busy",
          allocatedComplaint: complaint._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await axios.put(
        "http://localhost:5000/api/complaints/update-complaint",
        {
          complaintId: complaint._id,
          status: "assigned",
          workerIDs: selectedWorkers,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setWorkers(updated);
      alert(`Allocated ${selectedWorkers.length} worker(s) to the complaint.`);
      handleCloseModal();
    } catch (err) {
      console.error(err);
      alert("Failed to allocate workers.");
    }
  };

  // 🔹 Fetch submitted images from backend
  const handleShowImages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/complaints/complaint-submitted-image",
        {
          params: { status: complaint.status, id: complaint._id },
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSubmittedImages(response.data);
      setShowImages(true);
    } catch (error) {
      console.error("Error fetching submitted images:", error);
      alert("Failed to load submitted images.");
    }
  };

  const availableWorkers = workers.filter((w) => w.status === "active");

  return (
    <>
      {/* Complaint Card */}
      <div className={`complaint-card ${isSLABreached ? "sla-breached" : ""}`}>
        <div className="complaint-header">
          <h3>{complaint.title || "Complaint"}</h3>
          {isSLABreached && <span className="sla-badge">⚠️ SLA Breached</span>}
        </div>

        <p>
          <strong>Location:</strong> {complaint.location}
        </p>
        <p>
          <strong>Description:</strong> {complaint.description}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-badge ${complaint.status.toLowerCase()}`}>
            {complaint.status}
          </span>
        </p>
        <p>
          <strong>Date:</strong> {complaint.createdAt.split("T")[0]}
        </p>

        <div className="button-group">
          {complaint.status === "pending" && (
            <button className="allot-btn" onClick={handleOpenModal}>
              Allot Workers
            </button>
          )}

          <button className="show-images-btn" onClick={handleShowImages}>
            Show Submitted Images
          </button>
        </div>
      </div>

      {/* Worker Allocation Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Available Workers</h3>
            {availableWorkers.length > 0 ? (
              <ul className="worker-list">
                {availableWorkers.map((w) => (
                  <li key={w._id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={selectedWorkers.includes(w._id)}
                        onChange={() => handleSelectWorker(w._id)}
                      />
                      <span className="worker-name">
                        <strong>{w.name}</strong>{" "}
                        <span className="availability available">
                          (Available)
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-worker">No workers available.</p>
            )}

            <div className="modal-buttons">
              <button
                className="allocate-btn"
                onClick={handleAllocateWorkers}
                disabled={selectedWorkers.length === 0}
              >
                Allocate Workers
              </button>
              <button className="close-btn" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submitted Images Modal */}
      {showImages && (
        <div className="modal-overlay" onClick={() => setShowImages(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Submitted Images</h3>

            {submittedImages.length > 0 ? (
              <div className="image-gallery">
                {submittedImages.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Submitted ${index}`}
                    className="submitted-image"
                  />
                ))}
              </div>
            ) : (
              <p>No images available.</p>
            )}

            <button
              className="close-btn"
              onClick={() => setShowImages(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeadComplaintCard;
