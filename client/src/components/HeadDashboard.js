import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from './BasicComponents/Button/Button';
import './css/HeadDashboard.css';
import ComplaintSearchFilter from "./ComplaintSearchFilter";
import HeadComplaintCard from './BasicComponents/HeadComplaintCard/HeadComplaintCard';
import WorkerCard from './BasicComponents/WorkerCard/WorkerCard';
import AssignedComplaintCard from './BasicComponents/CompaintCard/AssignedComplaintCard'; // 👈 import
import { checkSLA, getTimeRemaining, sortComplaintsBySLA } from "../utils/slaUtils";


const HeadDashboard = () => {
  const [showComplaints, setShowComplaints] = useState(false);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workers, setWorkers] = useState([]);
  const [showWorkers, setShowWorkers] = useState(false);
  const [complaintFilter, setComplaintFilter] = useState("pending");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("pending");
  const [filterArea, setFilterArea] = useState("");
  const [filterUrgency, setFilterUrgency] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const handleClearFilters = () => {
    setSearchQuery("");
    setFilterType("");
    setFilterArea("");
    setFilterUrgency("");
    setFilterDate("");
  };


  const token = localStorage.getItem("token");

  const handleViewComplaints = () => {
    setShowComplaints(true);
    setShowWorkers(false);
  };

  

  const fetchAllocatedWorkers = async () => {
    try {
      setLoading(true);
      
      // Get all unique worker IDs from complaints that have assigned workers
      const allWorkerIds = complaints
        .filter(complaint => complaint.assignedWorkers && complaint.assignedWorkers.length > 0)
        .flatMap(complaint => complaint.assignedWorkers)
        .filter((id, index, arr) => arr.indexOf(id) === index); // Remove duplicates
      
      if (allWorkerIds.length === 0) {
        setWorkers([]);
        setShowWorkers(true);
        setShowComplaints(false);
        return;
      }

      const res = await axios.get("http://localhost:5000/api/complaints/allocated-workers", {
        headers: { Authorization: `Bearer ${token}` },
        params: { workerIds: allWorkerIds.join(',') }
      });
      
      console.log(res.data);
      setWorkers(res.data.allocatedWorkers);
      setShowWorkers(true);
      setShowComplaints(false);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch allocated workers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);

        const res = await axios.get("http://localhost:5000/api/complaints/headComplaints", {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            search: searchQuery,
            date: filterDate,
            type: filterType,
            area: filterArea,
            urgency: filterUrgency,
          },
        });

        setComplaints(res.data.complaints);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchWorkers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/workers/get-workers",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWorkers(res.data.workers);
      } catch (err) {
        console.error(err);
      }
    };
    if (token) fetchComplaints();
    if (token) fetchWorkers();
  }, [token, filterType]);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <Button onClick={handleViewComplaints} className="sidebar-btn">
          View Complaints
        </Button>
        <Button onClick={fetchAllocatedWorkers} className="sidebar-btn">
          View Allocated Workers
        </Button>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <h1>Department Head Dashboard</h1>

        {loading && <p>Loading...</p>}

        {/* Complaints Section */}
        {showComplaints && (
          <div className="complaints-section">
            <div className="complaint-filter">
              <Button
                onClick={() => setFilterType("pending")}
                className={complaintFilter === "pending" ? "active" : ""}
              >
                Pending
              </Button>
              <Button
                onClick={() => setFilterType("assigned")}
                className={complaintFilter === "assigned" ? "active" : ""}
              >
                Assigned
              </Button>
              <Button
                onClick={() => setFilterType("resolved")}
                className={complaintFilter === "resolved" ? "active" : ""}
              >
                Resolved
              </Button>
            </div>

            <h2>
              {complaintFilter.charAt(0).toUpperCase() +
                complaintFilter.slice(1)}{" "}
              Complaints ({complaints.length})
            </h2>

            <ComplaintSearchFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              filterType={filterType}
              setFilterType={setFilterType}
              filterArea={filterArea}
              setFilterArea={setFilterArea}
              filterUrgency={filterUrgency}
              setFilterUrgency={setFilterUrgency}
              filterDate={filterDate}
              setFilterDate={setFilterDate}
              onClearFilters={handleClearFilters}
            />


            {complaints.length === 0 ? (
              <p>No {complaintFilter} complaints found.</p>
            ) :  (
              complaints.map((c) =>
                complaintFilter === "assigned" ? (
                  <AssignedComplaintCard key={c._id} complaint={c} />
                ) : (
                  <HeadComplaintCard
                    key={c._id}
                    complaint={c}
                    workers={workers}
                    setWorkers={setWorkers}
                  />
                )
              )
            )}
          </div>
        )}

        {/* Workers Section */}
        {showWorkers && !loading && (
          <div className="workers-section">
            <h2>Allocated Workers ({workers.length})</h2>
            {workers.length === 0 ? (
              <p>No allocated workers found.</p>
            ) : (
              workers.map((worker) => (
                <WorkerCard key={worker._id} worker={worker} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadDashboard;
