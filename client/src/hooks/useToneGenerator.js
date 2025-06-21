import { useState, useEffect, useRef, useCallback } from 'react';

const useToneGenerator = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(440);
  const [amplitude, setAmplitude] = useState(0.5);
  const [waveform, setWaveform] = useState('sine');
  const [error, setError] = useState(null);
  const [isContinuous, setIsContinuous] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [customFrequency, setCustomFrequency] = useState('');
  const [cycleCount, setCycleCount] = useState(0);
  const [maxCycles] = useState(10);
  
  // Частотные диапазоны
  const [lowFreq, setLowFreq] = useState(100); // 1-300 Гц
  const [midFreq, setMidFreq] = useState(500); // 301-800 Гц
  const [highFreq, setHighFreq] = useState(2000); // 801-21000 Гц
  const [activeBand, setActiveBand] = useState('mid'); // low, mid, high
  
  const audioContextRef = useRef(null);
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);
  const loopIntervalRef = useRef(null);

  // Частотные диапазоны
  const frequencyBands = {
    low: { min: 1, max: 300, label: 'Низкие частоты', color: '#4caf50' },
    mid: { min: 301, max: 800, label: 'Средние частоты', color: '#ff9800' },
    high: { min: 801, max: 21000, label: 'Высокие частоты', color: '#2196f3' }
  };

  // Расширенные предустановленные басовые частоты
  const bassPresets = [
    // Ультра низкие частоты (1-20 Гц)
    { name: '1 Гц', frequency: 1, description: 'Ультра низкий', category: 'ultra-low' },
    { name: '5 Гц', frequency: 5, description: 'Ультра низкий', category: 'ultra-low' },
    { name: '10 Гц', frequency: 10, description: 'Ультра низкий', category: 'ultra-low' },
    { name: '15 Гц', frequency: 15, description: 'Ультра низкий', category: 'ultra-low' },
    { name: '20 Гц', frequency: 20, description: 'Ультра низкий', category: 'ultra-low' },
    
    // Очень низкие частоты (25-40 Гц)
    { name: '25 Гц', frequency: 25, description: 'Очень низкий', category: 'very-low' },
    { name: '28 Гц', frequency: 28, description: 'Очень низкий', category: 'very-low' },
    { name: '29 Гц', frequency: 29, description: 'Очень низкий', category: 'very-low' },
    { name: '30 Гц', frequency: 30, description: 'Очень низкий', category: 'very-low' },
    { name: '31 Гц', frequency: 31, description: 'Очень низкий', category: 'very-low' },
    { name: '32 Гц', frequency: 32, description: 'Очень низкий', category: 'very-low' },
    { name: '33 Гц', frequency: 33, description: 'Очень низкий', category: 'very-low' },
    { name: '34 Гц', frequency: 34, description: 'Очень низкий', category: 'very-low' },
    { name: '35 Гц', frequency: 35, description: 'Очень низкий', category: 'very-low' },
    { name: '40 Гц', frequency: 40, description: 'Очень низкий', category: 'very-low' },
    
    // Низкие частоты (45-80 Гц)
    { name: '45 Гц', frequency: 45, description: 'Низкий бас', category: 'low' },
    { name: '50 Гц', frequency: 50, description: 'Низкий бас', category: 'low' },
    { name: '55 Гц', frequency: 55, description: 'Низкий бас', category: 'low' },
    { name: '60 Гц', frequency: 60, description: 'Низкий бас', category: 'low' },
    { name: '65 Гц', frequency: 65, description: 'Низкий бас', category: 'low' },
    { name: '80 Гц', frequency: 80, description: 'Низкий бас', category: 'low' },
    
    // Средние низкие частоты (100-200 Гц)
    { name: '100 Гц', frequency: 100, description: 'Средний низкий', category: 'mid-low' },
    { name: '125 Гц', frequency: 125, description: 'Средний низкий', category: 'mid-low' },
    { name: '160 Гц', frequency: 160, description: 'Средний низкий', category: 'mid-low' },
    { name: '200 Гц', frequency: 200, description: 'Средний низкий', category: 'mid-low' },
    
    // Средние частоты (250-500 Гц)
    { name: '250 Гц', frequency: 250, description: 'Средние', category: 'mid' },
    { name: '320 Гц', frequency: 320, description: 'Средние', category: 'mid' },
    { name: '400 Гц', frequency: 400, description: 'Средние', category: 'mid' },
    { name: '500 Гц', frequency: 500, description: 'Средние', category: 'mid' },
    
    // Высокие средние частоты (630-2000 Гц)
    { name: '630 Гц', frequency: 630, description: 'Высокие средние', category: 'mid-high' },
    { name: '800 Гц', frequency: 800, description: 'Высокие средние', category: 'mid-high' },
    { name: '1000 Гц', frequency: 1000, description: 'Высокие средние', category: 'mid-high' },
    { name: '1250 Гц', frequency: 1250, description: 'Высокие средние', category: 'mid-high' },
    { name: '1600 Гц', frequency: 1600, description: 'Высокие средние', category: 'mid-high' },
    { name: '2000 Гц', frequency: 2000, description: 'Высокие средние', category: 'mid-high' },
    
    // Высокие частоты (2500-8000 Гц)
    { name: '2500 Гц', frequency: 2500, description: 'Высокие', category: 'high' },
    { name: '3150 Гц', frequency: 3150, description: 'Высокие', category: 'high' },
    { name: '4000 Гц', frequency: 4000, description: 'Высокие', category: 'high' },
    { name: '5000 Гц', frequency: 5000, description: 'Высокие', category: 'high' },
    { name: '6300 Гц', frequency: 6300, description: 'Высокие', category: 'high' },
    { name: '8000 Гц', frequency: 8000, description: 'Высокие', category: 'high' },
    
    // Очень высокие частоты (10000-21000 Гц)
    { name: '10 кГц', frequency: 10000, description: 'Очень высокие', category: 'very-high' },
    { name: '12.5 кГц', frequency: 12500, description: 'Очень высокие', category: 'very-high' },
    { name: '16 кГц', frequency: 16000, description: 'Очень высокие', category: 'very-high' },
    { name: '20 кГц', frequency: 20000, description: 'Очень высокие', category: 'very-high' },
    { name: '21 кГц', frequency: 21000, description: 'Очень высокие', category: 'very-high' },
    
    // Кастомный пресет
    { name: 'Кастомный', frequency: null, description: 'Введите свою частоту', isCustom: true, category: 'custom' }
  ];

  // Доступные формы волн
  const waveforms = [
    { value: 'sine', label: 'Синус', description: 'Чистый тон' },
    { value: 'square', label: 'Прямоугольная', description: 'Резкий звук' },
    { value: 'sawtooth', label: 'Пила', description: 'Металлический звук' },
    { value: 'triangle', label: 'Треугольная', description: 'Мягкий звук' }
  ];

  // Инициализация аудио контекста
  const initAudioContext = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      return audioContextRef.current;
    } catch (err) {
      setError('Ошибка инициализации аудио контекста');
      console.error('Audio context error:', err);
      return null;
    }
  }, []);

  // Остановка тона
  const stopTone = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      } catch (err) {
        console.error('Stop oscillator error:', err);
      }
    }
    if (gainNodeRef.current) {
      gainNodeRef.current = null;
    }
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  // Воспроизведение тона
  const playTone = useCallback((freq = frequency, amp = amplitude, wave = waveform, continuous = isContinuous) => {
    const audioContext = initAudioContext();
    if (!audioContext) return;

    try {
      // Остановка предыдущего тона (прямая очистка)
      if (oscillatorRef.current) {
        try {
          oscillatorRef.current.stop();
        } catch (err) {
          console.error('Stop previous oscillator error:', err);
        }
        oscillatorRef.current = null;
      }
      if (gainNodeRef.current) {
        gainNodeRef.current = null;
      }
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }

      // Создание осциллятора
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      // Настройка осциллятора
      oscillator.type = wave;
      oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);

      // Настройка громкости
      gainNode.gain.setValueAtTime(amp, audioContext.currentTime);

      // Подключение узлов
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Запуск
      oscillator.start();
      
      if (!continuous) {
        // Остановка через 100мс для короткого звука
        oscillator.stop(audioContext.currentTime + 0.1);
        
        // Автоматическая остановка
        setTimeout(() => {
          setIsPlaying(false);
          oscillatorRef.current = null;
          gainNodeRef.current = null;
        }, 100);
      }

      // Сохранение ссылок
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      setIsPlaying(true);

    } catch (err) {
      setError('Ошибка воспроизведения звука');
      console.error('Play tone error:', err);
    }
  }, [frequency, amplitude, waveform, isContinuous, initAudioContext]);

  // Воспроизведение предустановленного баса с возможностью зацикливания
  const playBassPreset = useCallback((preset, loop = false) => {
    if (loop) {
      // Зацикливание баса - 10 циклов
      setIsLooping(true);
      setCycleCount(0);
      let currentCycle = 0;
      const maxCycles = 10;
      
      // Первый цикл
      playTone(preset.frequency, amplitude, waveform, false);
      currentCycle++;
      setCycleCount(currentCycle);
      
      // Устанавливаем интервал для повторения
      loopIntervalRef.current = setInterval(() => {
        if (currentCycle < maxCycles) {
          playTone(preset.frequency, amplitude, waveform, false);
          currentCycle++;
          setCycleCount(currentCycle);
        } else {
          // Останавливаем зацикливание после 10 циклов
          clearInterval(loopIntervalRef.current);
          loopIntervalRef.current = null;
          setIsLooping(false);
          setCycleCount(0);
        }
      }, 200); // Увеличиваем интервал до 200мс для более заметных циклов
    } else {
      // Обычное воспроизведение
      setIsLooping(false);
      setCycleCount(0);
      if (loopIntervalRef.current) {
        clearInterval(loopIntervalRef.current);
        loopIntervalRef.current = null;
      }
      playTone(preset.frequency, amplitude, waveform, false);
    }
  }, [playTone, amplitude, waveform]);

  // Остановка зацикливания
  const stopLooping = useCallback(() => {
    setIsLooping(false);
    setCycleCount(0);
    if (loopIntervalRef.current) {
      clearInterval(loopIntervalRef.current);
      loopIntervalRef.current = null;
    }
  }, []);

  // Установка точной частоты
  const setExactFrequency = useCallback((freq) => {
    const frequency = parseFloat(freq);
    if (!isNaN(frequency) && frequency >= 1 && frequency <= 21000) {
      setFrequency(frequency);
      // Определяем активную полосу
      if (frequency <= 300) {
        setActiveBand('low');
        setLowFreq(frequency);
      } else if (frequency <= 800) {
        setActiveBand('mid');
        setMidFreq(frequency);
      } else {
        setActiveBand('high');
        setHighFreq(frequency);
      }
      if (isPlaying && isContinuous) {
        // Обновляем частоту текущего осциллятора
        if (oscillatorRef.current) {
          oscillatorRef.current.frequency.setValueAtTime(frequency, audioContextRef.current?.currentTime || 0);
        }
      }
      setCustomFrequency('');
    } else {
      setError('Частота должна быть от 1 до 21000 Гц');
    }
  }, [isPlaying, isContinuous]);

  // Изменение частоты через слайдер
  const changeFrequency = useCallback((newFrequency) => {
    setFrequency(newFrequency);
    setCustomFrequency(newFrequency.toString());
    if (isPlaying && isContinuous) {
      // Обновляем частоту текущего осциллятора
      if (oscillatorRef.current) {
        oscillatorRef.current.frequency.setValueAtTime(newFrequency, audioContextRef.current?.currentTime || 0);
      }
    }
  }, [isPlaying, isContinuous]);

  // Изменение частоты в конкретной полосе
  const changeBandFrequency = useCallback((band, value) => {
    const freq = parseInt(value);
    setActiveBand(band);
    setFrequency(freq);
    setCustomFrequency(freq.toString());
    
    // Обновляем соответствующую полосу
    if (band === 'low') {
      setLowFreq(freq);
    } else if (band === 'mid') {
      setMidFreq(freq);
    } else if (band === 'high') {
      setHighFreq(freq);
    }
    
    if (isPlaying && isContinuous) {
      // Обновляем частоту текущего осциллятора
      if (oscillatorRef.current) {
        oscillatorRef.current.frequency.setValueAtTime(freq, audioContextRef.current?.currentTime || 0);
      }
    }
  }, [isPlaying, isContinuous]);

  // Изменение амплитуды
  const changeAmplitude = useCallback((newAmplitude) => {
    setAmplitude(newAmplitude);
    if (isPlaying && isContinuous) {
      // Обновляем громкость текущего осциллятора
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setValueAtTime(newAmplitude, audioContextRef.current?.currentTime || 0);
      }
    }
  }, [isPlaying, isContinuous]);

  // Изменение формы волны
  const changeWaveform = useCallback((newWaveform) => {
    setWaveform(newWaveform);
    if (isPlaying && isContinuous) {
      // Перезапускаем с новой формой волны
      playTone(frequency, amplitude, newWaveform, true);
    }
  }, [isPlaying, isContinuous, playTone, frequency, amplitude]);

  // Переключение режима воспроизведения
  const toggleContinuous = useCallback((continuous) => {
    setIsContinuous(continuous);
  }, []);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      stopTone();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopTone]);

  return {
    // Состояние
    isPlaying,
    frequency,
    amplitude,
    waveform,
    error,
    isContinuous,
    isLooping,
    customFrequency,
    lowFreq,
    midFreq,
    highFreq,
    activeBand,
    cycleCount,
    maxCycles,
    
    // Данные
    bassPresets,
    waveforms,
    frequencyBands,
    
    // Методы
    playTone,
    stopTone,
    playBassPreset,
    stopLooping,
    setExactFrequency,
    changeFrequency,
    changeBandFrequency,
    changeAmplitude,
    changeWaveform,
    toggleContinuous,
    
    // Утилиты
    clearError: () => setError(null)
  };
};

export default useToneGenerator; 