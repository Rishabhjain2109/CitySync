import React, { useState } from "react";
import "./css/CitizenDashboard.css";
import ComplaintForm from "./BasicComponents/Form/ComplaintForm";
import Complaints from "./Complaints";

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
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        {/* <h2>Submit Your Complaints</h2> */}
        {page === 'submit' ? <ComplaintForm/>:<Complaints/>}
      </div>
    </div>
  );
};

export default CitizenDashboard;
