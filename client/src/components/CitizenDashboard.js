import React, { useState } from "react";
import "./css/CitizenDashboard.css";
import ComplaintForm from "./BasicComponents/Form/ComplaintForm";
import Complaints from "./Complaints";
import ComplaintStats from "./ComplaintStats";
import SidebarPage from "./BasicComponents/Sidebar/SidebarPage";

const CitizenDashboard = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [page, setPage] = useState('submit');

  const fun1 = ()=>{setPage('submit')};
  const fun2 = ()=>{setPage('status')};
  const fun3 = ()=>{setPage('stats')};

  const buttons = [
    { text: "Submit Complaints", func: fun1},
    { text: "Complaints Status", func: fun2 },
    { text: "Statistics", func: fun3 },
  ];

  return (
    <div className="page-container">
      {/* Sidebar */}
      <SidebarPage buttons={buttons} />

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
