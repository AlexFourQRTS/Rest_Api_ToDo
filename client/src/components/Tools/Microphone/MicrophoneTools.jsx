import React from 'react';
import { motion } from "framer-motion";
import { Volume2, HelpCircle } from "lucide-react";

const MicrophoneTools = ({
  isPlaybackEnabled,
  setIsPlaybackEnabled,
  isRecording,
  activeStreams,
  playbackDelay,
  setPlaybackDelay,
  measureNoiseLevel,
  isMeasuringNoise,
  noiseLevel,
  devices, // Получаем полный список устройств
  styles
}) => {
  const canUseTools = Object.keys(activeStreams).length === 1;
  const hasActiveStreams = Object.keys(activeStreams).length > 0;

  return (
    <motion.section
      className={styles.toolsContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3 } }}
    >
      {/* Воспроизведение с задержкой */}
      <div className={`${styles.toolCard} ${!canUseTools && styles.disabledCard}`}>
        <div className={styles.cardHeader}>
          <h4><Volume2 size={20} /> Воспроизведение с задержкой</h4>
          <label className={styles.switch}>
            <input type="checkbox" checked={isPlaybackEnabled} onChange={() => setIsPlaybackEnabled(p => !p)} disabled={!canUseTools} />
            <span className={styles.slider}></span>
          </label>
        </div>
        {!canUseTools && <p className={styles.cardDescription}>Доступно только при выборе одного микрофона.</p>}
        {isPlaybackEnabled && canUseTools && (
          <div className={styles.delayControl}>
            <label>Задержка: {playbackDelay} сек.</label>
            <input
              type="range"
              min="1" max="8" step="1"
              value={playbackDelay}
              onChange={(e) => setPlaybackDelay(Number(e.target.value))}
              className={styles.rangeSlider}
            />
          </div>
        )}
      </div>

      {/* Измерение уровня шума */}
      <div className={`${styles.toolCard} ${!hasActiveStreams && styles.disabledCard}`}>
        <div className={styles.cardHeader}>
          <h4><HelpCircle size={20} /> Измерить уровень шума</h4>
        </div>
        <p className={styles.cardDescription}>Измеряет фоновый шум для всех выбранных микрофонов.</p>
        <button onClick={measureNoiseLevel} disabled={isMeasuringNoise || !hasActiveStreams} className={styles.measureButton}>
          {isMeasuringNoise ? 'Измерение...' : 'Начать измерение'}
        </button>
        {Object.keys(noiseLevel).length > 0 && (
          <div className={styles.noiseResultsContainer}>
            {Object.entries(noiseLevel).map(([deviceId, level]) => {
              const device = devices.find(d => d.deviceId === deviceId);
              return (
                <div key={deviceId} className={styles.noiseResult}>
                  <span>{device?.label || 'Неизвестный микрофон'}:</span>
                  <strong>{level}%</strong>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.section>
  );
};

export default MicrophoneTools; 