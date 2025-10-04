import React from 'react'
import { useEffect, useState } from 'react'
import CitizenDashboard from './CitizenDashboard';

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
    <div>
        {user.userType === 'citizen'?(<CitizenDashboard/>):(<div>Unauthorized or invalid user type</div>)}
    </div>
  )
}

export default Dashboard