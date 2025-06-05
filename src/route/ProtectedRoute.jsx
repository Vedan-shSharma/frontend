import React from 'react';
import { useAuth } from "../Context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  const location = useLocation();

  // If no user is logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user's role is not in allowedRoles, redirect to appropriate dashboard
  if (!allowedRoles.includes(user.role)) {
    if (user.role === "Student") {
      return <Navigate to="/student" replace />;
    } else if (user.role === "Instructor") {
      return <Navigate to="/instructor" replace />;
    }
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated and has correct role, render children
  return children;
};

export default ProtectedRoute;
