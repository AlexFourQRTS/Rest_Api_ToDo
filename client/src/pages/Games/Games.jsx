import React, { useState } from 'react';
import { Gamepad2, Trophy, Users, Zap, ArrowRight } from 'lucide-react';
import EmulatorContainer from './components/EmulatorContainer/EmulatorContainer';
import styles from './Games.module.css';

const Games = () => {
  const [showEmulators, setShowEmulators] = useState(false);

  const featuredGames = [
    {
      id: 1,
      title: "Змійка",
      description: "Класична гра змійка з сучасним дизайном",
      icon: "🐍",
      difficulty: "Легко",
      players: "1 гравець",
      status: "Доступно"
    },
    {
      id: 2,
      title: "Тетріс",
      description: "Легендарна гра з падаючими блоками",
      icon: "🧩",
      difficulty: "Середньо",
      players: "1 гравець",
      status: "Скоро"
    },
    {
      id: 3,
      title: "Пам'ять",
      description: "Гра на розвиток пам'яті та уваги",
      icon: "🧠",
      difficulty: "Легко",
      players: "1-2 гравці",
      status: "В розробці"
    },
    {
      id: 4,
      title: "Пінг-Понг",
      description: "Класична гра пінг-понг для двох гравців",
      icon: "🏓",
      difficulty: "Середньо",
      players: "2 гравці",
      status: "В розробці"
    }
  ];

  const gameCategories = [
    { name: "Аркади", icon: "🎮", count: 8 },
    { name: "Головоломки", icon: "🧩", count: 5 },
    { name: "Стратегії", icon: "⚔️", count: 3 },
    { name: "Спортивні", icon: "⚽", count: 4 }
  ];

  if (showEmulators) {
    return <EmulatorContainer />;
  }

  return (
    <div className={styles.games}>
      <div className={styles.games__header}>
        <div className={styles.games__headerContent}>
          <h1 className={styles.games__title}>
            <Gamepad2 size={48} className={styles.games__titleIcon} />
            Ігри
          </h1>
          <p className={styles.games__subtitle}>
            Відпочиньте та розвивайте свої навички з нашими захоплюючими іграми
          </p>
        </div>
        <div className={styles.games__stats}>
          <div className={styles.games__stat}>
            <Trophy size={24} />
            <span>20+ ігор</span>
          </div>
          <div className={styles.games__stat}>
            <Users size={24} />
            <span>1000+ гравців</span>
          </div>
          <div className={styles.games__stat}>
            <Zap size={24} />
            <span>Безкоштовно</span>
          </div>
        </div>
      </div>

      <div className={styles.games__content}>
        <section className={styles.games__emulators}>
          <div className={styles.games__sectionHeader}>
            <h2 className={styles.games__sectionTitle}>Емулятори консолей</h2>
            <button 
              className={styles.games__emulatorsButton}
              onClick={() => setShowEmulators(true)}
            >
              Відкрити всі емулятори
              <ArrowRight size={20} />
            </button>
          </div>
          <div className={styles.games__emulatorsGrid}>
            <div className={styles.games__emulatorCard}>
              <span className={styles.games__emulatorIcon}>🎮</span>
              <h3>GameBoy</h3>
              <p>Класичні 8-бітні ігри</p>
              <span className={styles.games__emulatorStatus}>Доступно</span>
            </div>
            <div className={styles.games__emulatorCard}>
              <span className={styles.games__emulatorIcon}>🕹️</span>
              <h3>Dendy (NES)</h3>
              <p>Легендарні ігри Nintendo</p>
              <span className={styles.games__emulatorStatus}>Доступно</span>
            </div>
            <div className={styles.games__emulatorCard}>
              <span className={styles.games__emulatorIcon}>🎯</span>
              <h3>Super Famicom</h3>
              <p>16-бітні ігри SNES</p>
              <span className={styles.games__emulatorStatus}>Скоро</span>
            </div>
            <div className={styles.games__emulatorCard}>
              <span className={styles.games__emulatorIcon}>💿</span>
              <h3>PlayStation 1</h3>
              <p>3D ігри PS1</p>
              <span className={styles.games__emulatorStatus}>В розробці</span>
            </div>
          </div>
        </section>

        <section className={styles.games__featured}>
          <h2 className={styles.games__sectionTitle}>Популярні ігри</h2>
          <div className={styles.games__grid}>
            {featuredGames.map((game) => (
              <div key={game.id} className={styles.games__card}>
                <div className={styles.games__cardHeader}>
                  <span className={styles.games__cardIcon}>{game.icon}</span>
                  <div className={styles.games__cardStatus}>
                    <span className={`${styles.games__status} ${styles[`games__status--${game.status.toLowerCase().replace(/\s+/g, '-')}`]}`}>
                      {game.status}
                    </span>
                  </div>
                </div>
                <div className={styles.games__cardContent}>
                  <h3 className={styles.games__cardTitle}>{game.title}</h3>
                  <p className={styles.games__cardDescription}>{game.description}</p>
                  <div className={styles.games__cardMeta}>
                    <span className={styles.games__cardDifficulty}>{game.difficulty}</span>
                    <span className={styles.games__cardPlayers}>{game.players}</span>
                  </div>
                </div>
                <div className={styles.games__cardActions}>
                  <button 
                    className={`${styles.games__playButton} ${game.status !== 'Доступно' ? styles.games__playButtonDisabled : ''}`}
                    disabled={game.status !== 'Доступно'}
                  >
                    {game.status === 'Доступно' ? 'Грати' : game.status}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.games__categories}>
          <h2 className={styles.games__sectionTitle}>Категорії ігор</h2>
          <div className={styles.games__categoriesGrid}>
            {gameCategories.map((category, index) => (
              <div key={index} className={styles.games__categoryCard}>
                <span className={styles.games__categoryIcon}>{category.icon}</span>
                <h3 className={styles.games__categoryTitle}>{category.name}</h3>
                <span className={styles.games__categoryCount}>{category.count} ігор</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.games__comingSoon}>
          <h2 className={styles.games__sectionTitle}>Скоро з'являться</h2>
          <div className={styles.games__comingSoonContent}>
            <p className={styles.games__comingSoonText}>
              Ми працюємо над новими захоплюючими іграми. Слідкуйте за оновленнями!
            </p>
            <div className={styles.games__comingSoonGames}>
              <div className={styles.games__comingSoonGame}>
                <span>🎯</span>
                <span>Снайпер</span>
              </div>
              <div className={styles.games__comingSoonGame}>
                <span>🏎️</span>
                <span>Гонки</span>
              </div>
              <div className={styles.games__comingSoonGame}>
                <span>🎲</span>
                <span>Покер</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Games; 