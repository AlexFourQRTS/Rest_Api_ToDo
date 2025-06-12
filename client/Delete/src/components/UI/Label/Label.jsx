import React from 'react';
import styles from './label.module.css';

const Label = ({ children, htmlFor }) => {
  return (
    <label className={styles.label} htmlFor={htmlFor}>
      {children}
    </label>
  );
};

export default Label;