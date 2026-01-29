import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

const Loader = ({ size = 40, color = '#007bff' }) => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100px' }}>
      <ThreeDots
        height={size}
        width={size}
        radius={9}
        color={color}
        ariaLabel="loading"
      />
    </div>
  );
};

export default Loader;