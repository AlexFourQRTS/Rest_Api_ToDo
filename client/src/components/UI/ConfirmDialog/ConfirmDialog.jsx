import React from 'react';
import styles from './ConfirmDialog.module.css';

const ConfirmDialog = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.dialog}>
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
          <div className={styles.actions}>
            <button 
              className={`${styles.button} ${styles.cancel}`}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button 
              className={`${styles.button} ${styles.confirm}`}
              onClick={onConfirm}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 