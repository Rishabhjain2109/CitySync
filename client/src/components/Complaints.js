import React, { useEffect, useState } from 'react'
import ComplaintCard from './BasicComponents/CompaintCard/ComplaintCard';
import axios from 'axios';


const Complaints = () => {

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const fetchComplaints = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/users/assigned-complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data.complaints || []);
    }
    fetchComplaints();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {complaints.map((c) => (
        <ComplaintCard key={c._id} complaint={c} />
      ))}
    </div>
  )
}

export default Complaints