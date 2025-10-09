import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';

import './App.css';
import Header from './components/Header';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    // return true;
    return !!token;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header/>
      <Router>
        <div className="App">
          <Routes>
            <Route 
              path="/" 
              element={isAuthenticated() ? <Navigate to="/dashboard" /> : <AuthPage />} 
            />
            <Route 
              path="/dashboard" 
              element={isAuthenticated() ? <Dashboard /> : <Navigate to="/" />} 
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={ localStorage.getItem('adminToken') ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
