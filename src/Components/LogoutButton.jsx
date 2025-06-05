// src/Components/LogoutButton.jsx
import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import { BiLogOut } from "react-icons/bi";

function LogoutButton({ variant = "outline-danger", size, className, children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Clear user data
      logout();
      
      // Clear storage
      localStorage.removeItem('user');
      sessionStorage.clear();
      
      // Replace the current history entry with login page
      // This prevents going back to the previous page after logout
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login', { replace: true });
    }
  };

  return (
    <Button 
      onClick={handleLogout} 
      variant={variant}
      size={size}
      className={`d-inline-flex align-items-center gap-2 ${className || ''}`}
    >
      <BiLogOut />
      {children || 'Logout'}
    </Button>
  );
}

export default LogoutButton;