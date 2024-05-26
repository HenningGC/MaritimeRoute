import React from 'react';
import '../Css/Spinner.css';

const Spinner = () => {
  return (
    <div className="spinner-container">
      <div className="spinner-text">Routing...</div>
      <div className="spinner-icon"></div>
    </div>
  );
};

export default Spinner;