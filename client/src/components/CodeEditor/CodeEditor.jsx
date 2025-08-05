import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  Copy, 
  Download, 
  Upload, 
  Save,
  Settings,
  Maximize,
  Minimize
} from 'lucide-react';
import styles from './CodeEditor.module.css';

const CodeEditor = ({ 
  initialCode = '// Добро пожаловать в JavaScript песочницу!\n// Напишите ваш код здесь\n\nconsole.log("Привет, мир!");\n\n// Примеры:\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconsole.log("Удвоенные числа:", doubled);\n\n// Попробуйте создать функцию\nfunction greet(name) {\n  return `Привет, ${name}!`;\n}\n\nconsole.log(greet("Пользователь"));',
  onCodeChange,
  onRun,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const [code, setCode] = useState(initialCode);
  const [isRunning, setIsRunning] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (onCodeChange) {
      onCodeChange(code);
    }
  }, [code, onCodeChange]);

  const handleCodeChange = (e) => {
    setCode(e.target.value);
  };

  const handleRun = async () => {
    if (onRun) {
      setIsRunning(true);
      try {
        await onRun(code);
      } finally {
        setIsRunning(false);
      }
    }
  };

  const handleReset = () => {
    setCode(initialCode);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      // Можно добавить уведомление об успешном копировании
    } catch (err) {
      console.error('Ошибка при копировании:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem('jsSandboxCode', code);
    // Можно добавить уведомление об успешном сохранении
  };

  const handleLoad = () => {
    const savedCode = localStorage.getItem('jsSandboxCode');
    if (savedCode) {
      setCode(savedCode);
    }
  };

  const handleKeyDown = (e) => {
    // Автоматическая вставка отступов при нажатии Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      setCode(newCode);
      
      // Устанавливаем курсор после вставленного отступа
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <motion.div 
      className={`${styles.codeEditor} ${isFullscreen ? styles.fullscreen : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={styles.toolbar}>
        <div className={styles.toolbarLeft}>
          <button 
            className={`${styles.toolbarButton} ${styles.runButton}`}
            onClick={handleRun}
            disabled={isRunning}
          >
            <Play size={16} />
            {isRunning ? 'Выполняется...' : 'Запустить'}
          </button>
          
          <button 
            className={styles.toolbarButton}
            onClick={handleReset}
            title="Сбросить код"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        <div className={styles.toolbarRight}>
          <button 
            className={styles.toolbarButton}
            onClick={handleSave}
            title="Сохранить в localStorage"
          >
            <Save size={16} />
          </button>
          
          <button 
            className={styles.toolbarButton}
            onClick={handleLoad}
            title="Загрузить из localStorage"
          >
            <Upload size={16} />
          </button>
          
          <label className={styles.toolbarButton} title="Загрузить файл">
            <input
              type="file"
              accept=".js,.txt"
              onChange={handleUpload}
              style={{ display: 'none' }}
            />
            <Upload size={16} />
          </label>
          
          <button 
            className={styles.toolbarButton}
            onClick={handleDownload}
            title="Скачать код"
          >
            <Download size={16} />
          </button>
          
          <button 
            className={styles.toolbarButton}
            onClick={handleCopy}
            title="Копировать код"
          >
            <Copy size={16} />
          </button>
          
          <button 
            className={styles.toolbarButton}
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Выйти из полноэкранного режима" : "Полноэкранный режим"}
          >
            {isFullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
          </button>
        </div>
      </div>

      <div className={styles.editorContainer}>
        <textarea
          ref={textareaRef}
          className={styles.codeTextarea}
          value={code}
          onChange={handleCodeChange}
          onKeyDown={handleKeyDown}
          placeholder="// Напишите ваш JavaScript код здесь..."
          spellCheck={false}
        />
      </div>

      <div className={styles.editorInfo}>
        <span>JavaScript • Автосохранение отключено</span>
        <span>{code.length} символов</span>
      </div>
    </motion.div>
  );
};

export default CodeEditor; 