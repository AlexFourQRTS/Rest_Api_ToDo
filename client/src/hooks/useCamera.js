import { useState, useEffect, useRef, useCallback } from 'react';

const useCamera = () => {
  const [stream, setStream] = useState(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  
  // Новые состояния для дополнительных функций
  const [rotation, setRotation] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [sharpness, setSharpness] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  // Получение списка доступных устройств
  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setDevices(videoDevices);
      
      if (videoDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('Ошибка при получении списка устройств:', err);
    }
  }, [selectedDevice]);

  // Включение камеры
  const startCamera = useCallback(async (deviceId = null) => {
    setIsLoading(true);
    setError(null);

    try {
      // Остановка предыдущего потока
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user' // фронтальная камера по умолчанию
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setIsCameraOn(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Ошибка при запуске камеры:', err);
      setError(getErrorMessage(err));
      setIsCameraOn(false);
    } finally {
      setIsLoading(false);
    }
  }, [stream]);

  // Выключение камеры
  const stopCamera = useCallback(() => {
    console.log('stopCamera вызван');
    if (stream) {
      console.log('Останавливаем поток...');
      stream.getTracks().forEach(track => {
        console.log('Останавливаем трек:', track.kind);
        track.stop();
      });
      setStream(null);
      setIsCameraOn(false);
      
      // Очищаем видео элемент
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    } else {
      console.log('Поток не найден, просто выключаем камеру');
      setIsCameraOn(false);
    }
  }, [stream]);

  // Смена устройства
  const switchDevice = useCallback(async (deviceId) => {
    setSelectedDevice(deviceId);
    if (isCameraOn) {
      await startCamera(deviceId);
    }
  }, [isCameraOn, startCamera]);

  // Смена камеры (фронтальная/задняя)
  const switchCamera = useCallback(async () => {
    console.log('switchCamera вызван');
    if (!isCameraOn) {
      console.log('Камера выключена, включаем...');
      await startCamera();
      return;
    }

    try {
      // Останавливаем текущий поток
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      // Определяем текущий facingMode
      const currentFacingMode = stream?.getVideoTracks()[0]?.getSettings()?.facingMode;
      const newFacingMode = currentFacingMode === 'user' ? 'environment' : 'user';
      
      console.log('Текущий facingMode:', currentFacingMode, 'Новый:', newFacingMode);

      const constraints = {
        video: {
          facingMode: newFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      
      console.log('Камера успешно сменена');
    } catch (err) {
      console.error('Ошибка при смене камеры:', err);
      setError(getErrorMessage(err));
      // Пытаемся вернуться к предыдущему потоку
      if (stream) {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }
    }
  }, [isCameraOn, stream, startCamera]);

  // Поворот камеры
  const rotateCamera = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  // Сброс поворота
  const resetRotation = useCallback(() => {
    setRotation(0);
  }, []);

  // Регулировка яркости
  const adjustBrightness = useCallback((value) => {
    setBrightness(value);
  }, []);

  // Регулировка контраста
  const adjustContrast = useCallback((value) => {
    setContrast(value);
  }, []);

  // Регулировка резкости
  const adjustSharpness = useCallback((value) => {
    setSharpness(value);
  }, []);

  // Сброс фильтров
  const resetFilters = useCallback(() => {
    setBrightness(100);
    setContrast(100);
    setSharpness(100);
  }, []);

  // Полноэкранный режим
  const toggleFullscreen = useCallback(async () => {
    if (!videoContainerRef.current) return;

    try {
      if (!isFullscreen) {
        if (videoContainerRef.current.requestFullscreen) {
          await videoContainerRef.current.requestFullscreen();
        } else if (videoContainerRef.current.webkitRequestFullscreen) {
          await videoContainerRef.current.webkitRequestFullscreen();
        } else if (videoContainerRef.current.msRequestFullscreen) {
          await videoContainerRef.current.msRequestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Ошибка при переключении полноэкранного режима:', err);
    }
  }, [isFullscreen]);

  // Слушатель изменения полноэкранного режима
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Создание снимка
  const takePhoto = useCallback(() => {
    if (!videoRef.current || !isCameraOn) return null;

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    
    // Применяем поворот к снимку
    context.save();
    context.translate(canvas.width / 2, canvas.height / 2);
    context.rotate((rotation * Math.PI) / 180);
    context.drawImage(videoRef.current, -videoRef.current.videoWidth / 2, -videoRef.current.videoHeight / 2);
    context.restore();
    
    // Применяем фильтры к снимку
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      // Яркость
      data[i] = Math.min(255, data[i] * (brightness / 100));     // R
      data[i + 1] = Math.min(255, data[i + 1] * (brightness / 100)); // G
      data[i + 2] = Math.min(255, data[i + 2] * (brightness / 100)); // B
      
      // Контраст
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
      data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
      data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
      
      // Резкость (насыщенность)
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = Math.min(255, Math.max(0, avg + (data[i] - avg) * (sharpness / 100)));
      data[i + 1] = Math.min(255, Math.max(0, avg + (data[i + 1] - avg) * (sharpness / 100)));
      data[i + 2] = Math.min(255, Math.max(0, avg + (data[i + 2] - avg) * (sharpness / 100)));
    }
    
    context.putImageData(imageData, 0, 0);
    
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve({
          blob,
          url,
          timestamp: new Date().toISOString()
        });
      }, 'image/jpeg', 0.8);
    });
  }, [isCameraOn, rotation, brightness, contrast, sharpness]);

  // Получение сообщения об ошибке
  const getErrorMessage = (err) => {
    switch (err.name) {
      case 'NotAllowedError':
        return 'Доступ к камере запрещен. Разрешите доступ в настройках браузера.';
      case 'NotFoundError':
        return 'Камера не найдена. Проверьте подключение устройства.';
      case 'NotReadableError':
        return 'Камера уже используется другим приложением.';
      case 'OverconstrainedError':
        return 'Запрошенные настройки камеры не поддерживаются.';
      case 'TypeError':
        return 'Неподдерживаемый тип медиа.';
      default:
        return 'Произошла ошибка при доступе к камере.';
    }
  };

  // Инициализация при монтировании компонента
  useEffect(() => {
    getDevices();
    
    // Слушатель изменений устройств
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [getDevices]);

  // Очистка при размонтировании
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return {
    // Состояние
    stream,
    isCameraOn,
    error,
    isLoading,
    devices,
    selectedDevice,
    rotation,
    brightness,
    contrast,
    sharpness,
    isFullscreen,
    
    // Рефы
    videoRef,
    videoContainerRef,
    
    // Методы
    startCamera,
    stopCamera,
    switchDevice,
    switchCamera,
    takePhoto,
    rotateCamera,
    resetRotation,
    adjustBrightness,
    adjustContrast,
    adjustSharpness,
    resetFilters,
    toggleFullscreen,
    
    // Утилиты
    clearError: () => setError(null)
  };
};

export default useCamera; 