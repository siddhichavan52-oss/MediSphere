import React from 'react';
import { Navigate } from 'react-router-dom';

// Wraps a dashboard route so it requires the matching login/role instead of
// being open to anyone who types the URL directly (e.g. /admin-dashboard).
const AuthGuard = ({ role, children }) => {
  const userRole = localStorage.getItem('userRole');
  const userId = localStorage.getItem('userId');

  if (!userId || !userRole || userRole !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AuthGuard;
