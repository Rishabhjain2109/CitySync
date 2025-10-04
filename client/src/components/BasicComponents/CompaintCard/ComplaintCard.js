import React from "react";
import { FiCheck } from "react-icons/fi";
import "./ComplaintCard.css";

const ComplaintCard = ({ complaint }) => {
  const { id, description, address, date, status } = complaint;

  const steps = ["Pending", "In Progress", "Resolved"];
  const currentStep = steps.indexOf(status);

  return (
    <div className="complaint-card">
      <h3 className="card-id">Complaint #{id}</h3>
      <p className="card-description">{description}</p>
      <p className="card-address"><strong>Address:</strong> {address}</p>
      <p className="card-date"><strong>Submitted:</strong> {date}</p>

      {/* Amazon-style tracker */}
      <div className="amazon-tracker">
        {steps.map((step, index) => (
          <div key={index} className="tracker-step">
            <div
              className={`tracker-circle ${
                index <= currentStep ? "completed" : ""
              }`}
            >
              {index < currentStep ? <FiCheck color="white" /> : index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`tracker-line ${
                  index < currentStep ? "completed" : ""
                }`}
              />
            )}
            <span
              className={`tracker-label ${
                index === currentStep ? "current" : ""
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintCard;
