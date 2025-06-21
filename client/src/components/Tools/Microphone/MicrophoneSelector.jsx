import React from 'react';
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const MicrophoneSelector = ({ devices, activeDevices, onToggleDevice, styles }) => {
  if (devices.length === 0) {
    return (
      <div className={styles.toolCard}>
        <p>Аудиоустройства не найдены.</p>
      </div>
    );
  }

  return (
    <motion.div 
      className={styles.toolCard}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.1 } }}
    >
      <div className={styles.cardHeader}>
        <h4><Mic size={20} /> Выбор микрофона</h4>
      </div>
      <div className={styles.deviceList}>
        {devices.map((device) => (
          <label key={device.deviceId} className={styles.deviceItem}>
            <input
              type="checkbox"
              checked={!!activeDevices[device.deviceId]}
              onChange={() => onToggleDevice(device.deviceId)}
            />
            <span>{device.label || `Микрофон ${devices.indexOf(device) + 1}`}</span>
          </label>
        ))}
      </div>
    </motion.div>
  );
};

export default MicrophoneSelector; 