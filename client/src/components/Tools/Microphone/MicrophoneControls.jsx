import React from 'react';
import { motion } from "framer-motion";
import { Mic, MicOff, X } from "lucide-react";
import AudioVisualizer from './AudioVisualizer';

const MicrophoneControls = ({
  isRecording,
  activeStreams,
  onToggleRecording,
  isLoading,
  error,
  styles
}) => {
  const activeStreamValues = Object.values(activeStreams);
  const hasActiveStreams = activeStreamValues.length > 0;
  const canRecord = activeStreamValues.length === 1;

  return (
    <motion.section
      className={styles.micContainer}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }}
    >
      <div className={styles.visualizerContainer}>
        {hasActiveStreams ? (
          activeStreamValues.map((stream, index) => (
            <AudioVisualizer key={index} stream={stream} styles={styles} />
          ))
        ) : (
          <div className={styles.placeholder}>
            <Mic size={80} />
            <p>Выберите микрофон, чтобы начать</p>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <button
          onClick={onToggleRecording}
          className={`${styles.recordButton} ${isRecording ? styles.recording : ""}`}
          disabled={isLoading || !canRecord}
          title={!canRecord ? "Для записи должен быть выбран ровно один микрофон" : "Начать/остановить запись"}
        >
          {isLoading ? (
            <div className={styles.spinner}></div>
          ) : isRecording ? (
            <MicOff size={32} />
          ) : (
            <Mic size={32} />
          )}
        </button>
      </div>
      
      {error && <div className={styles.error}><X size={16}/> {error}</div>}
    </motion.section>
  );
};

export default MicrophoneControls; 