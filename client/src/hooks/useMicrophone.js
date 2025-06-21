import { useState, useEffect, useRef, useCallback } from 'react';

const useMicrophone = () => {
  // --- Основные состояния ---
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- Управление устройствами ---
  const [devices, setDevices] = useState([]);
  const [activeStreams, setActiveStreams] = useState({}); // { [deviceId]: stream }

  // --- Состояния для записи ---
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // --- Состояния для инструментов ---
  const [playbackDelay, setPlaybackDelay] = useState(1);
  const [isPlaybackEnabled, setIsPlaybackEnabled] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState({}); // { [deviceId]: level }
  const [isMeasuringNoise, setIsMeasuringNoise] = useState(false);
  
  const audioContextsRef = useRef({}); // { [contextId]: context }

  // --- Управление устройствами и потоками ---
  const getDevices = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true }); // Запрос разрешений
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioDevices = allDevices.filter(device => device.kind === 'audioinput');
      setDevices(audioDevices);
    } catch (err) {
      setError("Не удалось получить доступ к микрофонам. Проверьте разрешения в браузере.");
    }
  }, []);

  useEffect(() => {
    getDevices();
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [getDevices]);
  
  const toggleDevice = useCallback(async (deviceId) => {
    const stream = activeStreams[deviceId];
    
    if (stream) {
      // Отключаем устройство
      stream.getTracks().forEach(track => track.stop());
      const newStreams = { ...activeStreams };
      delete newStreams[deviceId];
      setActiveStreams(newStreams);
    } else {
      // Включаем устройство
      try {
        const newStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: deviceId } }
        });
        setActiveStreams(prev => ({ ...prev, [deviceId]: newStream }));
      } catch (err) {
        setError(`Не удалось получить доступ к устройству: ${deviceId}`);
      }
    }
  }, [activeStreams]);


  // --- Запись (работает, только если выбран 1 микрофон) ---
  const startRecording = useCallback(async () => {
    const streamIds = Object.keys(activeStreams);
    if (streamIds.length !== 1) {
      setError("Для записи должен быть выбран ровно один микрофон.");
      return;
    }
    const stream = activeStreams[streamIds[0]];
    
    setIsLoading(true);
    setError(null);
    try {
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      mediaRecorderRef.current.ondataavailable = e => audioChunksRef.current.push(e.data);
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Не удалось начать запись.');
    } finally {
      setIsLoading(false);
    }
  }, [activeStreams]);

  const stopRecording = useCallback(() => {
    return new Promise((resolve) => {
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          resolve({ blob: audioBlob, url: URL.createObjectURL(audioBlob) });
          audioChunksRef.current = [];
        };
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } else {
        resolve(null);
      }
    });
  }, [isRecording]);

  // --- Воспроизведение с задержкой (работает, только если выбран 1 микрофон) ---
   useEffect(() => {
    const streamIds = Object.keys(activeStreams);
    const contextId = 'playback';

    if (isPlaybackEnabled && streamIds.length === 1) {
      const stream = activeStreams[streamIds[0]];
      const context = new (window.AudioContext || window.webkitAudioContext)();
      const source = context.createMediaStreamSource(stream);
      const delayNode = context.createDelay(10.0);
      delayNode.delayTime.value = playbackDelay;
      
      source.connect(delayNode);
      delayNode.connect(context.destination);
      audioContextsRef.current[contextId] = { context, source, delayNode };
    }

    return () => {
      if (audioContextsRef.current[contextId]) {
        audioContextsRef.current[contextId].context.close();
        delete audioContextsRef.current[contextId];
      }
    };
  }, [isPlaybackEnabled, activeStreams, playbackDelay]);

  useEffect(() => {
    const contextId = 'playback';
    if (audioContextsRef.current[contextId]) {
      audioContextsRef.current[contextId].delayNode.delayTime.value = playbackDelay;
    }
  }, [playbackDelay]);

  // --- Измерение шума (для всех выбранных микрофонов) ---
  const measureNoiseLevel = useCallback(async () => {
    setIsMeasuringNoise(true);
    setNoiseLevel({});
    
    const noiseResults = {};
    const streamsToMeasure = Object.entries(activeStreams);

    for (const [deviceId, stream] of streamsToMeasure) {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 2048;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        let total = 0;
        const measureDuration = 3000;
        const interval = 100;
        const iterations = measureDuration / interval;
        
        for (let i = 0; i < iterations; i++) {
          await new Promise(r => setTimeout(r, interval));
          analyser.getByteFrequencyData(dataArray);
          total += dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
        }
        
        noiseResults[deviceId] = (total / iterations / 255 * 100).toFixed(2);
        audioContext.close();
      } catch (err) {
        console.error(`Ошибка измерения шума для ${deviceId}:`, err);
      }
    }
    
    setNoiseLevel(noiseResults);
    setIsMeasuringNoise(false);
  }, [activeStreams]);

  // --- Очистка ---
  useEffect(() => {
    return () => {
      Object.values(activeStreams).forEach(s => s.getTracks().forEach(t => t.stop()));
      Object.values(audioContextsRef.current).forEach(c => c.context.close());
    };
  }, []); // Пустой массив зависимостей, чтобы сработать только при размонтировании

  return {
    error, isLoading, devices, activeStreams, isRecording,
    toggleDevice, startRecording, stopRecording, clearError: () => setError(null),
    
    isPlaybackEnabled, playbackDelay, noiseLevel, isMeasuringNoise,
    setIsPlaybackEnabled, setPlaybackDelay, measureNoiseLevel,
  };
};

export default useMicrophone; 