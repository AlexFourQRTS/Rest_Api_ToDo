import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX, Play, Square, Triangle, Zap, RotateCcw, Settings } from "lucide-react";
import styles from "./ToneGenerator.module.css";
import Hero from "../../../components/UI/Hero/Hero";
import useToneGenerator from "../../../hooks/useToneGenerator";

const ToneGenerator = () => {
  const {
    isPlaying,
    frequency,
    amplitude,
    waveform,
    error,
    isContinuous,
    isLooping,
    lowFreq,
    midFreq,
    highFreq,
    activeBand,
    cycleCount,
    maxCycles,
    bassPresets,
    waveforms,
    frequencyBands,
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
    clearError
  } = useToneGenerator();

  const [currentPreset, setCurrentPreset] = useState(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [tempCustomFreq, setTempCustomFreq] = useState('');
  const [showCustomBassInput, setShowCustomBassInput] = useState(false);
  const [customBassFreq, setCustomBassFreq] = useState('');
  
  // Состояние аккордеона для категорий пресетов
  const [openCategories, setOpenCategories] = useState({
    'ultra-low': false,
    'very-low': false,
    'low': false,
    'mid-low': false,
    'mid': false,
    'mid-high': false,
    'high': false,
    'very-high': false,
    'custom': false
  });

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Очистка ошибки при изменении
  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  // Обработчик воспроизведения/остановки
  const handlePlayStop = () => {
    if (isPlaying) {
      stopTone();
      stopLooping();
    } else {
      playTone(frequency, amplitude, waveform, isContinuous);
    }
  };

  // Обработчик изменения частоты через слайдер
  const handleFrequencyChange = (e) => {
    const newFreq = parseInt(e.target.value);
    changeFrequency(newFreq);
  };

  // Обработчик изменения частоты в полосе
  const handleBandFrequencyChange = (band, e) => {
    changeBandFrequency(band, e.target.value);
  };

  // Обработчик изменения амплитуды
  const handleAmplitudeChange = (e) => {
    const newAmp = parseFloat(e.target.value);
    changeAmplitude(newAmp);
  };

  // Обработчик переключения режима
  const handleContinuousToggle = (e) => {
    toggleContinuous(e.target.checked);
  };

  // Обработчик нажатия на басовую кнопку
  const handleBassPreset = (preset) => {
    if (preset.isCustom) {
      setShowCustomBassInput(true);
      return;
    }
    setCurrentPreset(preset);
    playBassPreset(preset, false);
  };

  // Обработчик зацикливания баса
  const handleBassLoop = (preset) => {
    if (preset.isCustom) {
      setShowCustomBassInput(true);
      return;
    }
    setCurrentPreset(preset);
    playBassPreset(preset, true);
  };

  // Обработчик отправки кастомной басовой частоты
  const handleCustomBassSubmit = (e) => {
    e.preventDefault();
    const freq = parseFloat(customBassFreq);
    if (!isNaN(freq) && freq >= 1 && freq <= 21000) {
      const customPreset = {
        name: `${freq} Гц`,
        frequency: freq,
        description: 'Кастомная частота',
        isCustom: true
      };
      setCurrentPreset(customPreset);
      playBassPreset(customPreset, false);
      setShowCustomBassInput(false);
      setCustomBassFreq('');
    } else {
      clearError(); // Очищаем предыдущие ошибки
      setTimeout(() => {
        // Показываем ошибку через clearError (это временное решение)
        console.error('Частота должна быть от 1 до 21000 Гц');
      }, 100);
    }
  };

  // Обработчик остановки зацикливания
  const handleStopLooping = () => {
    stopLooping();
    setCurrentPreset(null);
  };

  // Обработчик отправки кастомной частоты
  const handleCustomFrequencySubmit = (e) => {
    e.preventDefault();
    setExactFrequency(tempCustomFreq);
    setShowCustomInput(false);
  };

  // Форматирование частоты для отображения
  const formatFrequency = (freq) => {
    if (freq >= 1000) {
      return `${(freq / 1000).toFixed(1)} кГц`;
    }
    return `${freq} Гц`;
  };

  // Функция переключения категории
  const toggleCategory = (category) => {
    setOpenCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className={styles.toneGenerator}>
      <motion.section
        className={styles.intro}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Hero 
          title="Тон-генератор" 
          subtitle="Создание звуковых волн различной частоты и формы" 
        />
      </motion.section>

      <motion.section
        className={styles.content}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Основные элементы управления */}
        <div className={styles.mainControls}>
          {/* Кнопка воспроизведения */}
          <div className={styles.playSection}>
            <button
              onClick={handlePlayStop}
              className={`${styles.playButton} ${isPlaying ? styles.playing : ''}`}
              disabled={!!error}
            >
              {isPlaying ? <VolumeX size={32} /> : <Play size={32} />}
            </button>
            <div className={styles.playInfo}>
              <span className={styles.frequencyDisplay}>
                {formatFrequency(frequency)}
              </span>
              <span className={styles.waveformDisplay}>
                {waveforms.find(w => w.value === waveform)?.label}
              </span>
              <span className={styles.bandDisplay}>
                {frequencyBands[activeBand]?.label}
              </span>
              {isLooping && (
                <span className={styles.loopingIndicator}>
                  🔄 Зацикливание ({cycleCount}/{maxCycles})
                </span>
              )}
            </div>
          </div>

          {/* Режим воспроизведения */}
          <div className={styles.modeToggle}>
            <label className={styles.toggleLabel}>
              <input
                type="checkbox"
                checked={isContinuous}
                onChange={handleContinuousToggle}
                className={styles.toggleInput}
              />
              <span className={styles.toggleSlider}></span>
              Непрерывное воспроизведение
            </label>
          </div>
        </div>

        {/* Панель настроек */}
        <div className={styles.settingsPanel}>
          {/* Управление частотой - три полосы */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              Частота: {formatFrequency(frequency)}
            </label>
            
            {/* Три полосы частот */}
            <div className={styles.frequencyBands}>
              {/* Низкие частоты */}
              <div className={`${styles.frequencyBand} ${activeBand === 'low' ? styles.active : ''}`}>
                <div className={styles.bandHeader}>
                  <span className={styles.bandLabel} style={{ color: frequencyBands.low.color }}>
                    {frequencyBands.low.label}
                  </span>
                  <span className={styles.bandFreq}>
                    {formatFrequency(lowFreq)}
                  </span>
                </div>
                <input
                  type="range"
                  min={frequencyBands.low.min}
                  max={frequencyBands.low.max}
                  value={lowFreq}
                  onChange={(e) => handleBandFrequencyChange('low', e)}
                  className={`${styles.frequencySlider} ${styles.lowSlider}`}
                  style={{ '--slider-color': frequencyBands.low.color }}
                />
                <div className={styles.rangeLabels}>
                  <span>{frequencyBands.low.min} Гц</span>
                  <span>{frequencyBands.low.max} Гц</span>
                </div>
              </div>

              {/* Средние частоты */}
              <div className={`${styles.frequencyBand} ${activeBand === 'mid' ? styles.active : ''}`}>
                <div className={styles.bandHeader}>
                  <span className={styles.bandLabel} style={{ color: frequencyBands.mid.color }}>
                    {frequencyBands.mid.label}
                  </span>
                  <span className={styles.bandFreq}>
                    {formatFrequency(midFreq)}
                  </span>
                </div>
                <input
                  type="range"
                  min={frequencyBands.mid.min}
                  max={frequencyBands.mid.max}
                  value={midFreq}
                  onChange={(e) => handleBandFrequencyChange('mid', e)}
                  className={`${styles.frequencySlider} ${styles.midSlider}`}
                  style={{ '--slider-color': frequencyBands.mid.color }}
                />
                <div className={styles.rangeLabels}>
                  <span>{frequencyBands.mid.min} Гц</span>
                  <span>{frequencyBands.mid.max} Гц</span>
                </div>
              </div>

              {/* Высокие частоты */}
              <div className={`${styles.frequencyBand} ${activeBand === 'high' ? styles.active : ''}`}>
                <div className={styles.bandHeader}>
                  <span className={styles.bandLabel} style={{ color: frequencyBands.high.color }}>
                    {frequencyBands.high.label}
                  </span>
                  <span className={styles.bandFreq}>
                    {formatFrequency(highFreq)}
                  </span>
                </div>
                <input
                  type="range"
                  min={frequencyBands.high.min}
                  max={frequencyBands.high.max}
                  value={highFreq}
                  onChange={(e) => handleBandFrequencyChange('high', e)}
                  className={`${styles.frequencySlider} ${styles.highSlider}`}
                  style={{ '--slider-color': frequencyBands.high.color }}
                />
                <div className={styles.rangeLabels}>
                  <span>{frequencyBands.high.min} Гц</span>
                  <span>{formatFrequency(frequencyBands.high.max)}</span>
                </div>
              </div>
            </div>

            {/* Точный ввод частоты */}
            <div className={styles.frequencyInput}>
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className={styles.customFreqButton}
                title="Точный ввод частоты"
              >
                <Settings size={16} />
              </button>
            </div>

            {/* Поле точного ввода */}
            {showCustomInput && (
              <motion.form
                className={styles.customFreqForm}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                onSubmit={handleCustomFrequencySubmit}
              >
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="21000"
                  placeholder="Введите точную частоту (например: 17.5)"
                  value={tempCustomFreq}
                  onChange={(e) => setTempCustomFreq(e.target.value)}
                  className={styles.customFreqInput}
                />
                <button type="submit" className={styles.customFreqSubmit}>
                  Установить
                </button>
              </motion.form>
            )}
          </div>

          {/* Управление амплитудой */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              Громкость: {Math.round(amplitude * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={amplitude}
              onChange={handleAmplitudeChange}
              className={styles.amplitudeSlider}
            />
            <div className={styles.rangeLabels}>
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Выбор формы волны */}
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>Форма волны</label>
            <div className={styles.waveformButtons}>
              {waveforms.map((wave) => (
                <button
                  key={wave.value}
                  onClick={() => changeWaveform(wave.value)}
                  className={`${styles.waveformButton} ${
                    waveform === wave.value ? styles.active : ''
                  }`}
                  title={wave.description}
                >
                  {wave.value === 'sine' && <Volume2 size={20} />}
                  {wave.value === 'square' && <Square size={20} />}
                  {wave.value === 'sawtooth' && <Zap size={20} />}
                  {wave.value === 'triangle' && <Triangle size={20} />}
                  <span>{wave.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Басовые пресеты */}
        <div className={styles.bassPresets}>
          <div className={styles.presetsHeader}>
            <h3>Частотные пресеты</h3>
            {isLooping && (
              <button
                onClick={handleStopLooping}
                className={styles.stopLoopButton}
                title="Остановить зацикливание"
              >
                <RotateCcw size={16} />
                Остановить ({maxCycles - cycleCount} осталось)
              </button>
            )}
          </div>
          
          {/* Группировка пресетов по категориям */}
          <div className={styles.presetCategories}>
            {/* Ультра низкие частоты */}
            <div className={styles.presetCategory}>
              <button 
                className={styles.categoryHeader}
                onClick={() => toggleCategory('ultra-low')}
              >
                <h4 className={styles.categoryTitle}>Ультра низкие (1-20 Гц)</h4>
                <span className={`${styles.accordionIcon} ${openCategories['ultra-low'] ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['ultra-low'] && (
                <motion.div 
                  className={styles.categoryContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.presetGrid}>
                    {bassPresets
                      .filter(preset => preset.category === 'ultra-low')
                      .map((preset) => (
                        <div key={preset.frequency} className={styles.presetContainer}>
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`${styles.presetButton} ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? styles.active : ''
                            }`}
                            title={preset.description}
                          >
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetFreq}>{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`${styles.loopButton} ${
                              currentPreset?.frequency === preset.frequency && isLooping ? styles.active : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Очень низкие частоты */}
            <div className={styles.presetCategory}>
              <button 
                className={styles.categoryHeader}
                onClick={() => toggleCategory('very-low')}
              >
                <h4 className={styles.categoryTitle}>Очень низкие (25-40 Гц)</h4>
                <span className={`${styles.accordionIcon} ${openCategories['very-low'] ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['very-low'] && (
                <motion.div 
                  className={styles.categoryContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.presetGrid}>
                    {bassPresets
                      .filter(preset => preset.category === 'very-low')
                      .map((preset) => (
                        <div key={preset.frequency} className={styles.presetContainer}>
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`${styles.presetButton} ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? styles.active : ''
                            }`}
                            title={preset.description}
                          >
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetFreq}>{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`${styles.loopButton} ${
                              currentPreset?.frequency === preset.frequency && isLooping ? styles.active : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Низкие частоты */}
            <div className={styles.presetCategory}>
              <button 
                className={styles.categoryHeader}
                onClick={() => toggleCategory('low')}
              >
                <h4 className={styles.categoryTitle}>Низкие (45-80 Гц)</h4>
                <span className={`${styles.accordionIcon} ${openCategories['low'] ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['low'] && (
                <motion.div 
                  className={styles.categoryContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.presetGrid}>
                    {bassPresets
                      .filter(preset => preset.category === 'low')
                      .map((preset) => (
                        <div key={preset.frequency} className={styles.presetContainer}>
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`${styles.presetButton} ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? styles.active : ''
                            }`}
                            title={preset.description}
                          >
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetFreq}>{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`${styles.loopButton} ${
                              currentPreset?.frequency === preset.frequency && isLooping ? styles.active : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Средние низкие частоты */}
            <div className={styles.presetCategory}>
              <button 
                className={styles.categoryHeader}
                onClick={() => toggleCategory('mid-low')}
              >
                <h4 className={styles.categoryTitle}>Средние низкие (100-200 Гц)</h4>
                <span className={`${styles.accordionIcon} ${openCategories['mid-low'] ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['mid-low'] && (
                <motion.div 
                  className={styles.categoryContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.presetGrid}>
                    {bassPresets
                      .filter(preset => preset.category === 'mid-low')
                      .map((preset) => (
                        <div key={preset.frequency} className={styles.presetContainer}>
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`${styles.presetButton} ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? styles.active : ''
                            }`}
                            title={preset.description}
                          >
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetFreq}>{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`${styles.loopButton} ${
                              currentPreset?.frequency === preset.frequency && isLooping ? styles.active : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Средние частоты */}
            <div className={styles.presetCategory}>
              <button 
                className={styles.categoryHeader}
                onClick={() => toggleCategory('mid')}
              >
                <h4 className={styles.categoryTitle}>Средние (250-500 Гц)</h4>
                <span className={`${styles.accordionIcon} ${openCategories['mid'] ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['mid'] && (
                <motion.div 
                  className={styles.categoryContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.presetGrid}>
                    {bassPresets
                      .filter(preset => preset.category === 'mid')
                      .map((preset) => (
                        <div key={preset.frequency} className={styles.presetContainer}>
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`${styles.presetButton} ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? styles.active : ''
                            }`}
                            title={preset.description}
                          >
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetFreq}>{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`${styles.loopButton} ${
                              currentPreset?.frequency === preset.frequency && isLooping ? styles.active : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Высокие средние частоты */}
            <div className={styles.presetCategory}>
              <button 
                className={styles.categoryHeader}
                onClick={() => toggleCategory('mid-high')}
              >
                <h4 className={styles.categoryTitle}>Высокие средние (630-2000 Гц)</h4>
                <span className={`${styles.accordionIcon} ${openCategories['mid-high'] ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['mid-high'] && (
                <motion.div 
                  className={styles.categoryContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.presetGrid}>
                    {bassPresets
                      .filter(preset => preset.category === 'mid-high')
                      .map((preset) => (
                        <div key={preset.frequency} className={styles.presetContainer}>
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`${styles.presetButton} ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? styles.active : ''
                            }`}
                            title={preset.description}
                          >
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetFreq}>{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`${styles.loopButton} ${
                              currentPreset?.frequency === preset.frequency && isLooping ? styles.active : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Высокие частоты */}
            <div className={styles.presetCategory}>
              <button 
                className={styles.categoryHeader}
                onClick={() => toggleCategory('high')}
              >
                <h4 className={styles.categoryTitle}>Высокие (2500-8000 Гц)</h4>
                <span className={`${styles.accordionIcon} ${openCategories['high'] ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['high'] && (
                <motion.div 
                  className={styles.categoryContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.presetGrid}>
                    {bassPresets
                      .filter(preset => preset.category === 'high')
                      .map((preset) => (
                        <div key={preset.frequency} className={styles.presetContainer}>
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`${styles.presetButton} ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? styles.active : ''
                            }`}
                            title={preset.description}
                          >
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetFreq}>{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`${styles.loopButton} ${
                              currentPreset?.frequency === preset.frequency && isLooping ? styles.active : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Очень высокие частоты */}
            <div className={styles.presetCategory}>
              <button 
                className={styles.categoryHeader}
                onClick={() => toggleCategory('very-high')}
              >
                <h4 className={styles.categoryTitle}>Очень высокие (10-21 кГц)</h4>
                <span className={`${styles.accordionIcon} ${openCategories['very-high'] ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['very-high'] && (
                <motion.div 
                  className={styles.categoryContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.presetGrid}>
                    {bassPresets
                      .filter(preset => preset.category === 'very-high')
                      .map((preset) => (
                        <div key={preset.frequency} className={styles.presetContainer}>
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`${styles.presetButton} ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? styles.active : ''
                            }`}
                            title={preset.description}
                          >
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetFreq}>{formatFrequency(preset.frequency)}</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`${styles.loopButton} ${
                              currentPreset?.frequency === preset.frequency && isLooping ? styles.active : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Кастомный пресет */}
            <div className={styles.presetCategory}>
              <button 
                className={styles.categoryHeader}
                onClick={() => toggleCategory('custom')}
              >
                <h4 className={styles.categoryTitle}>Кастомные</h4>
                <span className={`${styles.accordionIcon} ${openCategories['custom'] ? styles.open : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['custom'] && (
                <motion.div 
                  className={styles.categoryContent}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.presetGrid}>
                    {bassPresets
                      .filter(preset => preset.category === 'custom')
                      .map((preset) => (
                        <div key="custom" className={styles.presetContainer}>
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`${styles.presetButton} ${styles.customPreset}`}
                            title={preset.description}
                          >
                            <div className={styles.presetName}>{preset.name}</div>
                            <div className={styles.presetFreq}>Ввести частоту</div>
                          </button>
                        </div>
                      ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Модальное окно для кастомной басовой частоты */}
        {showCustomBassInput && (
          <motion.div
            className={styles.modalOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setShowCustomBassInput(false)}
          >
            <motion.div
              className={styles.modal}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Кастомная басовая частота</h3>
              <form onSubmit={handleCustomBassSubmit}>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="21000"
                  placeholder="Введите частоту (например: 17.5)"
                  value={customBassFreq}
                  onChange={(e) => setCustomBassFreq(e.target.value)}
                  className={styles.modalInput}
                  autoFocus
                />
                <div className={styles.modalButtons}>
                  <button type="submit" className={styles.modalSubmit}>
                    Воспроизвести
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomBassInput(false)}
                    className={styles.modalCancel}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Отображение ошибок */}
        {error && (
          <motion.div
            className={styles.error}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>{error}</p>
          </motion.div>
        )}
      </motion.section>
    </div>
  );
};

export default ToneGenerator; 