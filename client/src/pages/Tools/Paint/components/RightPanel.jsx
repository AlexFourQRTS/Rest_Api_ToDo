import React from 'react';
import { Plus, Minus } from 'lucide-react';
import styles from '../Paint.module.css';

const RightPanel = ({ zoom, handleZoomIn, handleZoomOut, handleZoomReset }) => {
  return (
    <div className={styles.rightPanel}>
      <div className={styles.zoomControls}>
        <button onClick={handleZoomOut} title="Уменьшить">
          <Minus size={16} />
        </button>
        <span className={styles.zoomLevel}>{Math.round(zoom * 100)}%</span>
        <button onClick={handleZoomIn} title="Увеличить">
          <Plus size={16} />
        </button>
        <button onClick={handleZoomReset} title="Сбросить">
          ⌂
        </button>
      </div>
    </div>
  );
};

export default RightPanel; 