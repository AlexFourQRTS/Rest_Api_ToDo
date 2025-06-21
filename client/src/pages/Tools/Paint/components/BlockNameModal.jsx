import React from 'react';
import styles from '../Paint.module.css';

const BlockNameModal = ({ blockName, setBlockName, onSubmit, onCancel }) => {
  return (
    <div className={styles.blockNameModal}>
      <div className={styles.blockNameContent}>
        <h3>Название блока</h3>
        <input
          type="text"
          value={blockName}
          onChange={(e) => setBlockName(e.target.value)}
          placeholder="Введите название..."
          autoFocus
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSubmit();
            }
          }}
        />
        <div className={styles.blockNameButtons}>
          <button onClick={onSubmit}>Добавить</button>
          <button onClick={onCancel}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default BlockNameModal; 