import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Alert,
  CircularProgress,
  Chip,
  Divider
} from '@mui/material';
import {
  Person as PersonIcon,
  Work as WorkIcon,
  Group as GroupIcon
} from '@mui/icons-material';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [workers, setWorkers] = useState([]);
  const [departmentInfo, setDepartmentInfo] = useState(null);
  const [assignedHead, setAssignedHead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user'));
    
    if (!token || !userData) {
      window.location.href = '/';
      return;
    }

    setUser(userData);
    loadUserData(userData);
  }, []);

  const loadUserData = async (userData) => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      if (userData.userType === 'departmentHead') {
        // Load workers and department info
        const [workersResponse, departmentResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/users/workers', config),
          axios.get('http://localhost:5000/api/users/department-info', config)
        ]);
        
        setWorkers(workersResponse.data.workers);
        setDepartmentInfo(departmentResponse.data);
      } else if (userData.userType === 'worker') {
        // Load assigned head info
        const headResponse = await axios.get('http://localhost:5000/api/users/assigned-head', config);
        setAssignedHead(headResponse.data.assignedHead);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const getDepartmentDisplayName = (department) => {
    const departmentNames = {
      sewage: 'Sewage Management',
      garbage: 'Garbage Collection',
      road: 'Road Maintenance',
      water: 'Water Supply',
      electricity: 'Electricity'
    };
    return departmentNames[department] || department;
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Welcome, {user?.name}!
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {getDepartmentDisplayName(user?.department)} - {user?.userType === 'departmentHead' ? 'Department Head' : 'Worker'}
            </Typography>
          </Box>
          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        {/* Department Head Dashboard */}
        {user?.userType === 'departmentHead' && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Department Management
            </Typography>
            
            {/* Department Info */}
            {departmentInfo && (
              <Card sx={{ mb: 3 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Department Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Department:</strong> {getDepartmentDisplayName(departmentInfo.department)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Head:</strong> {departmentInfo.headName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Enrollment Number:</strong> {departmentInfo.enrollmentNumber}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body1">
                        <strong>Workers Count:</strong> {workers.length}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* Workers List */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Workers Under Your Department
            </Typography>
            
            {workers.length === 0 ? (
              <Alert severity="info">
                No workers are currently assigned to your department.
              </Alert>
            ) : (
              <Grid container spacing={2}>
                {workers.map((worker) => (
                  <Grid item xs={12} sm={6} md={4} key={worker._id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <PersonIcon sx={{ mr: 1, color: 'primary.main' }} />
                          <Typography variant="h6">
                            {worker.name}
                          </Typography>
                        </Box>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Phone:</strong> {worker.phone}
                        </Typography>
                        
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          <strong>Address:</strong> {worker.address}
                        </Typography>
                        
                        <Box sx={{ mt: 2 }}>
                          <Chip 
                            label={worker.isActive ? 'Active' : 'Inactive'} 
                            color={worker.isActive ? 'success' : 'default'}
                            size="small"
                          />
                        </Box>
                        
                        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                          Enrollment: {worker.enrollmentNumber}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

        {/* Worker Dashboard */}
        {user?.userType === 'worker' && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Worker Dashboard
            </Typography>
            
            {/* Worker Info */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Your Information
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Name:</strong> {user.name}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Department:</strong> {getDepartmentDisplayName(user.department)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Enrollment Number:</strong> {user.enrollmentNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body1">
                      <strong>Phone:</strong> {user.phone}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Assigned Head Info */}
            {assignedHead && (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Your Department Head
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                    <Typography variant="h6">
                      {assignedHead.name}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    <strong>Department:</strong> {getDepartmentDisplayName(assignedHead.department)}
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary">
                    <strong>Enrollment Number:</strong> {assignedHead.enrollmentNumber}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        )}

        {/* Citizen Dashboard */}
        {user?.userType === 'citizen' && (
          <Box>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
              Citizen Dashboard
            </Typography>
            
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Welcome to CitySync!
                </Typography>
                <Typography variant="body1" paragraph>
                  You can now report complaints and track their status. Use the navigation menu to:
                </Typography>
                <Box component="ul" sx={{ pl: 2 }}>
                  <li>Submit new complaints</li>
                  <li>View your complaint history</li>
                  <li>Track complaint status</li>
                  <li>Rate completed services</li>
                </Box>
              </CardContent>
            </Card>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Dashboard;
