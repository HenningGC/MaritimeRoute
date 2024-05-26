// Textfield.js

import React, { useState } from 'react';

const Textfield = ({ label, type, name, value, onChange, className, placeholder, inputClassName }) => {
  const [isTyping, setIsTyping] = useState(false);

  const handleFocus = () => {
    setIsTyping(true);
  };

  const handleBlur = () => {
    if (value === '') {
      setIsTyping(false);
    }
  };

  return (
    <div className={`textfield ${className}`}>
      {label && <label htmlFor={name} className="textfield-label">{label}</label>}
      <div className="textfield-input-container">
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          className={`textfield-input ${inputClassName}`}
          placeholder={isTyping ? '' : placeholder}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default Textfield;