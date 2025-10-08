import React, { useState, useEffect } from "react";
import { Volume2, VolumeX, Play, Square, Triangle, Zap, RotateCcw, Settings } from "lucide-react";
// Removed CSS module import
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
    <div className="min-h-screen">
      <section
        className="section-padding"
      >
        <Hero 
          title="Тон-генератор" 
          subtitle="Создание звуковых волн различной частоты и формы" 
        />
      </section>

      <section
        className="container-custom py-8"
      >
        {/* Основные элементы управления */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          {/* Кнопка воспроизведения */}
          <div className="text-center">
            <button
              onClick={handlePlayStop}
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all mb-4 ${
                isPlaying ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-600 hover:bg-slate-700'
              }`}
              disabled={!!error}
            >
              {isPlaying ? <VolumeX size={32} /> : <Play size={32} />}
            </button>
            <div className="space-y-2">
              <div className="text-2xl font-bold text-white">
                {formatFrequency(frequency)}
              </div>
              <div className="text-gray-300">
                {waveforms.find(w => w.value === waveform)?.label}
              </div>
              <div className="text-gray-400">
                {frequencyBands[activeBand]?.label}
              </div>
              {isLooping && (
                <div className="text-gray-300">
                  🔄 Зацикливание ({cycleCount}/{maxCycles})
                </div>
              )}
            </div>
          </div>

          {/* Режим воспроизведения */}
          <div className="flex justify-center mt-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isContinuous}
                onChange={handleContinuousToggle}
                className="sr-only"
              />
              <div className={`relative w-12 h-6 rounded-full transition-colors ${
                isContinuous ? 'bg-slate-600' : 'bg-gray-600'
              }`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  isContinuous ? 'transform translate-x-6' : ''
                }`}></div>
              </div>
              <span className="text-white">Непрерывное воспроизведение</span>
            </label>
          </div>
        </div>

        {/* Панель настроек */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          {/* Управление частотой - три полосы */}
          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-4">
              Частота: {formatFrequency(frequency)}
            </label>
            
            {/* Три полосы частот */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Низкие частоты */}
              <div className={`p-4 rounded-lg border transition-all ${
                activeBand === 'low' 
                  ? 'bg-slate-600/20 border-slate-500' 
                  : 'bg-gray-700/50 border-gray-600'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium" style={{ color: frequencyBands.low.color }}>
                    {frequencyBands.low.label}
                  </span>
                  <span className="text-gray-300 font-mono">
                    {formatFrequency(lowFreq)}
                  </span>
                </div>
                <input
                  type="range"
                  min={frequencyBands.low.min}
                  max={frequencyBands.low.max}
                  value={lowFreq}
                  onChange={(e) => handleBandFrequencyChange('low', e)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{ '--slider-color': frequencyBands.low.color }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{frequencyBands.low.min} Гц</span>
                  <span>{frequencyBands.low.max} Гц</span>
                </div>
              </div>

              {/* Средние частоты */}
              <div className={`p-4 rounded-lg border transition-all ${
                activeBand === 'mid' 
                  ? 'bg-slate-600/20 border-slate-500' 
                  : 'bg-gray-700/50 border-gray-600'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium" style={{ color: frequencyBands.mid.color }}>
                    {frequencyBands.mid.label}
                  </span>
                  <span className="text-gray-300 font-mono">
                    {formatFrequency(midFreq)}
                  </span>
                </div>
                <input
                  type="range"
                  min={frequencyBands.mid.min}
                  max={frequencyBands.mid.max}
                  value={midFreq}
                  onChange={(e) => handleBandFrequencyChange('mid', e)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{ '--slider-color': frequencyBands.mid.color }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{frequencyBands.mid.min} Гц</span>
                  <span>{frequencyBands.mid.max} Гц</span>
                </div>
              </div>

              {/* Высокие частоты */}
              <div className={`p-4 rounded-lg border transition-all ${
                activeBand === 'high' 
                  ? 'bg-slate-600/20 border-slate-500' 
                  : 'bg-gray-700/50 border-gray-600'
              }`}>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium" style={{ color: frequencyBands.high.color }}>
                    {frequencyBands.high.label}
                  </span>
                  <span className="text-gray-300 font-mono">
                    {formatFrequency(highFreq)}
                  </span>
                </div>
                <input
                  type="range"
                  min={frequencyBands.high.min}
                  max={frequencyBands.high.max}
                  value={highFreq}
                  onChange={(e) => handleBandFrequencyChange('high', e)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  style={{ '--slider-color': frequencyBands.high.color }}
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{frequencyBands.high.min} Гц</span>
                  <span>{formatFrequency(frequencyBands.high.max)}</span>
                </div>
              </div>
            </div>

            {/* Точный ввод частоты */}
            <div className="mt-4">
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="btn-secondary flex items-center space-x-2"
                title="Точный ввод частоты"
              >
                <Settings size={16} />
                <span>Точный ввод</span>
              </button>
            </div>

            {/* Поле точного ввода */}
            {showCustomInput && (
              <form
                className="mt-2"
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
                  className="input-field w-full"
                />
                <button type="submit" className="btn-primary mt-2">
                  Установить
                </button>
              </form>
            )}
          </div>

          {/* Управление амплитудой */}
          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-4">
              Громкость: {Math.round(amplitude * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={amplitude}
              onChange={handleAmplitudeChange}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Выбор формы волны */}
          <div className="mb-6">
            <label className="block text-white text-lg font-semibold mb-4">Форма волны</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {waveforms.map((wave) => (
                <button
                  key={wave.value}
                  onClick={() => changeWaveform(wave.value)}
                  className={`p-3 rounded-lg border transition-all ${
                    waveform === wave.value 
                      ? 'bg-slate-600/20 border-slate-500 text-white' 
                      : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                  }`}
                  title={wave.description}
                >
                  {wave.value === 'sine' && <Volume2 size={20} />}
                  {wave.value === 'square' && <Square size={20} />}
                  {wave.value === 'sawtooth' && <Zap size={20} />}
                  {wave.value === 'triangle' && <Triangle size={20} />}
                  <span className="block text-sm mt-1">{wave.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Басовые пресеты */}
        <div className="bg-gray-800/50 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-white">Частотные пресеты</h3>
            {isLooping && (
              <button
                onClick={handleStopLooping}
                className="btn-secondary flex items-center space-x-2"
                title="Остановить зацикливание"
              >
                <RotateCcw size={16} />
                <span>Остановить ({maxCycles - cycleCount} осталось)</span>
              </button>
            )}
          </div>
          
          {/* Группировка пресетов по категориям */}
          <div className="space-y-2">
            {/* Ультра низкие частоты */}
            <div className="border border-gray-600 rounded-lg">
              <button 
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleCategory('ultra-low')}
              >
                <h4 className="text-white font-medium">Ультра низкие (1-20 Гц)</h4>
                <span className={`text-white transition-transform ${
                  openCategories['ultra-low'] ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>
              {openCategories['ultra-low'] && (
                <div 
                  className="p-4 border-t border-gray-600"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {bassPresets
                      .filter(preset => preset.category === 'ultra-low')
                      .map((preset) => (
                        <div key={preset.frequency} className="space-y-1">
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`w-full p-2 rounded-lg border transition-all ${
                              currentPreset?.frequency === preset.frequency && !isLooping 
                                ? 'bg-slate-600/20 border-slate-500 text-white' 
                                : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                            }`}
                            title={preset.description}
                          >
                            <div className="text-sm font-medium">{preset.name}</div>
                            <div className="text-xs text-gray-300">{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`w-full p-1 rounded border text-xs transition-all ${
                              currentPreset?.frequency === preset.frequency && isLooping 
                                ? 'bg-purple-600/20 border-purple-500 text-white' 
                                : 'bg-gray-600/50 border-gray-500 text-gray-300 hover:bg-gray-500/50'
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Очень низкие частоты */}
            <div className="border border-gray-600 rounded-lg">
              <button 
                className="w-full p-4 text-left flex justify-between items-center hover:bg-gray-700/50 transition-colors"
                onClick={() => toggleCategory('very-low')}
              >
                <h4 className="text-white font-medium">Очень низкие (25-40 Гц)</h4>
                <span className={`text-white transition-transform ${
                  openCategories['very-low'] ? 'rotate-180' : ''
                }`}>
                  ▼
                </span>
              </button>
              {openCategories['very-low'] && (
                <div 
                  className="p-4 border-t border-gray-600"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {bassPresets
                      .filter(preset => preset.category === 'very-low')
                      .map((preset) => (
                        <div key={preset.frequency} className="space-y-1">
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`w-full p-2 rounded-lg border transition-all ${
                              currentPreset?.frequency === preset.frequency && !isLooping 
                                ? 'bg-slate-600/20 border-slate-500 text-white' 
                                : 'bg-gray-700/50 border-gray-600 text-gray-300 hover:bg-gray-600/50'
                            }`}
                            title={preset.description}
                          >
                            <div className="text-sm font-medium">{preset.name}</div>
                            <div className="text-xs text-gray-300">{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`w-full p-1 rounded border text-xs transition-all ${
                              currentPreset?.frequency === preset.frequency && isLooping 
                                ? 'bg-purple-600/20 border-purple-500 text-white' 
                                : 'bg-gray-600/50 border-gray-500 text-gray-300 hover:bg-gray-500/50'
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Низкие частоты */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => toggleCategory('low')}
              >
                <h4 className="text-white font-semibold">Низкие (45-80 Гц)</h4>
                <span className={`text-gray-300 transition-transform ${openCategories['low'] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['low'] && (
                <div 
                  className="mt-2"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {bassPresets
                      .filter(preset => preset.category === 'low')
                      .map((preset) => (
                        <div key={preset.frequency} className="flex space-x-1">
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`btn-secondary flex-1 text-xs ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={preset.description}
                          >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs opacity-75">{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`btn-secondary p-2 ${
                              currentPreset?.frequency === preset.frequency && isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Средние низкие частоты */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => toggleCategory('mid-low')}
              >
                <h4 className="text-white font-semibold">Средние низкие (100-200 Гц)</h4>
                <span className={`text-gray-300 transition-transform ${openCategories['mid-low'] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['mid-low'] && (
                <div 
                  className="mt-2"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {bassPresets
                      .filter(preset => preset.category === 'mid-low')
                      .map((preset) => (
                        <div key={preset.frequency} className="flex space-x-1">
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`btn-secondary flex-1 text-xs ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={preset.description}
                          >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs opacity-75">{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`btn-secondary p-2 ${
                              currentPreset?.frequency === preset.frequency && isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Средние частоты */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => toggleCategory('mid')}
              >
                <h4 className="text-white font-semibold">Средние (250-500 Гц)</h4>
                <span className={`text-gray-300 transition-transform ${openCategories['mid'] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['mid'] && (
                <div 
                  className="mt-2"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {bassPresets
                      .filter(preset => preset.category === 'mid')
                      .map((preset) => (
                        <div key={preset.frequency} className="flex space-x-1">
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`btn-secondary flex-1 text-xs ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={preset.description}
                          >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs opacity-75">{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`btn-secondary p-2 ${
                              currentPreset?.frequency === preset.frequency && isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Высокие средние частоты */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => toggleCategory('mid-high')}
              >
                <h4 className="text-white font-semibold">Высокие средние (630-2000 Гц)</h4>
                <span className={`text-gray-300 transition-transform ${openCategories['mid-high'] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['mid-high'] && (
                <div 
                  className="mt-2"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {bassPresets
                      .filter(preset => preset.category === 'mid-high')
                      .map((preset) => (
                        <div key={preset.frequency} className="flex space-x-1">
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`btn-secondary flex-1 text-xs ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={preset.description}
                          >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs opacity-75">{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`btn-secondary p-2 ${
                              currentPreset?.frequency === preset.frequency && isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Высокие частоты */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => toggleCategory('high')}
              >
                <h4 className="text-white font-semibold">Высокие (2500-8000 Гц)</h4>
                <span className={`text-gray-300 transition-transform ${openCategories['high'] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['high'] && (
                <div 
                  className="mt-2"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {bassPresets
                      .filter(preset => preset.category === 'high')
                      .map((preset) => (
                        <div key={preset.frequency} className="flex space-x-1">
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`btn-secondary flex-1 text-xs ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={preset.description}
                          >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs opacity-75">{preset.frequency} Гц</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`btn-secondary p-2 ${
                              currentPreset?.frequency === preset.frequency && isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Очень высокие частоты */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => toggleCategory('very-high')}
              >
                <h4 className="text-white font-semibold">Очень высокие (10-21 кГц)</h4>
                <span className={`text-gray-300 transition-transform ${openCategories['very-high'] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['very-high'] && (
                <div 
                  className="mt-2"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {bassPresets
                      .filter(preset => preset.category === 'very-high')
                      .map((preset) => (
                        <div key={preset.frequency} className="flex space-x-1">
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className={`btn-secondary flex-1 text-xs ${
                              currentPreset?.frequency === preset.frequency && !isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={preset.description}
                          >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs opacity-75">{formatFrequency(preset.frequency)}</div>
                          </button>
                          <button
                            onClick={() => handleBassLoop(preset)}
                            className={`btn-secondary p-2 ${
                              currentPreset?.frequency === preset.frequency && isLooping ? 'bg-slate-600 text-white' : ''
                            }`}
                            title={`Зациклить ${preset.name}`}
                          >
                            🔄
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Кастомный пресет */}
            <div className="mb-4">
              <button 
                className="w-full flex justify-between items-center p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                onClick={() => toggleCategory('custom')}
              >
                <h4 className="text-white font-semibold">Кастомные</h4>
                <span className={`text-gray-300 transition-transform ${openCategories['custom'] ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openCategories['custom'] && (
                <div 
                  className="mt-2"
                >
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {bassPresets
                      .filter(preset => preset.category === 'custom')
                      .map((preset) => (
                        <div key="custom" className="flex space-x-1">
                          <button
                            onClick={() => handleBassPreset(preset)}
                            className="btn-secondary flex-1 text-xs bg-purple-600 hover:bg-purple-700"
                            title={preset.description}
                          >
                            <div className="font-medium">{preset.name}</div>
                            <div className="text-xs opacity-75">Ввести частоту</div>
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Модальное окно для кастомной басовой частоты */}
        {showCustomBassInput && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
            onClick={() => setShowCustomBassInput(false)}
          >
            <div
              className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-white font-semibold text-lg mb-4">Кастомная басовая частота</h3>
              <form onSubmit={handleCustomBassSubmit}>
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max="21000"
                  placeholder="Введите частоту (например: 17.5)"
                  value={customBassFreq}
                  onChange={(e) => setCustomBassFreq(e.target.value)}
                  className="input-field w-full mb-4"
                  autoFocus
                />
                <div className="flex space-x-4">
                  <button type="submit" className="btn-primary flex-1">
                    Воспроизвести
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCustomBassInput(false)}
                    className="btn-secondary flex-1"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Отображение ошибок */}
        {error && (
          <div
            className="bg-red-900/20 border border-red-500 text-red-400 p-4 rounded-lg mb-4"
          >
            <p>{error}</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ToneGenerator; 