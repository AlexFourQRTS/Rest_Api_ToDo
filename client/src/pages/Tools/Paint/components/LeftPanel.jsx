import React from 'react';
import { ArrowRight, MousePointer } from 'lucide-react';
import styles from '../Paint.module.css';

const LeftPanel = ({ addBlock, tool, setTool, flowchartBlocks, arrows, zoom }) => {
  return (
    <div className={styles.leftPanel}>
      <h3>Блоки</h3>
      <div className={styles.blockTypes}>
        <button onClick={() => addBlock('start')}>START</button>
        <button onClick={() => addBlock('process')}>PROCESS</button>
        <button onClick={() => addBlock('decision')}>DECISION</button>
        <button onClick={() => addBlock('end')}>END</button>
      </div>
      
      <h3>Инструменты</h3>
      <div className={styles.tools}>
        <button 
          className={`${styles.toolButton} ${tool === 'select' ? styles.active : ''}`}
          onClick={() => setTool('select')}
        >
          <MousePointer size={20} />
          Выбор
        </button>
        <button 
          className={`${styles.toolButton} ${tool === 'arrow' ? styles.active : ''}`}
          onClick={() => setTool('arrow')}
        >
          <ArrowRight size={20} />
          Стрелка
        </button>
      </div>
      
      <div className={styles.info}>
        <p><strong>Блоков:</strong> {flowchartBlocks.length}</p>
        <p><strong>Стрелок:</strong> {arrows.length}</p>
        <p><strong>Масштаб:</strong> {Math.round(zoom * 100)}%</p>
        <p><strong>Инструмент:</strong> {tool === 'arrow' ? 'Стрелка' : 'Выбор'}</p>
        <p><strong>💡 Подсказка:</strong></p>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
          • Двойной клик по блоку = выбор цвета 🎨<br/>
          • Двойной клик по стрелке = блокировка 🔒<br/>
          • Правая кнопка = удаление 🗑️<br/>
          • Ctrl+левая кнопка = панорамирование 🖱️
        </p>
      </div>
    </div>
  );
};

export default LeftPanel; 