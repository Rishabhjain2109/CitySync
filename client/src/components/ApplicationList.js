import axios from 'axios';
import React, { useState } from 'react'
import { useEffect } from 'react';
import ApplicantList from './BasicComponents/ApplicantList/ApplicantList';

const ApplicationList = () => {
    const [applicationList, setApplicationList] = useState([]);
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
      const fetchApplication = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('http://localhost:5000/api/admin/get-applications',{
                headers: { Authorization: `Bearer ${token}`}
            });
            console.log(res.data.applications);
            
            setApplicationList(res.data.applications);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch applications. Make sure you are logged in as admin.');
        } finally {
            setLoading(false);
        }
      }

      fetchApplication();
    }, [])
    
    
  return (
    <>
    <div>
        {applicationList.length > 0 ? <h1>Application Requests</h1>:<h1>No Applications</h1>}
        {
          applicationList.map((app)=>{
            return <ApplicantList key={app._id} application={app}/>
          })
        }
    </div>
    </>
  )
}

export default ApplicationList