import React from 'react'
import ComplaintCard from './BasicComponents/CompaintCard/ComplaintCard';


const complaints = [
  {
    id: 101,
    description: "Water leakage in bathroom",
    address: "123 Main Street, City",
    date: "2025-10-04",
    status: "Pending"
  },
  {
    id: 102,
    description: "Street light not working",
    address: "45 Park Avenue, City",
    date: "2025-10-03",
    status: "In Progress"
  },
  {
    id: 103,
    description: "Garbage not collected",
    address: "78 Oak Street, City",
    date: "2025-09-30",
    status: "Resolved"
  }
];

const Complaints = () => {
  return (
    <div style={{ padding: "20px" }}>
      {complaints.map((c) => (
        <ComplaintCard key={c.id} complaint={c} />
      ))}
    </div>
  )
}

export default Complaints