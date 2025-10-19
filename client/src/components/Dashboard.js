import React from 'react'
import { useEffect, useState } from 'react'
import CitizenDashboard from './CitizenDashboard';
import HeadDashboard from './HeadDashboard';
import WorkerDashboard from './WorkerDashboard';

const Dashboard = () => {

    const [user, setUser] = useState();

    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem('user'));
      
      if(!userData){
        window.location.href = '/';
      }

      setUser(userData);
    }, []);
    
    if (!user) {
        return <div>Loading...</div>;
    }
    
  return (
    <div style={{marginTop: '8.9vh'}}>
        {user.userType === 'citizen' && <CitizenDashboard/>}
        {user.userType === 'departmentHead' && <HeadDashboard/>}
        {user.userType === 'worker' && <WorkerDashboard/>}
    </div>
  )
}

export default Dashboard;