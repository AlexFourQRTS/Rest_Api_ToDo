import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePaintState } from '../hooks/usePaintState';
import ModalHeader from './ModalHeader';
import LeftPanel from './LeftPanel';
import CanvasArea from './CanvasArea';
import RightPanel from './RightPanel';
import BlockNameModal from './BlockNameModal';
import ColorPicker from './ColorPicker';
import styles from '../Paint.module.css';

const PaintModal = ({ onClose }) => {
  const paintState = usePaintState();

  // Устанавливаем глобальные функции для зума
  useEffect(() => {
    window.paintZoomIn = paintState.handleZoomIn;
    window.paintZoomOut = paintState.handleZoomOut;
    
    return () => {
      delete window.paintZoomIn;
      delete window.paintZoomOut;
    };
  }, [paintState.handleZoomIn, paintState.handleZoomOut]);

  return (
    <motion.div 
      className={styles.modal}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <ModalHeader 
        canvasSizes={paintState.canvasSizes}
        canvasSize={paintState.canvasSize}
        changeCanvasSize={paintState.changeCanvasSize}
        gridEnabled={paintState.gridEnabled}
        setGridEnabled={paintState.setGridEnabled}
        snapToGrid={paintState.snapToGrid}
        setSnapToGrid={paintState.setSnapToGrid}
        clearCanvas={paintState.clearCanvas}
        onClose={onClose}
      />

      <div className={styles.modalContent}>
        <LeftPanel 
          addBlock={paintState.addBlock}
          tool={paintState.tool}
          setTool={paintState.setTool}
          flowchartBlocks={paintState.flowchartBlocks}
          arrows={paintState.arrows}
          zoom={paintState.zoom}
        />

        <CanvasArea 
          canvasSize={paintState.canvasSize}
          gridEnabled={paintState.gridEnabled}
          snapToGrid={paintState.snapToGrid}
          tool={paintState.tool}
          zoom={paintState.zoom}
          pan={paintState.pan}
          setPan={paintState.updatePan}
          flowchartBlocks={paintState.flowchartBlocks}
          arrows={paintState.arrows}
          currentArrow={paintState.currentArrow}
          isDrawing={paintState.isDrawing}
          startDrawingArrow={paintState.startDrawingArrow}
          updateArrow={paintState.updateArrow}
          finishDrawingArrow={paintState.finishDrawingArrow}
          isDragging={paintState.isDragging}
          draggedElement={paintState.draggedElement}
          startDragging={paintState.startDragging}
          updateDragging={paintState.updateDragging}
          stopDragging={paintState.stopDragging}
          toggleElementLock={paintState.toggleElementLock}
          showColorPicker={paintState.showColorPicker}
          deleteElement={paintState.deleteElement}
          rainbowColors={paintState.rainbowColors}
        />

        <RightPanel 
          zoom={paintState.zoom}
          handleZoomIn={paintState.handleZoomIn}
          handleZoomOut={paintState.handleZoomOut}
          handleZoomReset={paintState.handleZoomReset}
        />
      </div>

      {paintState.showBlockNameInput && (
        <BlockNameModal 
          blockName={paintState.blockName}
          setBlockName={paintState.setBlockName}
          onSubmit={paintState.handleBlockNameSubmit}
          onCancel={paintState.handleBlockNameCancel}
        />
      )}

      <ColorPicker 
        isVisible={paintState.colorPickerVisible}
        position={paintState.colorPickerPosition}
        onColorSelect={paintState.selectBlockColor}
        onClose={paintState.hideColorPicker}
        rainbowColors={paintState.rainbowColors}
      />
    </motion.div>
  );
};

export default PaintModal; 