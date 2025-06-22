import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { toast } from 'react-toastify';
import { loadRomFile } from '../../utils/romApi';
import styles from './Dendy.module.css';
import { getAllRoms, searchRoms } from '../../utils/romApi';
import 'nes-js';

const Dendy = () => {
  const [nes, setNes] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentGame, setCurrentGame] = useState('');
  const [showGameList, setShowGameList] = useState(false);
  const [availableRoms, setAvailableRoms] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showControls, setShowControls] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [fps, setFps] = useState(0);
  const [frameCount, setFrameCount] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [displayCount, setDisplayCount] = useState(50);
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const canvasRef = useRef(null);
  const audioContextRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 10);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (nes) {
      const initEmulator = () => {
        if (typeof window.NesJs === 'undefined') {
          console.error('NesJs не загружен');
          return;
        }
        const nesInstance = new window.NesJs.Nes();
        nesInstance.setDisplay(new window.NesJs.Display(canvasRef.current));
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
            sampleRate: 44100,
            latencyHint: 'interactive'
          });
          const startAudio = () => {
            if (audioContextRef.current.state === 'suspended') {
              audioContextRef.current.resume();
            }
            document.removeEventListener('click', startAudio);
            document.removeEventListener('keydown', startAudio);
          };
          document.addEventListener('click', startAudio);
          document.addEventListener('keydown', startAudio);
        }
        try {
          if (audioEnabled) {
            const audio = new window.NesJs.Audio();
            audio.bufferLength = 2192;
            audio.buffer = new Float32Array(audio.bufferLength);
            if (audio.scriptProcessor) {
              audio.scriptProcessor.disconnect();
            }
            audio.scriptProcessor = audio.context.createScriptProcessor(audio.bufferLength, 0, 1);
            audio.scriptProcessor.onaudioprocess = audio.onAudioProcess.bind(audio);
            audio.scriptProcessor.connect(audio.context.destination);
            nesInstance.setAudio(audio);
            console.log('Аудио инициализировано с улучшенными настройками (буфер 8192)');
          } else {
            console.log('Аудио отключено');
          }
        } catch (error) {
          console.warn('Ошибка инициализации аудио:', error);
        }
        window.onkeydown = (e) => nesInstance.handleKeyDown(e);
        window.onkeyup = (e) => nesInstance.handleKeyUp(e);
        setNes(nesInstance);
      };
      initEmulator();
    }
  }, [audioEnabled]);

  useEffect(() => {
    const initEmulator = () => {
      if (typeof window.NesJs === 'undefined') {
        console.error('NesJs не загружен');
        return;
      }
      const nesInstance = new window.NesJs.Nes();
      nesInstance.setDisplay(new window.NesJs.Display(canvasRef.current));
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({
          sampleRate: 44100,
          latencyHint: 'interactive'
        });
        const startAudio = () => {
          if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
          }
          document.removeEventListener('click', startAudio);
          document.removeEventListener('keydown', startAudio);
        };
        document.addEventListener('click', startAudio);
        document.addEventListener('keydown', startAudio);
      }
      try {
        if (audioEnabled) {
          const audio = new window.NesJs.Audio();
          audio.bufferLength = 8192;
          audio.buffer = new Float32Array(audio.bufferLength);
          if (audio.scriptProcessor) {
            audio.scriptProcessor.disconnect();
          }
          audio.scriptProcessor = audio.context.createScriptProcessor(audio.bufferLength, 0, 1);
          audio.scriptProcessor.onaudioprocess = audio.onAudioProcess.bind(audio);
          audio.scriptProcessor.connect(audio.context.destination);
          nesInstance.setAudio(audio);
          console.log('Аудио инициализировано с улучшенными настройками (буфер 8192)');
        } else {
          console.log('Аудио отключено');
        }
      } catch (error) {
        console.warn('Ошибка инициализации аудио:', error);
      }
      window.onkeydown = (e) => nesInstance.handleKeyDown(e);
      window.onkeyup = (e) => nesInstance.handleKeyUp(e);
      setNes(nesInstance);
    };
    const checkNesJs = () => {
      if (typeof window.NesJs !== 'undefined') {
        initEmulator();
      } else {
        setTimeout(checkNesJs, 100);
      }
    };
    checkNesJs();
    const loadRoms = async () => {
      try {
        const roms = await getAllRoms();
        setAvailableRoms(roms);
        toast.success(`Загружено ${roms.length} игр!`);
      } catch (error) {
        console.error('Ошибка загрузки списка ROM\'ов:', error);
        toast.error('Не удалось загрузить список игр');
      }
    };
    loadRoms();
  }, []);

  const filteredRoms = useMemo(() => {
    let filtered = availableRoms;
    if (debouncedSearchQuery.trim()) {
      console.log('Поиск по запросу:', debouncedSearchQuery);
      filtered = searchRoms(debouncedSearchQuery, filtered);
      console.log('Результаты поиска:', filtered.length);
    }
    return filtered;
  }, [debouncedSearchQuery, availableRoms]);

  useEffect(() => {
    if (!nes || !isPlaying || !currentGame) return;
    const renderFrame = () => {
      if (isPlaying && currentGame) {
        requestAnimationFrame(renderFrame);
      }
    };
    renderFrame();
  }, [nes, isPlaying, currentGame]);

  const loadRom = useCallback(async (romData, gameName = 'Unknown ROM') => {
    if (!nes) return;
    try {
      setIsLoading(true);
      const rom = new window.NesJs.Rom(romData);
      nes.setRom(rom);
      setIsPlaying(true);
      setCurrentGame(gameName);
      toast.success('ROM загружен успешно!');
      nes.bootup();
      nes.run();
    } catch (error) {
      console.error('Ошибка загрузки ROM:', error);
      toast.error('Ошибка загрузки ROM');
    } finally {
      setIsLoading(false);
    }
  }, [nes]);

  const handleGameSelect = useCallback(async (rom) => {
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
  }, [loadRom]);

  const stopGame = useCallback(() => {
    setIsPlaying(false);
    setCurrentGame('');
    if (nes) {
      nes.stop();
    }
    toast.info('Игра остановлена');
  }, [nes]);

  const loadMoreGames = useCallback(() => {
    setDisplayCount(prev => Math.min(prev + 50, filteredRoms.length));
  }, [filteredRoms.length]);

  useEffect(() => {
    if (!isPlaying) return;
    let frameCount = 0;
    let lastTime = performance.now();
    const updateStats = () => {
      if (!isPlaying) return;
      frameCount++;
      const currentTime = performance.now();
      if (currentTime - lastTime >= 1000) {
        setFps(Math.round(frameCount * 1000 / (currentTime - lastTime)));
        setFrameCount(frameCount);
        frameCount = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(updateStats);
    };
    updateStats();
  }, [isPlaying]);

  return (
    <div className={styles.dendyContainer}>
      <div className={styles.header}>
        <h2>🎮 Dendy (NES) Эмулятор</h2>
        <p>Классические игры Nintendo Entertainment System</p>
      </div>
      <div className={styles.controls}>
        <div className={styles.searchSection}>
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder="Поиск игр..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
            {searchQuery !== debouncedSearchQuery && (
              <div className={styles.searchSpinner}></div>
            )}
          </div>
        </div>
        <div className={styles.gameControls}>
          <button 
            onClick={() => setShowGameList(!showGameList)}
            className={styles.controlButton}
            disabled={isLoading}
          >
            {showGameList ? 'Скрыть список' : 'Выбрать игру'}
          </button>
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`${styles.controlButton} ${!audioEnabled ? styles.controlButtonDisabled : ''}`}
          >
            🔊 {audioEnabled ? 'Выкл. звук' : 'Вкл. звук'}
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
            {filteredRoms.slice(0, displayCount).map((rom) => (
              <div
                key={rom.id}
                className={styles.gameItem}
                onClick={() => handleGameSelect(rom)}
              >
                <div className={styles.gameIcon}>🎮</div>
                <div className={styles.gameInfo}>
                  <h4>{rom.name}</h4>
                </div>
              </div>
            ))}
          </div>
          {filteredRoms.length > displayCount && (
            <div className={styles.loadMore}>
              <p>Показано {displayCount} из {filteredRoms.length} игр</p>
              <button 
                onClick={loadMoreGames}
                className={styles.loadMoreButton}
              >
                Загрузить еще 50 игр
              </button>
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
            <div className={styles.gameStats}>
              <span>FPS: {fps}</span>
              <span>Кадры: {frameCount}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dendy;