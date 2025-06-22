import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Download, Play, Pause, RotateCcw } from 'lucide-react';
import styles from './GameBoy.module.css';

const GameBoy = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentGame, setCurrentGame] = useState(null);
  const [gameList, setGameList] = useState([
    { id: 1, name: 'Tetris', rom: 'tetris.gb', size: '32KB', category: 'Puzzle' },
    { id: 2, name: 'Pokemon Red', rom: 'pokemon-red.gb', size: '1MB', category: 'RPG' },
    { id: 3, name: 'Super Mario Land', rom: 'mario-land.gb', size: '64KB', category: 'Platformer' },
    { id: 4, name: 'Zelda: Link\'s Awakening', rom: 'zelda.gb', size: '1MB', category: 'Adventure' },
    { id: 5, name: 'Donkey Kong', rom: 'donkey-kong.gb', size: '32KB', category: 'Arcade' }
  ]);
  const canvasRef = useRef(null);

  const handleGameSelect = (game) => {
    setCurrentGame(game);
    setIsPlaying(true);
    // Здесь будет логика загрузки ROM и запуска эмулятора
    console.log(`Loading game: ${game.name}`);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    // Сброс игры
    console.log('Resetting game');
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.gb')) {
      const newGame = {
        id: Date.now(),
        name: file.name.replace('.gb', ''),
        rom: file.name,
        size: `${(file.size / 1024).toFixed(1)}KB`,
        category: 'Custom'
      };
      setGameList([...gameList, newGame]);
    }
  };

  return (
    <div className={styles.gameboy}>
      <div className={styles.gameboy__header}>
        <div className={styles.gameboy__title}>
          <Gamepad2 size={32} />
          <h2>GameBoy Emulator</h2>
        </div>
        <div className={styles.gameboy__info}>
          <span className={styles.gameboy__difficulty}>Складність: Легко</span>
          <span className={styles.gameboy__performance}>Потрібно: 50MB RAM</span>
        </div>
      </div>

      <div className={styles.gameboy__content}>
        <div className={styles.gameboy__emulator}>
          <div className={styles.gameboy__screen}>
            <canvas 
              ref={canvasRef}
              width="160" 
              height="144"
              className={styles.gameboy__canvas}
            />
            {!currentGame && (
              <div className={styles.gameboy__placeholder}>
                <Gamepad2 size={48} />
                <p>Виберіть гру для початку</p>
              </div>
            )}
          </div>
          
          <div className={styles.gameboy__controls}>
            <div className={styles.gameboy__dpad}>
              <div className={styles.gameboy__dpadUp}>▲</div>
              <div className={styles.gameboy__dpadLeft}>◀</div>
              <div className={styles.gameboy__dpadCenter}>●</div>
              <div className={styles.gameboy__dpadRight}>▶</div>
              <div className={styles.gameboy__dpadDown}>▼</div>
            </div>
            
            <div className={styles.gameboy__buttons}>
              <button className={styles.gameboy__button}>A</button>
              <button className={styles.gameboy__button}>B</button>
            </div>
            
            <div className={styles.gameboy__menu}>
              <button className={styles.gameboy__menuButton}>Start</button>
              <button className={styles.gameboy__menuButton}>Select</button>
            </div>
          </div>
        </div>

        <div className={styles.gameboy__sidebar}>
          <div className={styles.gameboy__controls}>
            <button 
              onClick={handlePlayPause}
              className={styles.gameboy__controlButton}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Пауза' : 'Грати'}
            </button>
            
            <button 
              onClick={handleReset}
              className={styles.gameboy__controlButton}
            >
              <RotateCcw size={20} />
              Скинути
            </button>
          </div>

          <div className={styles.gameboy__upload}>
            <label className={styles.gameboy__uploadLabel}>
              <Download size={20} />
              Завантажити ROM
              <input 
                type="file" 
                accept=".gb,.gbc"
                onChange={handleFileUpload}
                className={styles.gameboy__fileInput}
              />
            </label>
          </div>

          <div className={styles.gameboy__games}>
            <h3>Доступні ігри</h3>
            <div className={styles.gameboy__gameList}>
              {gameList.map((game) => (
                <div 
                  key={game.id}
                  className={`${styles.gameboy__gameItem} ${currentGame?.id === game.id ? styles.gameboy__gameItemActive : ''}`}
                  onClick={() => handleGameSelect(game)}
                >
                  <div className={styles.gameboy__gameInfo}>
                    <h4>{game.name}</h4>
                    <span className={styles.gameboy__gameCategory}>{game.category}</span>
                    <span className={styles.gameboy__gameSize}>{game.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.gameboy__footer}>
        <div className={styles.gameboy__stats}>
          <span>FPS: 60</span>
          <span>ROM: {currentGame?.name || 'Не вибрано'}</span>
          <span>Стан: {isPlaying ? 'Грає' : 'Зупинено'}</span>
        </div>
      </div>
    </div>
  );
};

export default GameBoy; 