import React, { useState, useEffect } from "react";
import axios from "axios";
import Button from "./BasicComponents/Button/Button";
import "./css/WorkerDashboard.css";

const WorkerDashboard = () => {
  const [head, setHead] = useState(null);
  const [showHead, setShowHead] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState({}); // { complaintId: [FileList] }

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

  // Handle file selection for a specific complaint
  const handleImageChange = (complaintId, files) => {
    const fileArray = Array.from(files);
    setImages((prev) => ({
      ...prev,
      [complaintId]: prev[complaintId]
        ? [...prev[complaintId], ...fileArray]
        : fileArray,
    }));
  };

  // Remove an image from preview before upload
  const handleRemoveImage = (complaintId, index) => {
    setImages((prev) => {
      const updated = [...(prev[complaintId] || [])];
      updated.splice(index, 1);
      return { ...prev, [complaintId]: updated };
    });
  };

  // Submit images for a complaint
  const handleSubmitImages = async (complaintId) => {
    if (!images[complaintId] || images[complaintId].length === 0) {
      alert("Please select at least one image before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("complaintId", complaintId); // Add complaintId to the form data
    images[complaintId].forEach((file) => formData.append("images", file));

    try {
      setUploading(true);
      const response = await axios.post(
        `http://localhost:5000/api/workers/submit-images-complaint`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Images uploaded successfully!");
      setImages((prev) => ({ ...prev, [complaintId]: [] })); // reset after upload
      console.log("Upload response:", response.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to upload images.");
    } finally {
      setUploading(false);
    }
  };

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

                {/* Image Upload Section */}
                <div className="upload-section">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleImageChange(c._id, e.target.files)}
                  />

                  {/* Image Previews */}
                  {images[c._id]?.length > 0 && (
                    <div className="image-preview">
                      {images[c._id].map((img, idx) => (
                        <div key={idx} className="preview-item">
                          <img
                            src={URL.createObjectURL(img)}
                            alt={`preview-${idx}`}
                            className="preview-img"
                          />
                          <button
                            className="remove-btn"
                            onClick={() => handleRemoveImage(c._id, idx)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button
                    onClick={() => handleSubmitImages(c._id)}
                    disabled={uploading}
                  >
                    {uploading ? "Uploading..." : "Submit Images"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerDashboard;
