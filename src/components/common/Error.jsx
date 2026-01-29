import React from 'react';
import { Alert } from 'react-bootstrap';

const Error = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <Alert variant="danger" onClose={onClose} dismissible>
      {message}
    </Alert>
  );
};

export default Error;