import React, { useState,useEffect } from "react";
import axios from "axios";
import Button from "./BasicComponents/Button/Button";


const WorkerDashboard = () => {
  const [head, setHead] = useState(null);
  const [showHead, setShowHead] = useState(false);
  const [complaints, setComplaints] = useState([]);

  const token = localStorage.getItem("token");

  const fetchMyHead = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/workers/my-head", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHead(res.data.head);
      setShowHead(true);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 404) {
        alert(err.response.data.message);
      } else {
        alert("Failed to fetch your department head");
      }
    }
  };
  useEffect(() => {
    const fetchMyComplaints = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/workers/my-complaints', {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setComplaints(res.data.complaints);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch your assigned complaints.");
      }
    };
  
    fetchMyComplaints();
  }, []);
  
  return (
    <div className="dashboard-container">
      <h1>Worker Dashboard</h1>
      <Button onClick={fetchMyHead}>View My Head</Button>

      {showHead && head && (
        <div className="head-card">
          <h3>Department Head Details</h3>
          <p><strong>Name:</strong> {head.name}</p>
          <p><strong>Enrollment Number:</strong> {head.enrollmentNumber}</p>
          <p><strong>Phone:</strong> {head.phone}</p>
          <p><strong>Department:</strong> {head.department}</p>
          <p><strong>Address:</strong> {head.address}</p>
        </div>
      )}
      {complaints.map((c) => (
  <div key={c._id} className="complaint-card">
    <p><strong>ID:</strong> {c._id}</p>
    <p><strong>Address:</strong> {c.location}</p>
    <p><strong>Type:</strong> {c.department}</p>
    <p><strong>Description:</strong> {c.description}</p>
    <p><strong>Status:</strong> {c.status}</p>
  </div>
))}

    </div>
  );
};

export default WorkerDashboard;
