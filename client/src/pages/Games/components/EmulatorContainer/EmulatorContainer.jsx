import React, { useState } from 'react';
import { Gamepad2, Cpu, Zap, HardDrive } from 'lucide-react';
import GameBoy from '../GameBoy/GameBoy';
import Dendy from '../Dendy/Dendy';
import styles from './EmulatorContainer.module.css';

const EmulatorContainer = () => {
  const [selectedEmulator, setSelectedEmulator] = useState('gameboy');

  const emulators = [
    {
      id: 'gameboy',
      name: 'GameBoy',
      icon: '🎮',
      difficulty: 'Легко',
      performance: '50MB RAM',
      component: GameBoy,
      description: 'Класичні ігри GameBoy з 8-бітною графікою'
    },
    {
      id: 'dendy',
      name: 'Dendy (NES)',
      icon: '🕹️',
      difficulty: 'Легко',
      performance: '100MB RAM',
      component: Dendy,
      description: 'Легендарні ігри Nintendo Entertainment System'
    },
    {
      id: 'superfamicon',
      name: 'Super Famicom',
      icon: '🎯',
      difficulty: 'Середньо',
      performance: '200MB RAM',
      component: null,
      description: '16-бітні ігри Super Nintendo'
    },
    {
      id: 'sega',
      name: 'Sega Genesis',
      icon: '⚡',
      difficulty: 'Середньо',
      performance: '250MB RAM',
      component: null,
      description: 'Класичні ігри Sega Genesis'
    },
    {
      id: 'gameboyadvance',
      name: 'GameBoy Advance',
      icon: '📱',
      difficulty: 'Середньо',
      performance: '300MB RAM',
      component: null,
      description: '32-бітні ігри GameBoy Advance'
    },
    {
      id: 'arcade',
      name: 'Arcade',
      icon: '🕹️',
      difficulty: 'Середньо',
      performance: '400MB RAM',
      component: null,
      description: 'Класичні аркадні ігри'
    },
    {
      id: 'atari',
      name: 'Atari',
      icon: '🎲',
      difficulty: 'Легко',
      performance: '50MB RAM',
      component: null,
      description: 'Ретро ігри Atari'
    },
    {
      id: 'ps1',
      name: 'PlayStation 1',
      icon: '💿',
      difficulty: 'Важко',
      performance: '1GB RAM',
      component: null,
      description: '3D ігри PlayStation 1'
    },
    {
      id: 'ps2',
      name: 'PlayStation 2',
      icon: '🎮',
      difficulty: 'Дуже важко',
      performance: '2GB RAM',
      component: null,
      description: 'Продвинуті ігри PlayStation 2'
    },
    {
      id: 'alavar',
      name: 'Alavar',
      icon: '🚀',
      difficulty: 'Дуже важко',
      performance: '4GB RAM',
      component: null,
      description: 'Сучасні ігри з високою графікою'
    }
  ];

  const selectedEmulatorData = emulators.find(emu => emu.id === selectedEmulator);
  const EmulatorComponent = selectedEmulatorData?.component;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Легко': return '#10b981';
      case 'Середньо': return '#f59e0b';
      case 'Важко': return '#ef4444';
      case 'Дуже важко': return '#dc2626';
      default: return '#6b7280';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <div className={styles.sidebar__header}>
          <h3>Емулятори</h3>
          <p>Виберіть консоль для гри</p>
        </div>
        
        <div className={styles.emulator__list}>
          {emulators.map((emulator) => (
            <div
              key={emulator.id}
              className={`${styles.emulator__item} ${selectedEmulator === emulator.id ? styles.emulator__itemActive : ''}`}
              onClick={() => setSelectedEmulator(emulator.id)}
            >
              <div className={styles.emulator__icon}>
                <span>{emulator.icon}</span>
              </div>
              <div className={styles.emulator__info}>
                <h4>{emulator.name}</h4>
                <p>{emulator.description}</p>
                <div className={styles.emulator__meta}>
                  <span 
                    className={styles.emulator__difficulty}
                    style={{ color: getDifficultyColor(emulator.difficulty) }}
                  >
                    {emulator.difficulty}
                  </span>
                  <span className={styles.emulator__performance}>
                    <Cpu size={12} />
                    {emulator.performance}
                  </span>
                </div>
              </div>
              {!emulator.component && (
                <div className={styles.emulator__comingSoon}>
                  <span>Скоро</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.content}>
        {EmulatorComponent ? (
          <EmulatorComponent />
        ) : (
          <div className={styles.placeholder}>
            <div className={styles.placeholder__content}>
              <Gamepad2 size={64} />
              <h2>{selectedEmulatorData?.name} Emulator</h2>
              <p>Цей емулятор знаходиться в розробці</p>
              <div className={styles.placeholder__info}>
                <div className={styles.placeholder__stat}>
                  <Zap size={20} />
                  <span>Складність: {selectedEmulatorData?.difficulty}</span>
                </div>
                <div className={styles.placeholder__stat}>
                  <HardDrive size={20} />
                  <span>Потрібно: {selectedEmulatorData?.performance}</span>
                </div>
              </div>
              <p className={styles.placeholder__description}>
                {selectedEmulatorData?.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmulatorContainer; 