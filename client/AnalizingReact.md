# 📊 Анализ React проекта

**Дата анализа:** 7 октября 2025  
**Проект:** Rest_Api_ToDo Client

---

## 📈 Файлы с большим количеством строк (> 300 строк)

### Критические файлы (требуют рефакторинга)

| Файл | Строк | Приоритет | Описание |
|------|-------|-----------|----------|
| **ToneGenerator.jsx** | **959** | 🔴 Высокий | Самый большой компонент. Содержит сложную логику управления звуком и большое количество пресетов |
| **FileList.jsx** | **448** | 🟡 Средний | Управление файлами, превью, загрузка. Можно разделить на подкомпоненты |
| **Camera.jsx** | **415** | 🟡 Средний | Работа с камерой, фильтры, галерея. Много логики в одном компоненте |
| **useToneGenerator.js** | **395** | 🟡 Средний | Сложный хук с множеством состояний и методов |
| **Blog.jsx** | **347** | 🟡 Средний | Управление статьями, пагинация, модальные окна |
| **useCamera.js** | **341** | 🟡 Средний | Управление камерой, фильтры, обработка изображений |
| **Navbar.jsx** | **326** | 🟢 Низкий | Навигация с dropdown меню |
| **UserPage.jsx** | **322** | 🟡 Средний | Управление задачами пользователя |

---

## 🔄 Выявленные паттерны повторяющегося кода

### 1. 🎯 Управление Dropdown меню

**Проблема:** Дублирование кода в `Navbar.jsx` и `Sidebar.jsx`

**Повторяющийся код:**
```javascript
// В обоих файлах
const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
const toolsDropdownRef = useRef(null);
const profileDropdownRef = useRef(null);

const toggleToolsDropdown = () => {
  setIsToolsDropdownOpen(!isToolsDropdownOpen);
  if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
      setIsToolsDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => document.removeEventListener('mousedown', handleClickOutside);
}, []);
```

**Решение:**
```javascript
// hooks/useDropdown.js
export const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  const close = useCallback(() => setIsOpen(false), []);
  const open = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        close();
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, close]);

  return { isOpen, toggle, close, open, ref };
};

// Использование
const toolsDropdown = useDropdown();
const profileDropdown = useDropdown();
```

**Файлы для рефакторинга:**
- `src/components/Navbar/Navbar.jsx` (строки 11-82)
- `src/components/Sidebar/Sidebar.jsx` (строки 9-82)

---

### 2. 👤 Загрузка данных пользователя

**Проблема:** Повторяется в 5+ компонентах

**Повторяющийся код:**
```javascript
// В Navbar, Sidebar, Profile, Blog, FileCloud
const [userData, setUserData] = useState(null);

useEffect(() => {
  const fetchUserData = async () => {
    try {
      const data = await authApi.getProfile();
      setUserData(data);
    } catch (error) {
      setUserData(null);
    }
  };
  fetchUserData();
}, []);
```

**Решение 1: Кастомный хук**
```javascript
// hooks/useAuth.js
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const data = await authApi.getProfile();
        setUser(data);
      } catch (err) {
        setError(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, loading, error };
};
```

**Решение 2: Context API (рекомендуется)**
```javascript
// context/AuthContext.jsx
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await authApi.getProfile();
        setUser(data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

// Использование
const { user, loading } = useAuth();
```

**Файлы для рефакторинга:**
- `src/components/Navbar/Navbar.jsx` (строки 81-94)
- `src/components/Sidebar/Sidebar.jsx` (строки 33-45)
- `src/pages/Profile/Profile.jsx` (строки 27-40)
- `src/pages/Blog/Blog.jsx` (строки 49-51)
- `src/pages/FileCloud/FileCloud.jsx` (строки 42-43)

---

### 3. 🪟 Модальные окна

**Проблема:** Повторяющиеся структуры модальных окон

**Повторяющийся код:**
```javascript
// В Blog, FileList, ToneGenerator
{isModalOpen && (
  <div 
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={handleClose}
  >
    <div 
      className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
      onClick={(e) => e.stopPropagation()}
    >
      <button onClick={handleClose} className="...">×</button>
      {/* Содержимое */}
    </div>
  </div>
)}
```

**Решение:**
```javascript
// components/UI/Modal/Modal.jsx
export const Modal = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  maxWidth = 'max-w-md',
  closeOnOverlayClick = true 
}) => {
  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeOnOverlayClick ? onClose : undefined}
    >
      <motion.div
        className={`bg-gray-800 rounded-lg p-6 ${maxWidth} w-full mx-4 max-h-[90vh] overflow-y-auto`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>
        )}
        {children}
      </motion.div>
    </motion.div>
  );
};

// hooks/useModal.js
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = useState(initialState);
  
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen(prev => !prev), []);
  
  return { isOpen, open, close, toggle };
};

// Использование
const deleteModal = useModal();

<Modal isOpen={deleteModal.isOpen} onClose={deleteModal.close} title="Удалить статью?">
  <p>Вы уверены?</p>
  <button onClick={handleDelete}>Да</button>
</Modal>
```

**Файлы для рефакторинга:**
- `src/pages/Blog/Blog.jsx` (строки 216-236, 238-258, 260-327)
- `src/pages/FileCloud/FileList.jsx` (строки 183-237, 419-442)
- `src/pages/Tools/ToneGenerator/ToneGenerator.jsx` (строки 900-942)

---

### 4. 📝 Формы аутентификации

**Проблема:** Дублирование структуры полей ввода

**Повторяющийся код:**
```javascript
// В Login и Register
<div>
  <label htmlFor="email" className="block text-white mb-2">Email</label>
  <input
    type="email"
    id="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    placeholder="Введіть ваш email"
    className="input-field w-full"
  />
</div>
```

**Решение:**
```javascript
// components/UI/FormField/FormField.jsx
export const FormField = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  error,
  ...props
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-white mb-2">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className={`input-field w-full ${error ? 'border-red-500' : ''}`}
        {...props}
      />
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

// Использование
<FormField
  id="email"
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Введіть ваш email"
  required
/>
```

**Файлы для рефакторинга:**
- `src/pages/Profile/auth/components/Login.jsx` (строки 28-51)
- `src/pages/Profile/auth/components/Register.jsx` (строки 35-82)

---

### 5. 🎵 AudioContext управление

**Проблема:** Похожий код в `useMicrophone.js` и `useToneGenerator.js`

**Повторяющийся код:**
```javascript
// В обоих хуках
const audioContextRef = useRef(null);
const oscillatorRef = useRef(null);
const gainNodeRef = useRef(null);

const initAudioContext = useCallback(() => {
  try {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContextRef.current;
  } catch (err) {
    setError('Ошибка инициализации аудио контекста');
    return null;
  }
}, []);

// Очистка при размонтировании
useEffect(() => {
  return () => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };
}, []);
```

**Решение:**
```javascript
// hooks/useAudioContext.js
export const useAudioContext = () => {
  const audioContextRef = useRef(null);
  const [error, setError] = useState(null);

  const getContext = useCallback(() => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      return audioContextRef.current;
    } catch (err) {
      setError('Не удалось инициализировать аудио контекст');
      console.error('AudioContext error:', err);
      return null;
    }
  }, []);

  const closeContext = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      closeContext();
    };
  }, [closeContext]);

  return { getContext, closeContext, error };
};

// hooks/useOscillator.js
export const useOscillator = (audioContext) => {
  const oscillatorRef = useRef(null);
  const gainNodeRef = useRef(null);

  const createOscillator = useCallback((frequency, waveform = 'sine', gain = 0.5) => {
    if (!audioContext) return null;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.type = waveform;
      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      gainNode.gain.setValueAtTime(gain, audioContext.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;

      return { oscillator, gainNode };
    } catch (err) {
      console.error('Oscillator creation error:', err);
      return null;
    }
  }, [audioContext]);

  const stopOscillator = useCallback(() => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (err) {
        console.error('Stop oscillator error:', err);
      }
      oscillatorRef.current = null;
      gainNodeRef.current = null;
    }
  }, []);

  return { createOscillator, stopOscillator, oscillatorRef, gainNodeRef };
};
```

**Файлы для рефакторинга:**
- `src/hooks/useMicrophone.js` (строки 3-4, 23-24, 180-185)
- `src/hooks/useToneGenerator.js` (строки 21-24, 110-121, 347-354)

---

### 6. ⏳ Состояния загрузки и ошибок

**Проблема:** Повторяется во всех компонентах с асинхронными операциями

**Повторяющийся код:**
```javascript
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

const fetchData = async () => {
  try {
    setIsLoading(true);
    const data = await api.getData();
    // обработка
  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};
```

**Решение:**
```javascript
// hooks/useAsync.js
export const useAsync = (asyncFunction, immediate = true) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      setStatus('pending');
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setData(response);
        setStatus('success');
        return response;
      } catch (error) {
        setError(error);
        setStatus('error');
        throw error;
      }
    },
    [asyncFunction]
  );

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return {
    execute,
    status,
    data,
    error,
    isLoading: status === 'pending',
    isError: status === 'error',
    isSuccess: status === 'success',
    isIdle: status === 'idle',
  };
};

// Использование
const { data: articles, isLoading, error, execute: refetch } = useAsync(
  () => axios.get(`${BASE_URL}/api/api/blog`),
  true
);
```

**Файлы для рефакторинга:**
- Практически все компоненты, работающие с API

---

### 7. 📄 Пагинация

**Проблема:** Сложная логика в `Blog.jsx` (строки 126-181)

**Текущий код:**
```javascript
const renderPagination = () => {
  const pages = [];
  pages.push(
    <button key="1" className={...} onClick={() => handlePageChange(1)}>1</button>
  );
  
  let startPage = Math.max(2, page - 1);
  let endPage = Math.min(totalPages - 1, page + 1);
  
  if (startPage > 2) {
    pages.push(<span key="ellipsis1">...</span>);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(<button key={i} ...>{i}</button>);
  }
  
  if (endPage < totalPages - 1) {
    pages.push(<span key="ellipsis2">...</span>);
  }
  
  if (totalPages > 1) {
    pages.push(<button key={totalPages} ...>{totalPages}</button>);
  }
  
  return pages;
};
```

**Решение:**
```javascript
// components/UI/Pagination/Pagination.jsx
export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  maxVisible = 5 
}) => {
  const getPageNumbers = () => {
    const pages = [];
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(2, currentPage - halfVisible);
    let endPage = Math.min(totalPages - 1, currentPage + halfVisible);
    
    // Корректировка если мало страниц с одной стороны
    if (currentPage - halfVisible < 2) {
      endPage = Math.min(totalPages - 1, maxVisible);
    }
    if (currentPage + halfVisible > totalPages - 1) {
      startPage = Math.max(2, totalPages - maxVisible);
    }
    
    // Первая страница
    pages.push({ type: 'page', value: 1 });
    
    // Многоточие после первой
    if (startPage > 2) {
      pages.push({ type: 'ellipsis', value: 'ellipsis-start' });
    }
    
    // Средние страницы
    for (let i = startPage; i <= endPage; i++) {
      pages.push({ type: 'page', value: i });
    }
    
    // Многоточие перед последней
    if (endPage < totalPages - 1) {
      pages.push({ type: 'ellipsis', value: 'ellipsis-end' });
    }
    
    // Последняя страница
    if (totalPages > 1) {
      pages.push({ type: 'page', value: totalPages });
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="btn-secondary"
      >
        ‹
      </button>
      
      {getPageNumbers().map((item) => (
        item.type === 'ellipsis' ? (
          <span key={item.value} className="px-2 text-gray-400">...</span>
        ) : (
          <button
            key={item.value}
            onClick={() => onPageChange(item.value)}
            className={`px-3 py-1 rounded ${
              currentPage === item.value
                ? 'bg-teal-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {item.value}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="btn-secondary"
      >
        ›
      </button>
    </div>
  );
};

// Использование
<Pagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={handlePageChange}
/>
```

**Файлы для рефакторинга:**
- `src/pages/Blog/Blog.jsx` (строки 126-181)

---

### 8. 📹 Управление медиа устройствами

**Проблема:** Похожий код в `useCamera.js` и `useMicrophone.js`

**Повторяющийся код:**
```javascript
// В обоих хуках
const [devices, setDevices] = useState([]);

const getDevices = useCallback(async () => {
  try {
    await navigator.mediaDevices.getUserMedia({ video: true }); // или audio
    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const filteredDevices = allDevices.filter(device => device.kind === 'videoinput');
    setDevices(filteredDevices);
  } catch (err) {
    setError('Не удалось получить доступ к устройству');
  }
}, []);

useEffect(() => {
  getDevices();
  navigator.mediaDevices.addEventListener('devicechange', getDevices);
  return () => {
    navigator.mediaDevices.removeEventListener('devicechange', getDevices);
  };
}, [getDevices]);
```

**Решение:**
```javascript
// hooks/useMediaDevices.js
export const useMediaDevices = (kind = 'videoinput') => {
  const [devices, setDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [error, setError] = useState(null);
  const [permissionGranted, setPermissionGranted] = useState(false);

  const getDevices = useCallback(async () => {
    try {
      // Запрос разрешения
      const constraints = kind === 'videoinput' 
        ? { video: true } 
        : { audio: true };
      
      await navigator.mediaDevices.getUserMedia(constraints);
      setPermissionGranted(true);

      // Получение устройств
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const filteredDevices = allDevices.filter(device => device.kind === kind);
      setDevices(filteredDevices);

      // Автовыбор первого устройства
      if (filteredDevices.length > 0 && !selectedDevice) {
        setSelectedDevice(filteredDevices[0].deviceId);
      }
    } catch (err) {
      setError(`Не удалось получить доступ к устройствам: ${err.message}`);
      setPermissionGranted(false);
    }
  }, [kind, selectedDevice]);

  useEffect(() => {
    getDevices();

    // Слушаем изменения устройств
    const handleDeviceChange = () => {
      getDevices();
    };

    navigator.mediaDevices.addEventListener('devicechange', handleDeviceChange);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', handleDeviceChange);
    };
  }, [getDevices]);

  return {
    devices,
    selectedDevice,
    setSelectedDevice,
    error,
    permissionGranted,
    refreshDevices: getDevices,
  };
};

// Использование
const { 
  devices: cameras, 
  selectedDevice, 
  setSelectedDevice 
} = useMediaDevices('videoinput');
```

**Файлы для рефакторинга:**
- `src/hooks/useCamera.js` (строки 22-33, 291-293)
- `src/hooks/useMicrophone.js` (строки 26-43)

---

### 9. 🖥️ Полноэкранный режим

**Проблема:** Кросс-браузерный код с префиксами в `useCamera.js`

**Текущий код:**
```javascript
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
    setError('Ошибка при переключении полноэкранного режима');
  }
}, [isFullscreen]);
```

**Решение:**
```javascript
// hooks/useFullscreen.js
export const useFullscreen = (elementRef) => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const enterFullscreen = useCallback(async () => {
    if (!elementRef?.current) return;

    try {
      const element = elementRef.current;
      
      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
      throw err;
    }
  }, [elementRef]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
    } catch (err) {
      console.error('Exit fullscreen error:', err);
      throw err;
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (isFullscreen) {
      await exitFullscreen();
    } else {
      await enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenElement = 
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.msFullscreenElement;
      
      setIsFullscreen(!!fullscreenElement);
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

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
};

// Использование
const videoContainerRef = useRef(null);
const { isFullscreen, toggleFullscreen } = useFullscreen(videoContainerRef);
```

**Файлы для рефакторинга:**
- `src/hooks/useCamera.js` (строки 172-216)

---

## 💡 Приоритетный план рефакторинга

### Фаза 1: Глобальное состояние (1-2 дня)
- [ ] Создать `AuthContext` для управления пользователем
- [ ] Заменить локальные вызовы `authApi.getProfile()` на `useAuth()`
- [ ] Протестировать работу аутентификации

**Затронутые файлы:** Navbar, Sidebar, Profile, Blog, FileCloud (5 файлов)

---

### Фаза 2: UI компоненты (2-3 дня)
- [ ] Создать компонент `<Modal>` и хук `useModal`
- [ ] Создать компонент `<FormField>`
- [ ] Создать компонент `<Pagination>`
- [ ] Создать компонент `<Dropdown>`
- [ ] Рефакторить все модальные окна

**Затронутые файлы:** Blog, FileList, ToneGenerator, Login, Register (5 файлов)

---

### Фаза 3: Кастомные хуки (3-4 дня)
- [ ] Создать `useDropdown` для dropdown меню
- [ ] Создать `useAsync` для асинхронных операций
- [ ] Создать `useAudioContext` для Web Audio API
- [ ] Создать `useOscillator` для звуковых генераторов
- [ ] Создать `useMediaDevices` для работы с устройствами
- [ ] Создать `useFullscreen` для полноэкранного режима

**Затронутые файлы:** useMicrophone, useToneGenerator, useCamera (3 файла)

---

### Фаза 4: Разделение больших компонентов (4-5 дней)

#### ToneGenerator.jsx (959 строк) → Разделить на:
- [ ] `ToneGenerator.jsx` (основной компонент) ≈ 150 строк
- [ ] `ToneControls.jsx` (управление звуком) ≈ 100 строк
- [ ] `FrequencyBands.jsx` (полосы частот) ≈ 150 строк
- [ ] `PresetsList.jsx` (список пресетов) ≈ 200 строк
- [ ] `PresetCategory.jsx` (категория пресетов) ≈ 80 строк
- [ ] `CustomFrequencyModal.jsx` (модалка ввода) ≈ 50 строк

#### FileList.jsx (448 строк) → Разделить на:
- [ ] `FileList.jsx` (основной компонент) ≈ 80 строк
- [ ] `FileItem.jsx` (элемент файла) ≈ 100 строк
- [ ] `FilePreview.jsx` (превью файла) ≈ 120 строк
- [ ] `FileTabs.jsx` (табы категорий) ≈ 80 строк
- [ ] `DeleteConfirmModal.jsx` (модалка удаления) ≈ 40 строк

#### Camera.jsx (415 строк) → Разделить на:
- [ ] `Camera.jsx` (основной компонент) ≈ 100 строк
- [ ] `CameraControls.jsx` (управление) ≈ 80 строк
- [ ] `CameraFilters.jsx` (фильтры) ≈ 80 строк
- [ ] `PhotoGallery.jsx` (галерея) ≈ 100 строк
- [ ] `DeviceSelector.jsx` (выбор устройства) ≈ 60 строк

---

### Фаза 5: Оптимизация хуков (2-3 дня)

#### useToneGenerator.js (395 строк) → Разделить на:
- [ ] `useToneGenerator.js` (основной хук) ≈ 100 строк
- [ ] `useTonePresets.js` (пресеты) ≈ 100 строк
- [ ] `useTonePlayback.js` (воспроизведение) ≈ 100 строк
- [ ] `useFrequencyBands.js` (полосы частот) ≈ 80 строк

#### useCamera.js (341 строка) → Разделить на:
- [ ] `useCamera.js` (основной хук) ≈ 100 строк
- [ ] `useCameraFilters.js` (фильтры) ≈ 100 строк
- [ ] `useCameraCapture.js` (захват фото) ≈ 80 строк
- [ ] Использовать `useMediaDevices` и `useFullscreen`

---

## 📦 Структура новых файлов

```
src/
├── hooks/
│   ├── useAuth.js                  ✨ НОВЫЙ
│   ├── useDropdown.js              ✨ НОВЫЙ
│   ├── useModal.js                 ✨ НОВЫЙ
│   ├── useAsync.js                 ✨ НОВЫЙ
│   ├── useAudioContext.js          ✨ НОВЫЙ
│   ├── useOscillator.js            ✨ НОВЫЙ
│   ├── useMediaDevices.js          ✨ НОВЫЙ
│   ├── useFullscreen.js            ✨ НОВЫЙ
│   ├── useTonePresets.js           ✨ НОВЫЙ
│   ├── useTonePlayback.js          ✨ НОВЫЙ
│   ├── useFrequencyBands.js        ✨ НОВЫЙ
│   ├── useCameraFilters.js         ✨ НОВЫЙ
│   └── useCameraCapture.js         ✨ НОВЫЙ
│
├── context/
│   ├── AuthContext.jsx             ✨ НОВЫЙ
│   └── ToastContext.jsx            (существует)
│
├── components/
│   ├── UI/
│   │   ├── Modal/
│   │   │   └── Modal.jsx           ✨ НОВЫЙ
│   │   ├── FormField/
│   │   │   └── FormField.jsx       ✨ НОВЫЙ
│   │   ├── Pagination/
│   │   │   └── Pagination.jsx      ✨ НОВЫЙ
│   │   ├── Dropdown/
│   │   │   └── Dropdown.jsx        ✨ НОВЫЙ
│   │   ├── LoadingSpinner/
│   │   │   └── LoadingSpinner.jsx  ✨ НОВЫЙ
│   │   └── ErrorMessage/
│   │       └── ErrorMessage.jsx    ✨ НОВЫЙ
│   │
│   └── Tools/
│       ├── ToneGenerator/
│       │   ├── ToneControls.jsx    ✨ НОВЫЙ
│       │   ├── FrequencyBands.jsx  ✨ НОВЫЙ
│       │   ├── PresetsList.jsx     ✨ НОВЫЙ
│       │   ├── PresetCategory.jsx  ✨ НОВЫЙ
│       │   └── CustomFrequencyModal.jsx ✨ НОВЫЙ
│       │
│       └── Camera/
│           ├── CameraControls.jsx  ✨ НОВЫЙ
│           ├── CameraFilters.jsx   ✨ НОВЫЙ
│           ├── PhotoGallery.jsx    ✨ НОВЫЙ
│           └── DeviceSelector.jsx  ✨ НОВЫЙ
│
└── pages/
    └── FileCloud/
        ├── FileItem.jsx            ✨ НОВЫЙ
        ├── FilePreview.jsx         ✨ НОВЫЙ
        ├── FileTabs.jsx            ✨ НОВЫЙ
        └── DeleteConfirmModal.jsx  ✨ НОВЫЙ
```

---

## 📊 Метрики после рефакторинга

### Ожидаемое сокращение кода

| Компонент | Было | Станет | Экономия |
|-----------|------|--------|----------|
| ToneGenerator | 959 | ~730 (разделено на 6 файлов) | 24% |
| FileList | 448 | ~420 (разделено на 5 файлов) | 6% |
| Camera | 415 | ~420 (разделено на 5 файлов) | -1% |
| Navbar + Sidebar | 536 | ~350 (с useDropdown) | 35% |
| Login + Register | 159 | ~120 (с FormField) | 25% |
| useToneGenerator | 395 | ~380 (разделено на 4 хука) | 4% |
| useCamera | 341 | ~280 (с useMediaDevices, useFullscreen) | 18% |

**Общая экономия:** ~550 строк кода (15%)  
**Улучшение переиспользования:** Создано 13 новых хуков и 9 UI компонентов

---

## ⚡ Дополнительные рекомендации

### 1. Code Splitting
Использовать React.lazy для больших компонентов:

```javascript
const ToneGenerator = lazy(() => import('./pages/Tools/ToneGenerator/ToneGenerator'));
const Camera = lazy(() => import('./pages/Tools/Camera/Camera'));
const FileCloud = lazy(() => import('./pages/FileCloud/FileCloud'));

<Suspense fallback={<LoadingSpinner />}>
  <Route path={routes.tone_generator} element={<ToneGenerator />} />
</Suspense>
```

### 2. Мемоизация
Добавить memo для дорогих компонентов:

```javascript
export const PresetCategory = memo(({ presets, onSelect }) => {
  // компонент
}, (prevProps, nextProps) => {
  return prevProps.presets === nextProps.presets;
});
```

### 3. TypeScript (опционально)
Рассмотреть миграцию на TypeScript для лучшей типизации.

### 4. Тестирование
После рефакторинга добавить тесты для новых хуков и компонентов (но согласно памяти, пользователь не хочет тестовых файлов).

### 5. Документация
Создать JSDoc комментарии для публичных API хуков и компонентов.

---

## 🎯 KPI рефакторинга

### Цели:
- ✅ Сократить дублирование кода на 50%
- ✅ Уменьшить средний размер файла до 200 строк
- ✅ Создать библиотеку из 13+ переиспользуемых хуков
- ✅ Создать библиотеку из 9+ UI компонентов
- ✅ Улучшить читаемость кода
- ✅ Упростить поддержку и расширение

### Метрики успеха:
- Максимальный размер компонента: < 250 строк
- Максимальный размер хука: < 150 строк
- Количество переиспользуемых компонентов: > 9
- Количество переиспользуемых хуков: > 13
- Покрытие Context API: AuthContext + ToastContext

---

## 🚀 Начало работы

### Рекомендуемый порядок:

1. **Начать с AuthContext** (самый критичный, затрагивает 5+ файлов)
2. **Создать Modal компонент** (затрагивает 3 больших файла)
3. **Создать useDropdown** (упростит Navbar и Sidebar)
4. **Рефакторить ToneGenerator** (самый большой файл)
5. **Оптимизировать остальные компоненты**

### Первый шаг:
```bash
# Создать структуру для новых файлов
mkdir -p src/context
mkdir -p src/components/UI/{Modal,FormField,Pagination,Dropdown,LoadingSpinner,ErrorMessage}
mkdir -p src/hooks

# Создать AuthContext
touch src/context/AuthContext.jsx

# Начать рефакторинг!
```

---

**Дата создания:** 7 октября 2025  
**Автор анализа:** AI Assistant  
**Версия:** 1.0

