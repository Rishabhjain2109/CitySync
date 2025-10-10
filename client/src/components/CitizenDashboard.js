import React, { useState } from "react";
import "./css/CitizenDashboard.css";
import ComplaintForm from "./BasicComponents/Form/ComplaintForm";
import Complaints from "./Complaints";
import ComplaintStats from "./ComplaintStats";

const CitizenDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [page, setPage] = useState('submit');

  return (
    <div className="page-container">
      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">My Sidebar</h1>
          <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
            ☰
          </button>
        </div>

        <div className="sidebar-buttons">
          <button onClick={()=> setPage('submit')} className="sidebar-btn btn1">Submit Complaints</button>
          <button onClick={()=> setPage('status')} className="sidebar-btn btn2">Complaints Status</button>
          <button onClick={()=> setPage('stats')} className="sidebar-btn btn3">Statistics</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {page === 'submit' && <ComplaintForm/>}
        {page === 'status' && <Complaints/>}
        {page === 'stats' && <ComplaintStats/>}
      </div>
    </div>
  );
};

export default CitizenDashboard;
