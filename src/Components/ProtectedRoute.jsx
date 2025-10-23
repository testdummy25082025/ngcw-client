import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !allowedRoles.includes(user.role.toLowerCase())) {
    return <Navigate to="/Login" replace />;
  }
  return children;
};

export default ProtectedRoute;
