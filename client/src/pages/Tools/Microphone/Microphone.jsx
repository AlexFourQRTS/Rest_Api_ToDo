import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styles from "./Microphone.module.css";
import Hero from "../../../components/UI/Hero/Hero";
import useMicrophone from "../../../hooks/useMicrophone";

// Импортируем новые и обновленные компоненты
import MicrophoneSelector from "../../../components/Tools/Microphone/MicrophoneSelector";
import MicrophoneControls from "../../../components/Tools/Microphone/MicrophoneControls";
import MicrophoneTools from "../../../components/Tools/Microphone/MicrophoneTools";
import RecordingsList from "../../../components/Tools/Microphone/RecordingsList";

const Microphone = () => {
  const {
    error, isLoading, devices, activeStreams, isRecording,
    toggleDevice, startRecording, stopRecording, clearError,
    
    isPlaybackEnabled, playbackDelay, noiseLevel, isMeasuringNoise,
    setIsPlaybackEnabled, setPlaybackDelay, measureNoiseLevel,
  } = useMicrophone();

  const [recordings, setRecordings] = useState([]);
  const [activePlayer, setActivePlayer] = useState(null);

  // --- Обработчики для дочерних компонентов ---
  const handleToggleRecording = async () => {
    if (isRecording) {
      const recording = await stopRecording();
      if (recording) {
        setRecordings((prev) => [
          { ...recording, timestamp: new Date() },
          ...prev,
        ]);
      }
    } else {
      await startRecording();
    }
  };

  const downloadRecording = (url, timestamp) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `recording_${timestamp.toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteRecording = (index) => {
    setRecordings(prev => prev.filter((_, i) => i !== index));
  };

  const togglePlay = (index) => {
    setActivePlayer(activePlayer === index ? null : index);
  };
  
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return (
    <div className={styles.microphone}>
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
      >
        <Hero title="Микрофон" subtitle="Запись и анализ звука с вашего устройства" />
      </motion.section>

      <MicrophoneSelector
        devices={devices}
        activeDevices={activeStreams}
        onToggleDevice={toggleDevice}
        styles={styles}
      />

      <MicrophoneControls
        isRecording={isRecording}
        activeStreams={activeStreams}
        onToggleRecording={handleToggleRecording}
        isLoading={isLoading}
        error={error}
        styles={styles}
      />

      <MicrophoneTools
        isPlaybackEnabled={isPlaybackEnabled}
        setIsPlaybackEnabled={setIsPlaybackEnabled}
        isRecording={isRecording}
        activeStreams={activeStreams}
        playbackDelay={playbackDelay}
        setPlaybackDelay={setPlaybackDelay}
        measureNoiseLevel={measureNoiseLevel}
        isMeasuringNoise={isMeasuringNoise}
        noiseLevel={noiseLevel}
        devices={devices}
        styles={styles}
      />

      <RecordingsList
        recordings={recordings}
        activePlayer={activePlayer}
        onTogglePlay={togglePlay}
        onDownload={downloadRecording}
        onDelete={deleteRecording}
        styles={styles}
      />
    </div>
  );
};

export default Microphone;
