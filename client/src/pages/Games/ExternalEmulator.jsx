import React, { useState, useEffect, useRef } from 'react';
// Removed CSS module import
import qrCodeImage from './TronTRC.jpg';


const ROM_SERV = process.env.REACT_APP_ROMSERV_URL;
const EMUL_URL = process.env.EMUL_URL;
import { DOMEN_Brahma } from 'common/constant';


const DonationBanner = ({ isVisible, onClose }) => {
  const [isQrFullscreen, setIsQrFullscreen] = useState(false);

  if (!isVisible) return null;

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);

    } catch (err) {
      console.error('Ошибка копирования:', err);
    }
  };

  const formatCardNumber = (number) => {
    return number.replace(/(\d{4})(?=\d)/g, '$1 ');
  };


  const handleQrClick = () => {
    setIsQrFullscreen(true);
  };


  const handleQrFullscreenClose = (e) => {
    if (e.target === e.currentTarget) {
      setIsQrFullscreen(false);
    }
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-slate-600 to-purple-600 text-white p-4 z-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center">

            <button
              className="text-white hover:text-gray-300 text-2xl font-bold transition-colors"
              onClick={onClose}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              ✕
            </button>
          </div>
          <div className="mt-4">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold">Реквизиты</h4>
              <ul className="space-y-2">
                <li>
                 <div className="flex items-center space-x-2">
                   <span>QR-код для удобства криптой</span>
                </div>
                   
                    <div className="cursor-pointer" onClick={handleQrClick}>
                      <img
                        src={qrCodeImage}
                        alt="QR-код для оплаты USDT"
                        className="w-32 h-32 mx-auto"
                      />
                   
                  </div>

                </li>

                <li>

                  <div className="flex items-center space-x-2">
                    <span>USDT (TRC20):</span>
                  </div>
                  <div className="mt-2">

                    <h6>TTa9eFw9VyB64p95sfar5DnLv8P7Vs29Dc</h6>

                    <button
                      className="btn-secondary p-2"
                      onClick={() => copyToClipboard('TTa9eFw9VyB64p95sfar5DnLv8P7Vs29Dc')}
                      title="Копировать"
                    >
                      📋
                    </button>
                  </div>

                </li>

                <li>
                  <div className="flex items-center space-x-2">
                    <span>UAH карта:</span>
                  </div>
                  <div className="mt-2">
                    <code>{formatCardNumber('4441111078249988')}</code>
                    <button
                      className="btn-secondary p-2"
                      onClick={() => copyToClipboard('4441111078249988')}
                      title="Копировать"
                    >
                      📋
                    </button>
                  </div>

                </li>
                <li>
                  <div className="flex items-center space-x-2">
                    <span>USD карта:</span>
                  </div>
                  <div className="mt-2">
                    <code>{formatCardNumber('4441 1144 8905 5093')}</code>
                    <button
                      className="btn-secondary p-2"
                      onClick={() => copyToClipboard('4441 1144 8905 5093')}
                      title="Копировать"
                    >
                      📋
                    </button>
                  </div>


                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen QR Code Modal */}
      {isQrFullscreen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={handleQrFullscreenClose}>
          <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white text-lg font-semibold">QR-код для оплаты USDT</h3>
              <button
                className="text-white hover:text-gray-300 text-2xl font-bold"
                onClick={() => setIsQrFullscreen(false)}
              >
                ✕
              </button>
            </div>
            <div className="flex justify-center">
              <img
                src={qrCodeImage}
                alt="QR-код для оплаты USDT"
              />
            </div>
            <p className="text-gray-300 text-center mt-4">
              Отсканируйте QR-код для оплаты USDT (TRC20)
            </p>
          </div>
        </div>
      )}
    </>
  );
};

// Donation button component
const DonationButton = ({ onClick }) => {
  return (
    <button
      className="btn-primary flex items-center space-x-2"
      onClick={onClick}
      onTouchStart={(e) => {
        e.currentTarget.style.transform = 'scale(0.95)';
      }}
      onTouchEnd={(e) => {
        e.currentTarget.style.transform = '';
      }}
    >
      <span>💸</span>
      <span>Поддержать проект</span>
    </button>
  );
};

// Component for selecting game consoles (desktop: buttons, mobile: dropdown)
const ConsoleSelector = ({ consoles, selectedConsole, onConsoleSelect, isMobile }) => {
  // Helper function to get short name for console icons
  const getShort = (consoleData) => {
    if (consoleData.shortName && consoleData.shortName.length <= 2) return consoleData.shortName;
    if (consoleData.shortName) return consoleData.shortName.slice(0, 3).toUpperCase();
    if (consoleData.name) return consoleData.name.slice(0, 3).toUpperCase();
    return '???';
  };

  // Mobile version: use dropdown select for better space usage
  if (isMobile) {
    return (
      <div className="space-y-4">
        <h3 className="text-white font-semibold">Выберите консоль</h3>
        <select
          value={selectedConsole?.id || ''}
          onChange={(e) => {
            const selected = consoles.find(console => console.id === e.target.value);
            if (selected) onConsoleSelect(selected);
          }}
          className="input-field"
        >
          <option value="">Выберите консоль...</option>
          {consoles.map(consoleData => (
            <option key={consoleData.id} value={consoleData.id}>
              {consoleData.name} ({consoleData.stats} игр)
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold">Выберите консоль</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {consoles.map(consoleData => (
          <button
            key={consoleData.id}
            className={`card p-4 text-center hover:shadow-lg transition-all ${
              selectedConsole?.id === consoleData.id ? 'ring-2 ring-slate-500 bg-slate-600/20' : ''
            }`}
            onClick={() => onConsoleSelect(consoleData)}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = '';
            }}
          >
            <div className="text-3xl mb-2">
              {getShort(consoleData)}
            </div>
            <div>
              <span className="text-white font-medium block">{consoleData.name}</span>
              <span className="text-gray-400 text-sm">{consoleData.stats} игр</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

// Component for displaying and selecting games from a console
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
  onSearchChange,
  isMobile,
  isModalOpen,
  onCloseModal
}) => {
  // Mobile version: modal with game list
  if (isMobile) {
    if (!isModalOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={onCloseModal}>
        <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          {/* Modal header with close button */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold text-lg">{selectedConsole?.name || 'Выберите консоль'}</h3>
            <button
              className="text-white hover:text-gray-300 text-2xl font-bold"
              onClick={onCloseModal}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.95)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              ✕
            </button>
          </div>

          {/* Search input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Поиск игр..."
              value={searchTerm}
              onChange={onSearchChange}
              className="input-field w-full"
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
            />
          </div>

          {/* Game count */}
          <div className="text-gray-400 text-sm mb-4">
            <span>{games.length} игр</span>
          </div>

          {/* Pagination controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mb-4">
              <button
                className="btn-secondary p-2"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                onTouchStart={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = '';
                }}
              >
                ←
              </button>
              <span className="text-white px-4">
                {currentPage} / {totalPages}
              </span>
              <button
                className="btn-secondary p-2"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                onTouchStart={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.transform = 'scale(0.95)';
                  }
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = '';
                }}
              >
                →
              </button>
            </div>
          )}

          {/* Game list */}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {games.map(game => (
              <div
                key={game.id}
                className={`p-3 rounded-lg cursor-pointer transition-all ${
                  selectedRom?.id === game.id ? 'bg-slate-600 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                onClick={() => {
                  onRomSelect(game);
                  onCloseModal(); // Close modal when game is selected
                }}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = '';
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onRomSelect(game);
                    onCloseModal();
                  }
                }}
              >
                {/* Game thumbnail */}
                <div className="w-12 h-12 bg-gray-600 rounded flex items-center justify-center text-2xl">
                  {
                    game.hasImage ? (
                      <img
                        src={`${ROM_SERV}${game.imagePath}`}
                        alt={game.name}
                        className="w-full h-full object-cover rounded"
                        loading="lazy"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'block';
                        }}
                      />
                    ) : null}
                  <span className="text-gray-400">
                    {game.hasImage ? '' : '🎮'}
                  </span>
                </div>

                {/* Game info */}
                <div className="flex-1 ml-3">
                  <h4 className="text-white font-medium"> {game.name}</h4>
                  {/* <div className={styles.modalGameDetails}>
                    <span className={styles.modalGameRegion}>Регион : {game.region}</span>
                  </div> */}
                </div>

                {/* Play indicator */}
                <div className="text-gray-300 text-xl">
                  ▶️
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Desktop version: original sidebar layout
  return (
    <div className="space-y-4">
      {/* Header with console name and game count */}
      <div className="flex justify-between items-center">
        <h3>{selectedConsole?.name || 'Выберите консоль'}</h3>
        <span className="text-gray-400 text-sm">
          {games.length} игр
        </span>
      </div>

      {/* Search input for filtering games */}
      <div>
        <input
          type="text"
          placeholder="Поиск игр..."
          value={searchTerm}
          onChange={onSearchChange}
          className="input-field w-full"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
      </div>

      {/* Pagination controls for navigating through game pages */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            className="btn-secondary p-2"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            onTouchStart={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.transform = 'scale(0.95)';
              }
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = '';
            }}
          >
            ←
          </button>
          <span className="text-white px-4">
            {currentPage} / {totalPages}
          </span>
          <button
            className="btn-secondary p-2"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            onTouchStart={(e) => {
              if (!e.currentTarget.disabled) {
                e.currentTarget.style.transform = 'scale(0.95)';
              }
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = '';
            }}
          >
            →
          </button>
        </div>
      )}

      {/* Grid of game tiles/cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {games.map(game => (
          <div
            key={game.id}
            className={`card p-4 text-center hover:shadow-lg transition-all cursor-pointer ${
              selectedRom?.id === game.id ? 'ring-2 ring-slate-500 bg-slate-600/20' : ''
            }`}
            onClick={() => onRomSelect(game)}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = '';
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onRomSelect(game);
              }
            }}
          >
            {/* Game thumbnail image or icon */}
            <div className="w-16 h-16 bg-gray-600 rounded mx-auto mb-2 flex items-center justify-center text-2xl">
              {game.hasImage ? (
                <img
                  src={`${ROM_SERV}${game.imagePath}`}
                  alt={game.name}
                  className="w-full h-full object-cover rounded"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
              ) : null}
              <span className="text-gray-400">
                {game.hasImage ? '' : '🎮'}
              </span>
            </div>
            {/* Game information (name, category, region) */}
            <div>
              <h4 className="text-white font-medium text-sm"> {game.name}</h4>
              {/* <div className={styles.tileDetails}>
                <span className={styles.tileRegion}>Регион :{game.region}</span>
              </div> */}
            </div>
            {/* Play button overlay */}
            <div className="text-gray-300 text-xl mt-2">
              <span>▶️</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main emulator component that manages the entire game interface
const ExternalEmulator = () => {
  // State management for consoles, games, and UI
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
  const [isMobile, setIsMobile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const gamesPerPage = 100;
  const iframeRef = useRef(null);
  const [showDonation, setShowDonation] = useState(false);

  // Debug: Log dimensions on mount and resize
  useEffect(() => {
    const logDimensions = () => {
      console.log('Window dimensions:', {
        width: window.innerWidth,
        height: window.innerHeight,
        isMobile: window.innerWidth <= 768
      });
    };

    logDimensions();
    window.addEventListener('resize', logDimensions);

    return () => window.removeEventListener('resize', logDimensions);
  }, []);

  // Detect mobile device and update on window resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      console.log('Mobile detection:', mobile);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle sidebar resizing (desktop only)
  const handleMouseDown = (e) => {
    if (isMobile) return;
    e.preventDefault();
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (!isResizing || isMobile) return;

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

  // Add mouse event listeners for resizing
  useEffect(() => {
    if (isResizing && !isMobile) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, isMobile]);

  // Fetch available consoles from API
  useEffect(() => {
    const fetchConsoles = async () => {
      try {
        setIsLoadingConsoles(true);
        setError(null);
        const response = await fetch(`${ROM_SERV}/consoles`);
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

  // Fetch games when console, page, or search term changes
  useEffect(() => {
    const fetchGames = async () => {
      if (!selectedConsole) return;
      try {
        setIsLoadingGames(true);
        setError(null);
        setGames([]);
        const url = `${ROM_SERV}/consoles/${selectedConsole.id}/games?page=${currentPage}&limit=${gamesPerPage}&search=${encodeURIComponent(searchTerm)}`;
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

  // Handle console selection
  const handleConsoleSelect = (consoleData) => {
    setSelectedConsole(consoleData);
    setSelectedRom(null);
    setCurrentPage(1);
    setSearchTerm('');
  };

  // Handle game selection
  const handleRomSelect = (rom) => {
    setSelectedRom(rom);
    setError(null);

    // Auto-collapse accordions on mobile for better UX
    if (isMobile) {
      setIsConsoleOpen(false);
      setIsControlsOpen(false);
    }
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Generate emulator URL based on selected game and console
  const getEmulatorUrl = () => {
    if (!selectedRom) return null;

    const romUrl = `${ROM_SERV}${selectedRom.path}`;
    console.log("romUrl :", romUrl)
    const system = selectedRom.console;

    // Map console names to emulator cores
    let core = 'nes';
    switch (system.toLowerCase()) {
      case 'psx': core = 'psx'; break;
      case 'snes': core = 'snes'; break;
      case 'megadrive':
      case 'sega':
      case 'genesis': core = 'segaMD'; break;
      case 'gba': core = 'gba'; break;
      case 'gbc':
      case 'gb': core = 'gb'; break;
      case 'atari':
      case 'atari2600': core = 'atari2600'; break;
      case 'atari5200': core = 'atari5200'; break;
      case 'atari7800': core = 'atari7800'; break;
      case 'segaMS':
      case 'mastersystem': core = 'segaMS'; break;
      case 'segaGG':
      case 'gamegear': core = 'segaGG'; break;
      case 'segaCD':
      case 'segacd': core = 'segaCD'; break;
      case 'sega32x':
      case '32x': core = 'sega32x'; break;
      case 'segaSaturn':
      case 'saturn': core = 'segaSaturn'; break;
      case 'n64':
      case 'nintendo64': core = 'n64'; break;
      case 'psp': core = 'psp'; break;
      case 'nds':
      case 'nintendoDS': core = 'nds'; break;
      case '3do': core = '3do'; break;
      case 'lynx': core = 'lynx'; break;
      case 'ngp':
      case 'neogeopocket': core = 'ngp'; break;
      case 'pce':
      case 'pcengine': core = 'pce'; break;
      case 'pcfx': core = 'pcfx'; break;
      case 'ws':
      case 'wonderswan': core = 'ws'; break;
      case 'jaguar': core = 'jaguar'; break;
      case 'amiga': core = 'amiga'; break;
      case 'c64':
      case 'commodore64': core = 'c64'; break;
      case 'c128':
      case 'commodore128': core = 'c128'; break;
      case 'pet': core = 'pet'; break;
      case 'plus4': core = 'plus4'; break;
      case 'vic20': core = 'vic20'; break;
      case 'dos': core = 'dos'; break;
      case 'arcade': core = 'arcade'; break;
      case 'mame': core = 'mame'; break;
      case 'coleco':
      case 'colecovision': core = 'coleco'; break;
      case 'vb':
      case 'virtualboy': core = 'vb'; break;
      case 'nes':
      default: core = 'nes'; break;
    }


    // EMUL_URL
    const emulatorUrl = `${DOMEN_Brahma}/emulator/?core=${core}&gameUrl=${encodeURIComponent(romUrl)}`;
    return emulatorUrl;
  };

  // Loading state while fetching consoles
  if (isLoadingConsoles) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-500"></div>
        <p className="text-white mt-4">Загрузка консолей...</p>
      </div>
    );
  }

  // Error state when API is not available
  if (error && !selectedConsole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2>🚫 Ошибка подключения к серверу</h2>
          <p>Убедитесь, что API сервер запущен на <code>{ROM_SERV}</code></p>
          <p>Ошибка: {error}</p>
          <button
            className="btn-primary mt-4"
            onClick={() => window.location.reload()}
            onTouchStart={(e) => {
              e.currentTarget.style.transform = 'scale(0.95)';
            }}
            onTouchEnd={(e) => {
              e.currentTarget.style.transform = '';
            }}
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Main emulator interface layout
  return (
    <div className="min-h-screen">
      {/* Donation banner at the top */}
      <DonationBanner
        isVisible={showDonation}
        onClose={() => {
          console.log('Closing donation banner');
          setShowDonation(false);
        }}
      />

      <div className="flex h-screen">
        {/* Left sidebar with game list (desktop only) */}
        {!isMobile && (
          <div
            className="bg-gray-800/50 border-r border-gray-700/50 overflow-y-auto"
            style={{
              width: `${sidebarWidth}px`,
              minWidth: `${sidebarWidth}px`
            }}
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
                isMobile={isMobile}
                isModalOpen={isModalOpen}
                onCloseModal={() => setIsModalOpen(false)}
              />
            )}
          </div>
        )}

        {/* Resizable divider (desktop only) */}
        {!isMobile && (
          <div
            className={`w-1 bg-gray-600 hover:bg-gray-500 cursor-col-resize transition-colors ${
              isResizing ? 'bg-gray-500' : ''
            }`}
            onMouseDown={handleMouseDown}
          >
            <div className="w-full h-full"></div>
          </div>
        )}

        {/* Right area with console selector, game info, and emulator */}
        <div className="flex-1 flex flex-col">
          {/* Donation button at the top */}
          <div className="p-4">
            <DonationButton onClick={() => {
              console.log('Opening donation banner');
              setShowDonation(true);
            }} />
          </div>

          {/* Collapsible console selector section */}
          <div className="mb-4">
            <button
              className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              onClick={() => setIsConsoleOpen(!isConsoleOpen)}
              onTouchStart={(e) => {
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <span>🎮 Выбор консоли</span>
              <span className="text-gray-300">
                {isConsoleOpen ? '▼' : '▶'}
              </span>
            </button>
            {isConsoleOpen && (
              <div className="mt-2">
                <ConsoleSelector
                  consoles={consoles}
                  selectedConsole={selectedConsole}
                  onConsoleSelect={handleConsoleSelect}
                  isMobile={isMobile}
                />
              </div>
            )}
          </div>

          {/* Mobile: Game selection button */}
          {isMobile && selectedConsole && (
            <div className="mb-4">
              <button
                className="w-full flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => setIsModalOpen(true)}
                onTouchStart={(e) => {
                  e.currentTarget.style.transform = 'scale(0.95)';
                }}
                onTouchEnd={(e) => {
                  e.currentTarget.style.transform = '';
                }}
              >
                <span className="text-gray-300 text-xl">🎮</span>
                <span className="text-white font-medium">
                  {selectedRom ? `Игра: ${selectedRom.name}` : 'Выбрать игру'}
                </span>
                <span className="text-gray-300">▼</span>
              </button>
            </div>
          )}

          {/* Selected game information display */}
          {selectedRom && (
            <div className="card p-4 mb-4">
              <h3>🎮 {selectedRom.name}</h3>
              <div className="mt-2 text-gray-300">
                <p>Консоль: {selectedConsole?.name}</p>
                {/* {!isMobile && <p>Категория: {selectedRom.category}</p>} */}
                {/* <p>Регион: {selectedRom.region}</p> */}
              </div>
            </div>
          )}


          {/* Main emulator iframe or placeholder */}
          <div className="w-full h-96 md:h-[600px]">
            {selectedRom ? (
              <iframe
                key={getEmulatorUrl()}
                ref={iframeRef}
                src={getEmulatorUrl()}
                title="Emulator"
                className="w-full h-full border-0 rounded-lg"
                allowFullScreen
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                onLoad={() => {
                  console.log('Iframe loaded, dimensions:', {
                    iframe: iframeRef.current?.getBoundingClientRect(),
                    container: iframeRef.current?.parentElement?.getBoundingClientRect()
                  });
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3>🎮 Выберите игру</h3>
                  <p>Кликните на игру, чтобы начать играть</p>
                  <p style={{ fontSize: '0.8rem', color: '#888' }}>
                    Debug: {isMobile ? 'Mobile' : 'Desktop'} - {window.innerWidth}x{window.innerHeight}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile modal for game selection */}
      {isMobile && selectedConsole && (
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
          isMobile={isMobile}
          isModalOpen={isModalOpen}
          onCloseModal={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ExternalEmulator; 