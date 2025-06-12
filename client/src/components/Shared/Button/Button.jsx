// src/components/Shared/Button/Button.jsx
import React from 'react';
import styles from './Button.module.css'; // Create this CSS module

const Button = ({ children, onClick, type = 'button', className = '', ...props }) => {
  return (
    <button type={type} className={`${styles.button} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

export default Button;