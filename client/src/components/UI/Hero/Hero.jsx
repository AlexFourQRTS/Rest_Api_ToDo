import React from 'react';
import Button from '../Button/Button';
import styles from './Hero.module.css';

const Hero = ({ title, subtitle, buttonText, onButtonClick }) => {
  return (
    <section className={styles.hero}>
      <div className={styles.content}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {buttonText && (
          <Button onClick={onButtonClick}>{buttonText}</Button>
        )}
      </div>
    </section>
  );
};

export default Hero;