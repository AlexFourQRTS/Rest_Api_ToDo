import { useState, useCallback } from 'react';

export const usePaintState = () => {
  // Состояние инструментов
  const [tool, setTool] = useState('select');
  
  // Состояние холста
  const [canvasSize, setCanvasSize] = useState({ width: 1920, height: 1080 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0, isPanning: false, startX: 0, startY: 0 });
  
  // Состояние сетки
  const [gridEnabled, setGridEnabled] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(false);
  
  // Состояние блоков и стрелок
  const [flowchartBlocks, setFlowchartBlocks] = useState([]);
  const [arrows, setArrows] = useState([]);
  
  // Состояние модального окна названия блока
  const [showBlockNameInput, setShowBlockNameInput] = useState(false);
  const [blockName, setBlockName] = useState('');
  const [pendingBlockType, setPendingBlockType] = useState(null);
  
  // Состояние рисования
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState({ x: 0, y: 0 });
  const [currentArrow, setCurrentArrow] = useState(null);
  
  // Состояние перетаскивания
  const [isDragging, setIsDragging] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Состояние ColorPicker
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [colorPickerPosition, setColorPickerPosition] = useState({ x: 0, y: 0 });
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  // Радужные цвета для блоков
  const rainbowColors = [
    '#ff0000', // Красный
    '#ff7f00', // Оранжевый
    '#ffff00', // Желтый
    '#00ff00', // Зеленый
    '#0000ff', // Синий
    '#4b0082', // Индиго
    '#9400d3'  // Фиолетовый
  ];

  // Размеры холста
  const canvasSizes = {
    'HD': { width: 1280, height: 720 },
    'FHD': { width: 1920, height: 1080 },
    '1.5K': { width: 2560, height: 1440 },
    '2K': { width: 2560, height: 1440 },
    '3K': { width: 3072, height: 1728 },
    '4K': { width: 3840, height: 2160 }
  };

  // Функции для работы с размерами холста
  const changeCanvasSize = useCallback((sizeKey) => {
    const newSize = canvasSizes[sizeKey];
    setCanvasSize(newSize);
  }, [canvasSizes]);

  // Функции для работы с зумом
  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(3, prev * 1.2));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(0.1, prev / 1.2));
  }, []);

  const handleZoomReset = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0, isPanning: false, startX: 0, startY: 0 });
  }, []);

  // Функции для работы с панорамированием
  const updatePan = useCallback((newPan) => {
    setPan(newPan);
  }, []);

  // Функции для работы с блоками
  const addBlock = useCallback((blockType) => {
    setPendingBlockType(blockType);
    setShowBlockNameInput(true);
  }, []);

  const handleBlockNameSubmit = useCallback(() => {
    if (pendingBlockType && blockName.trim()) {
      const newBlock = {
        id: Date.now(),
        type: pendingBlockType,
        name: blockName.trim(),
        x: 100,
        y: 100,
        width: 120,
        height: 60,
        locked: false,
        colorIndex: 0 // Начинаем с первого цвета
      };
      
      setFlowchartBlocks(prev => [...prev, newBlock]);
      setPendingBlockType(null);
      setBlockName('');
      setShowBlockNameInput(false);
    }
  }, [pendingBlockType, blockName]);

  const handleBlockNameCancel = useCallback(() => {
    setPendingBlockType(null);
    setBlockName('');
    setShowBlockNameInput(false);
  }, []);

  // Функция для изменения цвета блока
  const cycleBlockColor = useCallback((blockId) => {
    setFlowchartBlocks(prev => 
      prev.map(block => 
        block.id === blockId 
          ? { ...block, colorIndex: (block.colorIndex + 1) % rainbowColors.length }
          : block
      )
    );
  }, []);

  // Функции для работы с ColorPicker
  const showColorPicker = useCallback((blockId, position) => {
    setSelectedBlockId(blockId);
    setColorPickerPosition(position);
    setColorPickerVisible(true);
  }, []);

  const hideColorPicker = useCallback(() => {
    setColorPickerVisible(false);
    setSelectedBlockId(null);
  }, []);

  const selectBlockColor = useCallback((colorIndex) => {
    if (selectedBlockId) {
      setFlowchartBlocks(prev => 
        prev.map(block => 
          block.id === selectedBlockId 
            ? { ...block, colorIndex }
            : block
        )
      );
    }
  }, [selectedBlockId]);

  // Функции для работы со стрелками
  const startDrawingArrow = useCallback((point) => {
    setStartPoint(point);
    setIsDrawing(true);
    setCurrentArrow({
      startX: point.x,
      startY: point.y,
      endX: point.x,
      endY: point.y
    });
  }, []);

  const updateArrow = useCallback((point) => {
    if (currentArrow) {
      setCurrentArrow({
        ...currentArrow,
        endX: point.x,
        endY: point.y
      });
    }
  }, [currentArrow]);

  const finishDrawingArrow = useCallback(() => {
    if (currentArrow) {
      const newArrow = {
        id: Date.now(),
        startX: currentArrow.startX,
        startY: currentArrow.startY,
        endX: currentArrow.endX,
        endY: currentArrow.endY,
        locked: false
      };
      
      setArrows(prev => [...prev, newArrow]);
      setCurrentArrow(null);
    }
    setIsDrawing(false);
  }, [currentArrow]);

  // Функции для работы с перетаскиванием
  const startDragging = useCallback((element, offset) => {
    setIsDragging(true);
    setDraggedElement(element);
    setDragOffset(offset);
  }, []);

  const updateDragging = useCallback((point) => {
    if (isDragging && draggedElement) {
      // Обновляем позицию элемента
      if (draggedElement.type === 'block') {
        setFlowchartBlocks(prev => 
          prev.map(block => 
            block.id === draggedElement.id 
              ? { ...block, x: point.x - dragOffset.x, y: point.y - dragOffset.y }
              : block
          )
        );
      } else if (draggedElement.type === 'arrow') {
        setArrows(prev => 
          prev.map(arrow => 
            arrow.id === draggedElement.id 
              ? { ...arrow, startX: point.x - dragOffset.x, startY: point.y - dragOffset.y }
              : arrow
          )
        );
      }
    }
  }, [isDragging, draggedElement, dragOffset]);

  const stopDragging = useCallback(() => {
    setIsDragging(false);
    setDraggedElement(null);
    setDragOffset({ x: 0, y: 0 });
  }, []);

  // Функции для блокировки/разблокировки элементов
  const toggleElementLock = useCallback((elementType, elementId) => {
    if (elementType === 'block') {
      setFlowchartBlocks(prev => 
        prev.map(block => 
          block.id === elementId 
            ? { ...block, locked: !block.locked }
            : block
        )
      );
    } else if (elementType === 'arrow') {
      setArrows(prev => 
        prev.map(arrow => 
          arrow.id === elementId 
            ? { ...arrow, locked: !arrow.locked }
            : arrow
        )
      );
    }
  }, []);

  // Функции для удаления элементов
  const deleteElement = useCallback((elementType, elementId) => {
    if (elementType === 'block') {
      setFlowchartBlocks(prev => prev.filter(block => block.id !== elementId));
    } else if (elementType === 'arrow') {
      setArrows(prev => prev.filter(arrow => arrow.id !== elementId));
    }
  }, []);

  // Функция очистки холста
  const clearCanvas = useCallback(() => {
    setFlowchartBlocks([]);
    setArrows([]);
  }, []);

  return {
    // Состояние
    tool, setTool,
    canvasSize, setCanvasSize,
    zoom, setZoom,
    pan, setPan,
    gridEnabled, setGridEnabled,
    snapToGrid, setSnapToGrid,
    flowchartBlocks, setFlowchartBlocks,
    arrows, setArrows,
    showBlockNameInput, setShowBlockNameInput,
    blockName, setBlockName,
    pendingBlockType, setPendingBlockType,
    isDrawing, setIsDrawing,
    startPoint, setStartPoint,
    currentArrow, setCurrentArrow,
    isDragging, setIsDragging,
    draggedElement, setDraggedElement,
    dragOffset, setDragOffset,
    colorPickerVisible, setColorPickerVisible,
    colorPickerPosition, setColorPickerPosition,
    selectedBlockId, setSelectedBlockId,
    
    // Константы
    canvasSizes,
    rainbowColors,
    
    // Функции
    changeCanvasSize,
    handleZoomIn,
    handleZoomOut,
    handleZoomReset,
    updatePan,
    addBlock,
    handleBlockNameSubmit,
    handleBlockNameCancel,
    cycleBlockColor,
    startDrawingArrow,
    updateArrow,
    finishDrawingArrow,
    startDragging,
    updateDragging,
    stopDragging,
    toggleElementLock,
    deleteElement,
    clearCanvas,
    showColorPicker,
    hideColorPicker,
    selectBlockColor
  };
}; 