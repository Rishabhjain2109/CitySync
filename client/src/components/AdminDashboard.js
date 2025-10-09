// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
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

  const handleMonthlyCSV = () => {
    const now = new Date();
    const year = now.getFullYear();
  
    // Filter complaints for selected month
    const monthlyComplaints = complaints.filter(c => {
      const createdAt = new Date(c.createdAt);
      return createdAt.getMonth() === Number(selectedMonth) && createdAt.getFullYear() === year;
    });
  
    if (monthlyComplaints.length === 0) {
      alert("No complaints found for this month!");
      return;
    }
  
    const statuses = ['pending', 'assigned', 'completed'];
    let csvContent = '';
  
    statuses.forEach(status => {
      const filtered = monthlyComplaints.filter(c => c.status?.toLowerCase() === status);
      if (filtered.length === 0) return;
  
      csvContent += `Status: ${status.toUpperCase()}\n`;
      csvContent += 'ID,Title,Description,Status,Assigned Worker,Assigned Head\n';
  
      filtered.forEach(c => {
        const assignedWorkers = c.assignedWorkers?.length
          ? c.assignedWorkers.map(w => w.name).join('; ')
          : '-';
        const assignedHead = c.assignedWorkers?.length
          ? [...new Set(c.assignedWorkers.map(w => w.assignedHead?.name))].join('; ')
          : '-';
  
        csvContent += `"${c._id}","${c.title || ''}","${c.description || ''}","${c.status}","${assignedWorkers}","${assignedHead}"\n`;
      });
  
      csvContent += '\n';
    });
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const monthName = new Date(0, selectedMonth).toLocaleString('default', { month: 'long' });
    a.href = url;
    a.download = `complaints_${monthName}_${year}.csv`;
    a.click();
  }; 
  if (loading) return <div>Loading complaints...</div>;

  return (
    <div>
      <h2>Admin Dashboard - All Complaints</h2>

      <div style={{ marginBottom: '15px' }}>
  <label>Select Month: </label>
  <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
    {Array.from({ length: 12 }).map((_, i) => (
      <option key={i} value={i}>
        {new Date(0, i).toLocaleString('default', { month: 'long' })}
      </option>
    ))}
  </select>
  <button onClick={handleMonthlyCSV} style={{ marginLeft: '10px' }}>
    Download Monthly CSV
  </button>
</div>


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
