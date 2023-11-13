import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';

const CustomToast = ({ type, message }) => {
  const icons = {
    success: faCheckCircle,
    error: faExclamationCircle,
    info: faInfoCircle,
  };

  const toastStyle = {
    backgroundColor: type === 'info' ? '#d63384' : '',
    color: 'white', 
    padding: '1rem',
    borderRadius: '0.25rem',
    display: 'flex',
    alignItems: 'center',
  };

  return (
    <div style={toastStyle}>
      <FontAwesomeIcon icon={icons[type]} style={{ marginRight: '0.5rem' }} />
      {message}
    </div>
  );
};

export default CustomToast;
