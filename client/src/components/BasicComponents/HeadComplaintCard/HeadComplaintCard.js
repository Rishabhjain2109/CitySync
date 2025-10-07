import React, { useState } from "react";
import "./HeadComplaintCard.css";
import axios from "axios";

const HeadComplaintCard = ({ complaint, workers, setWorkers }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedWorkers, setSelectedWorkers] = useState([]);
  const token = localStorage.getItem('token');

  const handleOpenModal = () =>{ 
    console.log(selectedWorkers);
    
    setShowModal(true);    
  }
  const handleCloseModal = () => {
    setSelectedWorkers([]);
    setShowModal(false);
  };

  // Toggle worker selection
  const handleSelectWorker = (workerId) => {
    setSelectedWorkers((prev) =>
      prev.includes(workerId)
        ? prev.filter((id) => id !== workerId)
        : [...prev, workerId]
    );
  };

  // Allocate selected workers (change availability to false)
  const handleAllocateWorkers = async () => {
    if (!token) {
      alert('You are not authenticated. Please log in again.');
      return;
    }
    const updated = workers.map((w) =>
      selectedWorkers.includes(w._id) ? { ...w, status: 'busy' } : w
    );
    const response = await axios.put(
      'http://localhost:5000/api/workers/update-worker',
      {
        workerId: selectedWorkers,
        status: 'busy',
        allocatedComplaint: complaint._id
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const complaintResponse = await axios.put(
      'http://localhost:5000/api/complaints/update-complaint',
      {
        complaintId: complaint._id,
        status: 'assigned',
        assignedWorkers: selectedWorkers
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setWorkers(updated);
    alert(`Allocated ${selectedWorkers.length} worker(s) to the complaint.`);
    handleCloseModal();
  };

  // Filter only available workers
  const availableWorkers = workers.filter((w) => w.status === 'active');

  return (
    <>
      {/* Complaint Card */}
      <div className="complaint-card">
        
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

        <button className="allot-btn" onClick={handleOpenModal}>
          Allot Workers
        </button>
      </div>

      {/* Floating Modal */}
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
    </>
  );
};

export default HeadComplaintCard;
