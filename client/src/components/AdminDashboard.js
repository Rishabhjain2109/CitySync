// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('http://localhost:5000/api/admin/complaints', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setComplaints(res.data.complaints);
      } catch (err) {
        console.error(err);
        alert('Failed to fetch complaints. Make sure you are logged in as admin.');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  if (loading) return <div>Loading complaints...</div>;

  return (
    <div>
      <h2>Admin Dashboard - All Complaints</h2>
      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Status</th>
            <th>Assigned Worker</th>
            <th>Assigned Head</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(c => (
            <tr key={c._id}>
              <td>{c._id}</td>
              <td>{c.title}</td>
              <td>{c.description}</td>
              <td>{c.status}</td>
              <td>
  {c.assignedWorkers && c.assignedWorkers.length > 0 
    ? c.assignedWorkers.map(w => w.name).join(', ')
    : '-'}
</td>
<td>
  {c.assignedWorkers && c.assignedWorkers.length > 0
    ? [...new Set(c.assignedWorkers.map(w => w.assignedHead?.name))].join(', ')
    : '-'}
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
