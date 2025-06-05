import React from 'react';
import LogoutButton from './LogoutButton';

const StudentLogoutButton = () => {
  return (
    <div className="p-2">
      <LogoutButton 
        variant="danger"
        className="w-100"
        style={{ backgroundColor: '#e91e63', borderColor: '#e91e63' }}
      >
        Logout
      </LogoutButton>
    </div>
  );
};

export default StudentLogoutButton; 