import React, { useState, useEffect, useRef } from 'react';
import styles from './ExternalEmulator.module.css';

const API_BASE_URL = 'https://skydishch.fun/api/roms/api/v1';

const BASE_URL = 'https://skydishch.fun/api/roms/';

const ConsoleSelector = ({ consoles, selectedConsole, onConsoleSelect }) => {
  const getShort = (consoleData) => {
    if (consoleData.shortName && consoleData.shortName.length <= 2) return consoleData.shortName;
    if (consoleData.shortName) return consoleData.shortName.slice(0, 3).toUpperCase();
    if (consoleData.name) return consoleData.name.slice(0, 3).toUpperCase();
    return '???';
  };
  return (
    <div className={styles.consoleSelector}>
      <h3>Выберите консоль</h3>
      <div className={styles.consoleGrid}>
        {consoles.map(consoleData => (
          <button
            key={consoleData.id}
            className={`${styles.consoleButton} ${selectedConsole?.id === consoleData.id ? styles.active : ''}`}
            onClick={() => onConsoleSelect(consoleData)}
          >
            <div className={styles.consoleIcon}>
              {getShort(consoleData)}
            </div>
            <div className={styles.consoleInfo}>
              <span className={styles.consoleName}>{consoleData.name}</span>
              <span className={styles.consoleStats}>{consoleData.stats} игр</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

const RomSelector = ({
  onRomSelect,
  selectedRom,
  selectedConsole,
  games,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  searchTerm,
  onSearchChange
}) => {
  return (
    <div className={styles.romSelector}>
      <div className={styles.sidebarHeader}>
        <h3>{selectedConsole?.name || 'Выберите консоль'}</h3>
        <span className={styles.romCount}>
          {games.length} игр
        </span>
      </div>

      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Поиск игр..."
          value={searchTerm}
          onChange={onSearchChange}
          className={styles.searchInput}
        />
      </div>
      
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button 
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            ←
          </button>
          <span className={styles.pageInfo}>
            {currentPage} / {totalPages}
          </span>
          <button 
            className={styles.paginationButton}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            →
          </button>
        </div>
      )}
      
      <div className={styles.romGrid}>
        {games.map(game => (
          <div
            key={game.id}
            className={`${styles.romTile} ${selectedRom?.id === game.id ? styles.selected : ''}`}
            onClick={() => onRomSelect(game)}
          >
            <div className={styles.tileThumbnail}>
              {game.hasImage ? (
                <img 
                  src={`${BASE_URL}${game.imagePath}`} 
                  alt={game.name}
                  className={styles.gameImage}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span className={styles.thumbnailIcon}>
                {game.hasImage ? '' : '🎮'}
              </span>
            </div>
            <div className={styles.tileInfo}>
              <h4 className={styles.tileName}>{game.name}</h4>
              <div className={styles.tileDetails}>
                <span className={styles.tileCategory}>{game.category}</span>
                <span className={styles.tileRegion}>{game.region}</span>
              </div>
            </div>
            <div className={styles.tileOverlay}>
              <span className={styles.playIcon}>▶️</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ExternalEmulator = () => {
  const [consoles, setConsoles] = useState([]);
  const [selectedConsole, setSelectedConsole] = useState(null);
  const [games, setGames] = useState([]);
  const [selectedRom, setSelectedRom] = useState(null);
  const [isLoadingConsoles, setIsLoadingConsoles] = useState(true);
  const [isLoadingGames, setIsLoadingGames] = useState(false);
  const [error, setError] = useState(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(true);
  const [isControlsOpen, setIsControlsOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [isResizing, setIsResizing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const gamesPerPage = 50;
  const iframeRef = useRef(null);

  // Обработчик изменения размера сайдбара
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const newWidth = e.clientX;
    const minWidth = 200;
    const maxWidth = window.innerWidth * 0.6;
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  // Добавляем обработчики событий мыши
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  // Загрузка списка консолей
  useEffect(() => {
    const fetchConsoles = async () => {
      try {
        setIsLoadingConsoles(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/consoles`);
        const data = await response.json();
        
        if (data.success) {
          setConsoles(data.data);
          if (data.data.length > 0) {
            setSelectedConsole(data.data[0]);
          }
        } else {
          throw new Error(data.error?.message || 'Ошибка загрузки консолей');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching consoles:', err);
      } finally {
        setIsLoadingConsoles(false);
      }
    };
    fetchConsoles();
  }, []);

  // Загрузка игр при выборе консоли, страницы или поиске
  useEffect(() => {
    const fetchGames = async () => {
      if (!selectedConsole) return;
      try {
        setIsLoadingGames(true);
        setError(null);
        setGames([]);
        const url = `${API_BASE_URL}/consoles/${selectedConsole.id}/games?page=${currentPage}&limit=${gamesPerPage}&search=${encodeURIComponent(searchTerm)}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.success) {
          setGames(data.data);
          setTotalPages(Math.ceil((data.meta?.total || 0) / gamesPerPage) || 1);
        } else {
          throw new Error(data.error?.message || 'Ошибка загрузки игр');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching games:', err);
      } finally {
        setIsLoadingGames(false);
      }
    };
    fetchGames();
  }, [selectedConsole, currentPage, searchTerm]);

  const handleConsoleSelect = (consoleData) => {
    setSelectedConsole(consoleData);
    setSelectedRom(null);
    setCurrentPage(1);
    setSearchTerm('');
  };

  const handleRomSelect = (rom) => {
    setSelectedRom(rom);
    setError(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const getEmulatorUrl = () => {
    if (!selectedRom) return null;
    
    // Используем локальный эмулятор или внешний сервис
    const romUrl = `${BASE_URL}${selectedRom.path}`;
    const system = selectedRom.console;
    
    // Определяем core на основе системы
    let core = 'nes';
    switch (system.toLowerCase()) {
      case 'psx': 
        core = 'psx'; 
        break;
      case 'snes': 
        core = 'snes'; 
        break;
      case 'megadrive': 
      case 'sega': 
      case 'genesis': 
        core = 'segaMD';
        break;
      case 'gba': 
        core = 'gba'; 
        break;
      case 'gbc': 
      case 'gb': 
        core = 'gb'; 
        break;
      case 'atari': 
      case 'atari2600': 
        core = 'atari2600'; 
        break;
      case 'atari5200':
        core = 'atari5200';
        break;
      case 'atari7800':
        core = 'atari7800';
        break;
      case 'segaMS':
      case 'mastersystem':
        core = 'segaMS';
        break;
      case 'segaGG':
      case 'gamegear':
        core = 'segaGG';
        break;
      case 'segaCD':
      case 'segacd':
        core = 'segaCD';
        break;
      case 'sega32x':
      case '32x':
        core = 'sega32x';
        break;
      case 'segaSaturn':
      case 'saturn':
        core = 'segaSaturn';
        break;
      case 'n64':
      case 'nintendo64':
        core = 'n64';
        break;
      case 'psp':
        core = 'psp';
        break;
      case 'nds':
      case 'nintendoDS':
        core = 'nds';
        break;
      case '3do':
        core = '3do';
        break;
      case 'lynx':
        core = 'lynx';
        break;
      case 'ngp':
      case 'neogeopocket':
        core = 'ngp';
        break;
      case 'pce':
      case 'pcengine':
        core = 'pce';
        break;
      case 'pcfx':
        core = 'pcfx';
        break;
      case 'ws':
      case 'wonderswan':
        core = 'ws';
        break;
      case 'jaguar':
        core = 'jaguar';
        break;
      case 'amiga':
        core = 'amiga';
        break;
      case 'c64':
      case 'commodore64':
        core = 'c64';
        break;
      case 'c128':
      case 'commodore128':
        core = 'c128';
        break;
      case 'pet':
        core = 'pet';
        break;
      case 'plus4':
        core = 'plus4';
        break;
      case 'vic20':
        core = 'vic20';
        break;
      case 'dos':
        core = 'dos';
        break;
      case 'arcade':
        core = 'arcade';
        break;
      case 'mame':
        core = 'mame';
        break;
      case 'coleco':
      case 'colecovision':
        core = 'coleco';
        break;
      case 'vb':
      case 'virtualboy':
        core = 'vb';
        break;
      case 'nes': 
      default: 
        core = 'nes'; 
        break;
    }
    
    // Можно использовать локальный эмулятор или внешний сервис
    const emulatorUrl = `https://skydishch.fun/api/emul/?core=${core}&gameUrl=${encodeURIComponent(romUrl)}`;
    return emulatorUrl;
  };

  if (isLoadingConsoles) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Загрузка консолей...</p>
      </div>
    );
  }

  if (error && !selectedConsole) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>🚫 Ошибка подключения к серверу</h2>
          <p>Убедитесь, что API сервер запущен на <code>BASE_URL</code></p>
          <p>Ошибка: {error}</p>
          <button 
            className={styles.retryButton}
            onClick={() => window.location.reload()}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.emulatorContainer}>
      <div className={styles.mainContent}>
        <div 
          className={styles.sidebar}
          style={{ width: `${sidebarWidth}px`, minWidth: `${sidebarWidth}px` }}
        >
          {selectedConsole && (
            <RomSelector 
              onRomSelect={handleRomSelect} 
              selectedRom={selectedRom}
              selectedConsole={selectedConsole}
              games={games}
              isLoading={isLoadingGames}
              error={error}
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              searchTerm={searchTerm}
              onSearchChange={handleSearchChange}
            />
          )}
        </div>
        
        {/* Разделитель */}
        <div 
          className={`${styles.resizer} ${isResizing ? styles.resizing : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className={styles.resizerHandle}></div>
        </div>
        
        <div className={styles.emulatorArea}>
          {/* Аккордеон для выбора консоли */}
          <div className={styles.accordionSection}>
            <button 
              className={styles.accordionHeader}
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
            >
              <span>🎮 Выбор консоли</span>
              <span className={styles.accordionIcon}>
                {isConsoleOpen ? '▼' : '▶'}
              </span>
            </button>
            {isConsoleOpen && (
              <div className={styles.accordionContent}>
                <ConsoleSelector 
                  consoles={consoles}
                  selectedConsole={selectedConsole}
                  onConsoleSelect={handleConsoleSelect}
                />
              </div>
            )}
          </div>

          {selectedRom && (
            <div className={styles.gameInfo}>
              <h3>🎮 {selectedRom.name}</h3>
              <div className={styles.gameDetails}>
                <p>Консоль: {selectedConsole?.name}</p>
                <p>Категория: {selectedRom.category}</p>
                <p>Регион: {selectedRom.region}</p>
              </div>
            </div>
          )}

          {/* Аккордеон для управления */}
          <div className={styles.accordionSection}>
            <button 
              className={styles.accordionHeader}
              onClick={() => setIsControlsOpen(!isControlsOpen)}
            >
              <span>🕹️ Управление</span>
              <span className={styles.accordionIcon}>
                {isControlsOpen ? '▼' : '▶'}
              </span>
            </button>
            {isControlsOpen && (
              <div className={styles.accordionContent}>
                <div className={styles.controlsGuide}>
                  <h4 className={styles.controlsTitle}>Управление (клавиатура)</h4>
                  <div className={styles.controlsGrid}>
                    <div className={styles.controlItem}><span>Вверх</span><kbd>↑</kbd></div>
                    <div className={styles.controlItem}><span>Вниз</span><kbd>↓</kbd></div>
                    <div className={styles.controlItem}><span>Влево</span><kbd>←</kbd></div>
                    <div className={styles.controlItem}><span>Вправо</span><kbd>→</kbd></div>
                    <div className={styles.controlItem}><span>Кнопка A</span><kbd>Z</kbd></div>
                    <div className={styles.controlItem}><span>Кнопка B</span><kbd>X</kbd></div>
                    <div className={styles.controlItem}><span>Start</span><kbd>Enter</kbd></div>
                    <div className={styles.controlItem}><span>Select</span><kbd>V</kbd></div>
                    <div className={styles.controlItem}><span>Сохранить</span><kbd>1</kbd></div>
                    <div className={styles.controlItem}><span>Загрузить</span><kbd>2</kbd></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.iframeContainer}>
            {selectedRom ? (
              <iframe
                key={getEmulatorUrl()}
                ref={iframeRef}
                src={getEmulatorUrl()}
                title="Emulator"
                className={styles.emulatorIframe}
                allowFullScreen
              />
            ) : (
              <div className={styles.placeholderContainer}>
                <div className={styles.placeholderContent}>
                  <h3>🎮 Выберите игру</h3>
                  <p>Кликните на игру в списке слева, чтобы начать играть</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExternalEmulator; 