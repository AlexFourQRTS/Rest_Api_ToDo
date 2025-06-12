import React from 'react';
import styles from './PageWrap.module.css';

const PageWrap = ({ children}) => {
  return (
    <div className={styles.pageWrap}>
      <div className={styles.content}>
        {children}
      </div>
     
    </div>
  );
};

export default PageWrap;