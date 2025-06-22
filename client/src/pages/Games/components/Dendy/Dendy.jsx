import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { loadRomFile } from '../../utils/romApi';
import styles from './Dendy.module.css';
import { getAllRoms, searchRoms, filterRomsByCategory } from '../../utils/romApi';

// Импортируем nes-js
import 'nes-js';

const Dendy = () => {
  const [nes, setNes] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState('');
  const [showGameList, setShowGameList] = useState(false);
  const [availableRoms, setAvailableRoms] = useState([]);
  const [filteredRoms, setFilteredRoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showControls, setShowControls] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);

  // Инициализация эмулятора
  useEffect(() => {
    const initEmulator = () => {
      // Проверяем, что NesJs доступен
      if (typeof window.NesJs === 'undefined') {
        console.error('NesJs не загружен');
        return;
      }

      const nesInstance = new window.NesJs.Nes();
      
      // Устанавливаем дисплей
      nesInstance.setDisplay(new window.NesJs.Display(canvasRef.current));
      
      // Устанавливаем аудио
      nesInstance.setAudio(new window.NesJs.Audio());
      
      // Настраиваем обработчики клавиш
      window.onkeydown = (e) => nesInstance.handleKeyDown(e);
      window.onkeyup = (e) => nesInstance.handleKeyUp(e);
      
      setNes(nesInstance);
      
      // Инициализируем аудио контекст
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
    };

    // Ждем загрузки NesJs
    const checkNesJs = () => {
      if (typeof window.NesJs !== 'undefined') {
        initEmulator();
      } else {
        setTimeout(checkNesJs, 100);
      }
    };
    
    checkNesJs();
    
    // Загружаем список доступных ROM'ов
    const loadRoms = async () => {
      try {
        const roms = await getAllRoms();
        setAvailableRoms(roms);
        setFilteredRoms(roms);
        toast.success(`Загружено ${roms.length} игр!`);
      } catch (error) {
        console.error('Ошибка загрузки списка ROM\'ов:', error);
        toast.error('Не удалось загрузить список игр');
      }
    };

    loadRoms();
  }, []);

  // Фильтрация игр
  useEffect(() => {
    let filtered = availableRoms;

    // Поиск по названию
    if (searchQuery) {
      filtered = searchRoms(searchQuery, filtered);
    }

    // Фильтр по категории
    if (selectedCategory !== 'all') {
      filtered = filterRomsByCategory(selectedCategory, filtered);
    }

    setFilteredRoms(filtered);
  }, [searchQuery, selectedCategory, availableRoms]);

  // Отрисовка кадров эмулятора
  useEffect(() => {
    if (!nes || !isPlaying || !currentGame) return;

    // Используем собственную анимацию вместо jsnes
    const renderFrame = () => {
      if (isPlaying && currentGame) {
        // Анимация уже запущена в loadGame
        requestAnimationFrame(renderFrame);
      }
    };

    renderFrame();
  }, [nes, isPlaying, currentGame]);

  // Остановка игры
  const stopGame = () => {
    setIsPlaying(false);
    setCurrentGame('');
    if (nes) {
      nes.stop();
    }
    toast.info('Игра остановлена');
  };

  const categories = [
    { id: 'all', name: 'Все игры' },
    { id: 'action', name: 'Экшен' },
    { id: 'puzzle', name: 'Головоломки' },
    { id: 'sports', name: 'Спорт' },
    { id: 'rpg', name: 'RPG' },
    { id: 'platform', name: 'Платформеры' },
    { id: 'strategy', name: 'Стратегии' },
    { id: 'other', name: 'Другие' }
  ];

  const loadRom = async (romData, gameName = 'Unknown ROM') => {
    if (!nes) return;

    try {
      setIsLoading(true);

      // Создаем ROM объект и загружаем в эмулятор
      const rom = new window.NesJs.Rom(romData);
      nes.setRom(rom);
      
      setIsPlaying(true);
      setCurrentGame(gameName);
      toast.success('ROM загружен успешно!');
      
      // Запускаем эмуляцию
      nes.bootup();
      nes.run();
      
    } catch (error) {
      console.error('Ошибка загрузки ROM:', error);
      toast.error('Ошибка загрузки ROM');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGameSelect = async (rom) => {
    try {
      setIsLoading(true);
      const romData = await loadRomFile(rom.fileName);
      await loadRom(romData, rom.name);
      setShowGameList(false);
    } catch (error) {
      console.error('Ошибка загрузки игры:', error);
      toast.error('Ошибка загрузки игры');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.dendyContainer}>
      <div className={styles.header}>
        <h2>🎮 Dendy (NES) Эмулятор</h2>
        <p>Классические игры Nintendo Entertainment System</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.searchSection}>
          <input
            type="text"
            placeholder="Поиск игр..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className={styles.gameControls}>
          <button 
            onClick={() => setShowGameList(!showGameList)}
            className={styles.controlButton}
            disabled={isLoading}
          >
            {showGameList ? 'Скрыть список' : 'Выбрать игру'}
          </button>
          
          {isPlaying && (
            <button 
              onClick={stopGame}
              className={styles.controlButton}
            >
              Остановить
            </button>
          )}
        </div>
      </div>

      {showGameList && (
        <div className={styles.gameList}>
          <div className={styles.gameListHeader}>
            <h3>Доступные игры ({filteredRoms.length})</h3>
            <p>Найдено игр: {filteredRoms.length} из {availableRoms.length}</p>
          </div>
          
          <div className={styles.gamesGrid}>
            {filteredRoms.slice(0, 100).map((rom) => (
              <div
                key={rom.id}
                className={styles.gameItem}
                onClick={() => handleGameSelect(rom)}
              >
                <div className={styles.gameIcon}>🎮</div>
                <div className={styles.gameInfo}>
                  <h4>{rom.name}</h4>
                  <span className={styles.gameCategory}>
                    {categories.find(cat => cat.id === rom.category)?.name || 'Другое'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredRoms.length > 100 && (
            <div className={styles.loadMore}>
              <p>Показано 100 из {filteredRoms.length} игр</p>
              <p>Используйте поиск для нахождения конкретной игры</p>
            </div>
          )}
        </div>
      )}

      <div className={styles.emulatorSection}>
        <div className={styles.canvasContainer}>
          <canvas
            ref={canvasRef}
            width={256}
            height={240}
            className={styles.gameCanvas}
          />
          
          {!currentGame && !isLoading && (
            <div className={styles.placeholder}>
              <div className={styles.placeholderContent}>
                <h3>🎮 Выберите игру</h3>
                <p>Нажмите "Выбрать игру" чтобы начать играть</p>
                <div className={styles.controlsInfo}>
                  <h4>Управление:</h4>
                  <ul>
                    <li>Стрелки - Движение</li>
                    <li>Z - Кнопка A</li>
                    <li>X - Кнопка B</li>
                    <li>Enter - Start</li>
                    <li>Shift - Select</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
          
          {isLoading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <p>Загрузка игры...</p>
            </div>
          )}
        </div>

        {currentGame && (
          <div className={styles.gameInfo}>
            <h3>🎮 {currentGame}</h3>
            <p>Статус: {isPlaying ? 'Играется' : 'Приостановлено'}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dendy; 