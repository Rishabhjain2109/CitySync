import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Tabs,
  Tab,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import axios from 'axios';

const AuthPage = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Citizen form state
  const [citizenForm, setCitizenForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });

  // Department Head form state
  const [headForm, setHeadForm] = useState({
    enrollmentNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Worker form state
  const [workerForm, setWorkerForm] = useState({
    enrollmentNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    userType: 'citizen',
    email: '',
    enrollmentNumber: '',
    password: ''
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMessage('');
    setError('');
  };

  const handleCitizenChange = (e) => {
    setCitizenForm({
      ...citizenForm,
      [e.target.name]: e.target.value
    });
  };

  const handleHeadChange = (e) => {
    setHeadForm({
      ...headForm,
      [e.target.name]: e.target.value
    });
  };

  const handleWorkerChange = (e) => {
    setWorkerForm({
      ...workerForm,
      [e.target.name]: e.target.value
    });
  };


  const handleCitizenSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (citizenForm.password !== citizenForm.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup/citizen', {
        name: citizenForm.name,
        email: citizenForm.email,
        password: citizenForm.password,
        phone: citizenForm.phone,
        address: citizenForm.address
      });

      setMessage('Citizen registered successfully!');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleHeadSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (headForm.password !== headForm.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup/head', {
        enrollmentNumber: headForm.enrollmentNumber,
        password: headForm.password
      });

      setMessage('Department Head registered successfully!');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleWorkerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    if (workerForm.password !== workerForm.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup/worker', {
        enrollmentNumber: workerForm.enrollmentNumber,
        password: workerForm.password
      });

      setMessage('Worker registered successfully!');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
    setLoading(false);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const loginData = {
        userType: loginForm.userType,
        password: loginForm.password
      };

      // Add appropriate identifier based on user type
      if (loginForm.userType === 'citizen') {
        loginData.email = loginForm.email;
      } else {
        loginData.enrollmentNumber = loginForm.enrollmentNumber;
      }

      const response = await axios.post('http://localhost:5000/api/auth/login', loginData);

      setMessage('Login successful!');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      // Redirect to dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          CitySync - Municipal Management System
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} centered>
            <Tab label="Login" />
            <Tab label="Citizen Signup" />
            <Tab label="Department Head Signup" />
            <Tab label="Worker Signup" />
          </Tabs>
        </Box>

        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Login Form */}
        {tabValue === 0 && (
          <form onSubmit={handleLoginSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Login As</InputLabel>
                  <Select
                    value={loginForm.userType}
                    label="Login As"
                    onChange={(e) => setLoginForm({...loginForm, userType: e.target.value})}
                  >
                    <MenuItem value="citizen">Citizen</MenuItem>
                    <MenuItem value="worker">Worker</MenuItem>
                    <MenuItem value="departmentHead">Department Head</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              {loginForm.userType === 'citizen' ? (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                    required
                    helperText="Enter your registered email address"
                  />
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Enrollment Number"
                    name="enrollmentNumber"
                    value={loginForm.enrollmentNumber}
                    onChange={(e) => setLoginForm({...loginForm, enrollmentNumber: e.target.value})}
                    required
                    helperText={`Enter your ${loginForm.userType === 'worker' ? 'worker' : 'department head'} enrollment number`}
                  />
                </Grid>
              )}
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Login'}
                </Button>
              </Grid>
            </Grid>
          </form>
        )}

        <Button onClick={()=> window.location.href = '/apply'}>Apply Online for Position</Button>
      </Paper>
    </Container>
  );
};

export default AuthPage;
