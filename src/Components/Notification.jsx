import React, { useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { BiCheckCircle, BiXCircle, BiInfoCircle } from 'react-icons/bi';

const Notification = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <BiCheckCircle size={20} className="me-2" />;
      case 'error':
        return <BiXCircle size={20} className="me-2" />;
      default:
        return <BiInfoCircle size={20} className="me-2" />;
    }
  };

  return (
    <ToastContainer 
      position="top-end" 
      className="p-3"
      style={{ zIndex: 1050 }}
    >
      <Toast 
        show={true} 
        onClose={onClose}
        bg={type}
        className="text-white"
        autohide
        delay={duration}
      >
        <Toast.Header 
          closeButton 
          className={`bg-${type} text-white border-0`}
        >
          <div className="d-flex align-items-center">
            {getIcon()}
            <strong className="me-auto">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </strong>
          </div>
        </Toast.Header>
        <Toast.Body className="text-white">
          {message}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default Notification; 