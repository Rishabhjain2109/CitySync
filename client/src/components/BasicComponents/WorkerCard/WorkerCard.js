import React from "react";
import "./WorkerCard.css";

const WorkerCard = ({ worker }) => {
  return (
    <div className="worker-card">
      <p><strong>Name:</strong> {worker.name}</p>
      <p><strong>Status:</strong> {worker.status}</p>
      <p><strong>Email:</strong> {worker.email}</p>
      <p><strong>Department:</strong> {worker.department}</p>
    </div>
  );
};

export default WorkerCard;
