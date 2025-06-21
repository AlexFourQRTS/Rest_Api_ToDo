import React, { useRef, useEffect } from 'react';
import styles from '../Paint.module.css';

const CanvasArea = ({ 
  canvasSize, 
  gridEnabled, 
  snapToGrid, 
  tool, 
  zoom, 
  pan, 
  setPan,
  flowchartBlocks,
  arrows,
  currentArrow,
  isDrawing,
  startDrawingArrow,
  updateArrow,
  finishDrawingArrow,
  isDragging,
  draggedElement,
  startDragging,
  updateDragging,
  stopDragging,
  toggleElementLock,
  showColorPicker,
  deleteElement,
  rainbowColors
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Очищаем холст
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Применяем трансформации
    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    // Рисуем сетку если включена
    if (gridEnabled) {
      drawGrid(ctx, canvas.width, canvas.height);
    }

    // Рисуем блоки
    flowchartBlocks.forEach(block => {
      drawBlock(ctx, block);
    });

    // Рисуем стрелки
    arrows.forEach(arrow => {
      drawArrow(ctx, arrow);
    });

    // Рисуем текущую стрелку
    if (currentArrow) {
      drawArrow(ctx, currentArrow, true);
    }

    ctx.restore();
  }, [canvasSize, gridEnabled, zoom, pan, flowchartBlocks, arrows, currentArrow]);

  const drawGrid = (ctx, width, height) => {
    const gridSize = 20;
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 0.5;
    
    for (let x = 0; x <= width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  };

  const drawBlock = (ctx, block) => {
    const { x, y, width, height, type, name, locked, colorIndex } = block;
    
    // Получаем цвет из радужной палитры
    const blockColor = rainbowColors[colorIndex % rainbowColors.length];
    const borderColor = locked ? '#4CAF50' : blockColor;
    
    // Цвет блока в зависимости от состояния
    ctx.fillStyle = blockColor;
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = 2;

    // Рисуем блок в зависимости от типа
    switch (type) {
      case 'start':
      case 'end':
        // Овальный блок
        ctx.beginPath();
        ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      case 'decision':
        // Ромб
        ctx.beginPath();
        ctx.moveTo(x + width/2, y);
        ctx.lineTo(x + width, y + height/2);
        ctx.lineTo(x + width/2, y + height);
        ctx.lineTo(x, y + height/2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      default:
        // Прямоугольный блок
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    // Рисуем текст
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, x + width/2, y + height/2);
  };

  const drawArrow = (ctx, arrow, isPreview = false) => {
    const { startX, startY, endX, endY, locked } = arrow;
    
    ctx.strokeStyle = locked ? '#4CAF50' : (isPreview ? '#ff6b35' : '#ff6b35');
    ctx.lineWidth = isPreview ? 2 : 3;
    
    // Рисуем линию
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
    
    // Рисуем стрелку
    const angle = Math.atan2(endY - startY, endX - startX);
    const arrowLength = 15;
    const arrowAngle = Math.PI / 6;
    
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle - arrowAngle),
      endY - arrowLength * Math.sin(angle - arrowAngle)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - arrowLength * Math.cos(angle + arrowAngle),
      endY - arrowLength * Math.sin(angle + arrowAngle)
    );
    ctx.stroke();
  };

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left - pan.x) / zoom;
    const y = (e.clientY - rect.top - pan.y) / zoom;
    return { x, y };
  };

  const snapToGridPoint = (point) => {
    if (!snapToGrid) return point;
    const gridSize = 20;
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  };

  const findElementAtPoint = (point) => {
    // Проверяем блоки (в обратном порядке для правильного порядка наложения)
    for (let i = flowchartBlocks.length - 1; i >= 0; i--) {
      const block = flowchartBlocks[i];
      if (point.x >= block.x && point.x <= block.x + block.width &&
          point.y >= block.y && point.y <= block.y + block.height) {
        return { type: 'block', element: block };
      }
    }
    
    // Проверяем стрелки
    for (let i = arrows.length - 1; i >= 0; i--) {
      const arrow = arrows[i];
      const distance = distanceToLine(point, arrow);
      if (distance < 10) {
        return { type: 'arrow', element: arrow };
      }
    }
    
    return null;
  };

  const distanceToLine = (point, arrow) => {
    const { startX, startY, endX, endY } = arrow;
    const A = point.x - startX;
    const B = point.y - startY;
    const C = endX - startX;
    const D = endY - startY;
    
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    
    if (lenSq !== 0) param = dot / lenSq;
    
    let xx, yy;
    if (param < 0) {
      xx = startX;
      yy = startY;
    } else if (param > 1) {
      xx = endX;
      yy = endY;
    } else {
      xx = startX + param * C;
      yy = startY + param * D;
    }
    
    const dx = point.x - xx;
    const dy = point.y - yy;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleMouseDown = (e) => {
    const coords = getCanvasCoordinates(e);
    const snappedCoords = snapToGridPoint(coords);
    
    if (e.button === 2) {
      // Правая кнопка мыши - удаление элемента
      e.preventDefault();
      const element = findElementAtPoint(coords);
      if (element) {
        deleteElement(element.type, element.element.id);
      }
      return;
    }
    
    if (e.button === 0 && e.ctrlKey) {
      // Ctrl+левая кнопка - панорамирование
      setPan(prev => ({ ...prev, isPanning: true, startX: e.clientX, startY: e.clientY }));
      return;
    }
    
    // Проверяем, не кликнули ли мы по элементу для перетаскивания
    const element = findElementAtPoint(coords);
    if (element) {
      const offset = {
        x: coords.x - (element.type === 'block' ? element.element.x : element.element.startX),
        y: coords.y - (element.type === 'block' ? element.element.y : element.element.startY)
      };
      startDragging({ type: element.type, id: element.element.id }, offset);
      return;
    }
    
    // Если не перетаскиваем элемент и активен инструмент стрелки
    if (tool === 'arrow') {
      startDrawingArrow(snappedCoords);
    }
  };

  const handleMouseMove = (e) => {
    const coords = getCanvasCoordinates(e);
    const snappedCoords = snapToGridPoint(coords);
    
    // Панорамирование только с Ctrl+левая кнопка
    if (pan.isPanning && e.ctrlKey) {
      const deltaX = e.clientX - pan.startX;
      const deltaY = e.clientY - pan.startY;
      setPan(prev => ({ 
        x: prev.x + deltaX, 
        y: prev.y + deltaY,
        isPanning: true,
        startX: e.clientX,
        startY: e.clientY
      }));
      return;
    }
    
    // Перетаскивание элементов
    if (isDragging) {
      updateDragging(snappedCoords);
      return;
    }
    
    // Рисование стрелки только если активен инструмент стрелки
    if (isDrawing && tool === 'arrow') {
      updateArrow(snappedCoords);
    }
  };

  const handleMouseUp = (e) => {
    // Завершение панорамирования
    if (pan.isPanning) {
      setPan(prev => ({ x: prev.x, y: prev.y }));
      return;
    }
    
    // Завершение перетаскивания
    if (isDragging) {
      stopDragging();
      return;
    }
    
    // Завершение рисования стрелки только если активен инструмент стрелки
    if (isDrawing && tool === 'arrow') {
      finishDrawingArrow();
    }
  };

  const handleDoubleClick = (e) => {
    const coords = getCanvasCoordinates(e);
    const element = findElementAtPoint(coords);
    
    if (element) {
      if (element.type === 'block') {
        // Для блоков - показываем ColorPicker
        const position = {
          x: e.clientX,
          y: e.clientY
        };
        showColorPicker(element.element.id, position);
      } else if (element.type === 'arrow') {
        // Для стрелок - блокируем/разблокируем
        toggleElementLock(element.type, element.element.id);
      }
    }
  };

  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      // Зум будет обрабатываться в родительском компоненте через пропсы
      if (delta > 1) {
        // Увеличить зум
        if (typeof window !== 'undefined' && window.paintZoomIn) {
          window.paintZoomIn();
        }
      } else {
        // Уменьшить зум
        if (typeof window !== 'undefined' && window.paintZoomOut) {
          window.paintZoomOut();
        }
      }
    }
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  return (
    <div className={styles.canvasArea}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        style={{ cursor: tool === 'arrow' ? 'crosshair' : 'default' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
      />
    </div>
  );
};

export default CanvasArea; 