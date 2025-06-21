import React from 'react';
import { motion } from "framer-motion";
import { Download, Trash2 } from "lucide-react";
import AudioPlayer from './AudioPlayer';

const RecordingsList = ({ recordings, activePlayer, onTogglePlay, onDownload, onDelete, styles }) => {
  if (recordings.length === 0) {
    return null;
  }

  return (
    <motion.section
      className={styles.recordingsList}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h3>Записи</h3>
      <ul>
        {recordings.map((rec, index) => (
          <li key={index}>
            <div className={styles.recordingInfo}>
              <AudioPlayer 
                url={rec.url}
                styles={styles}
                isPlaying={activePlayer === index}
                onTogglePlay={() => onTogglePlay(index)}
              />
              <span>Запись от {rec.timestamp.toLocaleString()}</span>
            </div>
            <div className={styles.recordingActions}>
              <button onClick={() => onDownload(rec.url, rec.timestamp)} title="Скачать">
                <Download size={18} />
              </button>
              <button onClick={() => onDelete(index)} className={styles.deleteButton} title="Удалить">
                <Trash2 size={18} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </motion.section>
  );
};

export default RecordingsList; 