import React from "react";
import "./ApplicantList.css";
import {  useNavigate } from "react-router-dom";

const ApplicantList = ({ application }) => {
    const navigate = useNavigate();
  if (!application) return null;

  return (
    <div className="application-card" onClick={()=> navigate(`/application/${application._id}`)}>
      <div className="application-left">
        <img
          src={
            application.applicationImageUrl ||
            "https://via.placeholder.com/60?text=User"
          }
          alt={application.name}
          className="application-avatar"
        />

        <div className="application-details">
          <p className="application-name">
            {application.name || "Unknown Name"}
          </p>
          <p className="application-department">
            {application.department || "No Department"}
          </p>
        </div>
      </div>

      {application.createdAt && (
        <p className="application-date">
          {new Date(application.createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

export default ApplicantList;
