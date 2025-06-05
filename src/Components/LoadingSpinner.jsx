import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = ({ fullScreen = false, size = 'md', text = 'Loading...' }) => {
  const spinnerContent = (
    <div className="d-flex flex-column align-items-center justify-content-center p-4">
      <Spinner 
        animation="border" 
        variant="primary" 
        size={size}
        className="mb-3"
        style={{ color: '#1a73e8' }}
      />
      <div className="text-primary fw-medium">{text}</div>
    </div>
  );

  if (fullScreen) {
    return (
      <Container 
        fluid 
        className="min-vh-100 d-flex align-items-center justify-content-center bg-light bg-opacity-75 position-fixed top-0 start-0 w-100 h-100"
        style={{ zIndex: 9999 }}
      >
        {spinnerContent}
      </Container>
    );
  }

  return spinnerContent;
};

export default LoadingSpinner; 