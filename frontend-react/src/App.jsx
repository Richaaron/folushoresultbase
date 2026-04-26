import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import api from './api';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import ParentDashboard from './pages/ParentDashboard';
import Broadsheet from './pages/Broadsheet';

const PrivateRoute = ({ children, roles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  useEffect(() => {
    const applySettings = async () => {
      try {
        const res = await api.get('/settings');
        const settings = res.data;
        if (settings) {
          document.documentElement.style.setProperty('--color-accent-gold', settings.primaryColor);
          document.documentElement.style.setProperty('--color-accent-red', settings.secondaryColor);
          // Also update brand colors if they are used
          document.documentElement.style.setProperty('--color-brand-400', settings.primaryColor);
        }
      } catch (error) {
        console.error('Failed to load global settings:', error);
      }
    };
    applySettings();
  }, []);

  return (
    <Router>
      <div className="min-h-screen w-full">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin/*" 
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/teacher/*" 
            element={
              <PrivateRoute roles={['TEACHER']}>
                <TeacherDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/parent/*" 
            element={
              <PrivateRoute roles={['PARENT']}>
                <ParentDashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/broadsheet" 
            element={
              <PrivateRoute roles={['ADMIN', 'TEACHER']}>
                <Broadsheet />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
