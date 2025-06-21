import React from 'react';
import { Download, Trash2, Grid, Settings, X } from 'lucide-react';
import styles from '../Paint.module.css';

const ModalHeader = ({ 
  canvasSizes, 
  canvasSize, 
  changeCanvasSize, 
  gridEnabled, 
  setGridEnabled, 
  snapToGrid, 
  setSnapToGrid, 
  clearCanvas,
  onClose 
}) => {
  return (
    <div className={styles.modalHeader}>
      <div className={styles.sizeSelector}>
        {Object.keys(canvasSizes).map(size => (
          <button 
            key={size} 
            onClick={() => changeCanvasSize(size)}
            className={`${styles.sizeButton} ${canvasSize.width === canvasSizes[size].width ? styles.active : ''}`}
          >
            {size}
          </button>
        ))}
      </div>
      
      <div className={styles.headerControls}>
        <button 
          className={`${styles.toolButton} ${gridEnabled ? styles.active : ''}`}
          onClick={() => setGridEnabled(!gridEnabled)}
          title="Сетка"
        >
          <Grid size={20} />
        </button>
        <button 
          className={`${styles.toolButton} ${snapToGrid ? styles.active : ''}`}
          onClick={() => setSnapToGrid(!snapToGrid)}
          disabled={!gridEnabled}
          title="Привязка к сетке"
        >
          <Settings size={20} />
        </button>
        <button 
          className={styles.toolButton}
          onClick={clearCanvas}
          title="Очистить"
        >
          <Trash2 size={20} />
        </button>
        <button 
          className={styles.toolButton}
          onClick={() => {/* Сохранить */}}
          title="Сохранить"
        >
          <Download size={20} />
        </button>
        <button 
          className={styles.closeButton}
          onClick={onClose}
          title="Закрыть"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default ModalHeader; 