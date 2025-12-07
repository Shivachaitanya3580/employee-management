import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, isPublic }) => {
  const isAuthenticated = localStorage.getItem("valid");

  if (isPublic) {
    return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
  } else {
    return isAuthenticated ? children : <Navigate to="/adminlogin" replace />;
  }
}

export default PrivateRoute;
