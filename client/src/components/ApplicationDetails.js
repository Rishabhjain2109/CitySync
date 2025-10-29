import React, { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "./css/ApplicationDetails.css";
import Button from "./BasicComponents/Button/Button";

const ApplicationDetails = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const [application, setApplication] = useState(state?.application || null);
  const [loading, setLoading] = useState(!state?.application);

  useEffect(() => {
    if (!application) {
      const fetchApplication = async () => {
        try {
          setLoading(true);
          const token = localStorage.getItem("adminToken");
          const res = await axios.get(
            `http://localhost:5000/api/application/get-application/${id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          setApplication(res.data.data);
        } catch (error) {
          console.error(error);
          alert("Failed to fetch application details.");
        } finally {
          setLoading(false);
        }
      };
      fetchApplication();
    }
  }, [id, application]);

  if (loading) return <p className="loading-text">Loading application details...</p>;
  if (!application) return <p className="error-text">No application found.</p>;

  return (
    <div className="application-details">
      <button onClick={() => navigate(-1)} className="back-button">
        ← Back
      </button>

      <div className="details-card">
        <h2 className="details-title">{application.name}</h2>
        <p><strong>Email:</strong> {application.email}</p>
        <p><strong>Phone:</strong> {application.mobileNumber}</p>
        <p><strong>Address:</strong> {application.address}</p>
        <p><strong>Department:</strong> {application.department}</p>
        <p>
          <strong>Submitted:</strong>{" "}
          {new Date(application.createdAt).toLocaleString()}
        </p>
      </div>

      {/* 🪪 Government ID Section */}
      {application.govtIdImage && (
        <div className="image-section">
          <h3 className="section-title">Government ID</h3>
          <Zoom>
            <img
              src={application.govtIdImage}
              alt="Government ID"
              className="application-image"
            />
          </Zoom>
        </div>
      )}

      {/* 📝 ID Image */}
      {application.govtIdUrl && (
        <div className="image-section">
          <h3 className="section-title">ID Image</h3>
          <Zoom>
            <img
              src={application.govtIdUrl}
              alt="ID"
              className="application-image"
            />
          </Zoom>
        </div>
      )}

      {/* 📄 Application Image */}
      {application.applicationImageUrl && (
        <div className="image-section">
          <h3 className="section-title">Application Image</h3>
          <Zoom>
            <img
              src={application.applicationImageUrl}
              alt="Application"
              className="application-image"
            />
          </Zoom>
        </div>
      )}
      <Button>
        Approve Application
      </Button>

      <Button>
        Reject Application
      </Button>
    </div>
  );
};

export default ApplicationDetails;
