import React from 'react';
import styles from '../Paint.module.css';

const ColorPicker = ({ 
  isVisible, 
  position, 
  onColorSelect, 
  onClose, 
  rainbowColors 
}) => {
  if (!isVisible) return null;

  return (
    <>
      {/* Затемнение фона */}
      <div 
        className={styles.colorPickerOverlay}
        onClick={onClose}
      />
      
      {/* Меню выбора цвета */}
      <div 
        className={styles.colorPickerMenu}
        style={{
          left: position.x,
          top: position.y
        }}
      >
        <div className={styles.colorPickerHeader}>
          <span>Выберите цвет</span>
          <button 
            className={styles.colorPickerClose}
            onClick={onClose}
          >
            ×
          </button>
        </div>
        
        <div className={styles.colorPickerGrid}>
          {rainbowColors.map((color, index) => (
            <button
              key={index}
              className={styles.colorOption}
              style={{ backgroundColor: color }}
              onClick={() => {
                onColorSelect(index);
                onClose();
              }}
              title={`Цвет ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ColorPicker; 