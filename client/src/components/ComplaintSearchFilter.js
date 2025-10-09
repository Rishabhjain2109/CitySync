import React from "react";
import "./css/ComplaintSearchFilter.css";

const ComplaintSearchFilter = ({
  searchQuery,
  setSearchQuery,
  filterType,
  setFilterType,
  filterArea,
  setFilterArea,
  filterUrgency,
  setFilterUrgency,
  filterDate,
  setFilterDate,
  onClearFilters,
}) => {
  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Search complaints..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="filter-input"
      />

      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="filter-select"
      >
        <option value="">All Types</option>
        <option value="electrical">Electrical</option>
        <option value="plumbing">Plumbing</option>
        <option value="cleaning">Cleaning</option>
        <option value="other">Other</option>
      </select>

      <select
        value={filterArea}
        onChange={(e) => setFilterArea(e.target.value)}
        className="filter-select"
      >
        <option value="">All Areas</option>
        <option value="hostel">Hostel</option>
        <option value="academic">Academic Block</option>
        <option value="canteen">Canteen</option>
        <option value="ground">Ground</option>
      </select>

      <select
        value={filterUrgency}
        onChange={(e) => setFilterUrgency(e.target.value)}
        className="filter-select"
      >
        <option value="">All Urgencies</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <input
        type="date"
        value={filterDate}
        onChange={(e) => setFilterDate(e.target.value)}
        className="filter-date"
      />

      <button onClick={onClearFilters} className="clear-btn">
        Clear Filters
      </button>
    </div>
  );
};

export default ComplaintSearchFilter;
