import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children, instructorOnly = false }) => {
  const { user, loading, isInstructor } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (instructorOnly && !isInstructor) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PrivateRoute; 