import React from 'react';
import ExternalEmulator from './ExternalEmulator';
import styles from './Games.module.css';

const Games = () => {
  return (
    <div className={styles.gamesPage}>
      <ExternalEmulator />
    </div>
  );
};

export default Games; 