# 🌐 Redux для управления языком

## 📋 Обзор

В проект добавлен **Redux Toolkit** для централизованного управления выбранным языком интерфейса. Теперь выбор языка синхронизирован между всеми компонентами приложения.

---

## 🎯 Решенная проблема

### До Redux:
- ❌ `Home.jsx` использовал локальное состояние (`useState`)
- ❌ `Navbar.jsx` и `LanguageSelector.jsx` использовали глобальный `localizationService`
- ❌ Состояния не синхронизированы
- ❌ Выбор языка на странице Home не влиял на Navbar

### После Redux:
- ✅ Единый источник правды (Redux store)
- ✅ Язык синхронизирован везде автоматически
- ✅ Сохранение в localStorage через middleware
- ✅ Простое использование через хуки

---

## 📦 Установленные пакеты

```bash
npm install @reduxjs/toolkit react-redux
```

**Зависимости:**
- `@reduxjs/toolkit` - современный Redux с упрощенным API
- `react-redux` - React bindings для Redux

---

## 🏗️ Структура Redux

```
src/
├── store/
│   ├── store.js                      # Главный Redux store
│   └── slices/
│       └── languageSlice.js          # Slice для управления языком
│
└── hooks/
    ├── useLanguage.js                # ✨ НОВЫЙ хук для работы с языком
    └── useLocalization.js            # Обновлен для работы с Redux
```

---

## 📄 Файлы

### 1. Redux Store (`src/store/store.js`)

```javascript
import { configureStore } from '@reduxjs/toolkit';
import languageReducer from './slices/languageSlice';

export const store = configureStore({
  reducer: {
    language: languageReducer,
  },
});
```

**Что делает:**
- Создает главный Redux store
- Регистрирует language reducer
- Настраивает middleware

---

### 2. Language Slice (`src/store/slices/languageSlice.js`)

```javascript
import { createSlice } from '@reduxjs/toolkit';

const languageSlice = createSlice({
  name: 'language',
  initialState: {
    currentLanguage: 'en',
    isInitialized: false,
    supportedLanguages: [
      { code: 'uk', name: 'Українська', flag: '🇺🇦' },
      { code: 'en', name: 'English', flag: '🇬🇧' },
      { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    ],
  },
  reducers: {
    setLanguage: (state, action) => {
      state.currentLanguage = action.payload;
      localStorage.setItem('selectedLanguage', action.payload);
      localizationService.setLanguage(action.payload);
    },
    initializeLanguage: (state, action) => {
      if (action.payload) {
        state.currentLanguage = action.payload;
      }
      state.isInitialized = true;
    },
  },
});
```

**Функции:**
- `setLanguage` - изменяет текущий язык
- `initializeLanguage` - инициализирует язык при загрузке
- Автоматически синхронизирует с localStorage и localizationService

**Selectors:**
- `selectCurrentLanguage` - получить текущий язык
- `selectIsInitialized` - проверить инициализацию
- `selectSupportedLanguages` - получить список языков

---

### 3. Хук useLanguage (`src/hooks/useLanguage.js`)

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { 
  setLanguage as setLanguageAction, 
  selectCurrentLanguage,
  selectSupportedLanguages 
} from '../store/slices/languageSlice';

export const useLanguage = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  const supportedLanguages = useSelector(selectSupportedLanguages);

  const setLanguage = (languageCode) => {
    dispatch(setLanguageAction(languageCode));
  };

  return {
    currentLanguage,
    setLanguage,
    supportedLanguages,
  };
};
```

**Использование:**
```javascript
const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
```

---

## 🔄 Интеграция в приложение

### 1. App.js - Подключение Redux Provider

```javascript
import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  return (
    <Provider store={store}>
      <LocalizationProvider>
        <BrowserRouter>
          {/* ... остальное приложение */}
        </BrowserRouter>
      </LocalizationProvider>
    </Provider>
  );
}
```

**Важно:** Redux Provider должен быть выше всех компонентов, которые используют Redux.

---

### 2. Home.jsx - Использование Redux вместо useState

#### ❌ Было (локальное состояние):
```javascript
const Home = () => {
  const [language, setLanguage] = useState("en");
  const t = translations[language];
  
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      {/* ... */}
    </select>
  );
};
```

#### ✅ Стало (Redux):
```javascript
import useLanguage from "../../hooks/useLanguage";

const Home = () => {
  const { currentLanguage: language, setLanguage, supportedLanguages } = useLanguage();
  const t = translations[language] || translations['en'];
  
  return (
    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
      {supportedLanguages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
};
```

---

### 3. LanguageSelector.jsx - Обновление

```javascript
import useLanguage from '../../hooks/useLanguage';

const LanguageSelector = () => {
  const { t } = useLocalization();
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  
  const handleLanguageSelect = (languageCode) => {
    setLanguage(languageCode);
  };
  
  // ... остальной код
};
```

---

### 4. useLocalization.js - Синхронизация с Redux

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { 
  initializeLanguage, 
  setLanguage as setLanguageAction,
  selectCurrentLanguage 
} from '../store/slices/languageSlice';

export const useLocalization = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(selectCurrentLanguage);
  
  // Инициализация при загрузке
  useEffect(() => {
    const initializeLocalization = async () => {
      const savedLanguage = localizationService.loadSavedLanguage();
      if (!savedLanguage) {
        await localizationService.initialize();
      }
      const finalLanguage = localizationService.getCurrentLanguage();
      dispatch(initializeLanguage(finalLanguage));
    };
    
    initializeLocalization();
  }, [dispatch]);
  
  const setLanguage = (language) => {
    dispatch(setLanguageAction(language));
  };
  
  return { t, setLanguage, currentLanguage };
};
```

---

## 🎨 Использование в компонентах

### Пример 1: Простой селектор языка

```javascript
import useLanguage from '../hooks/useLanguage';

const LanguageSwitcher = () => {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  
  return (
    <select 
      value={currentLanguage} 
      onChange={(e) => setLanguage(e.target.value)}
    >
      {supportedLanguages.map(lang => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
};
```

### Пример 2: Кастомные кнопки

```javascript
import useLanguage from '../hooks/useLanguage';

const LanguageButtons = () => {
  const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
  
  return (
    <div className="flex space-x-2">
      {supportedLanguages.map(lang => (
        <button
          key={lang.code}
          onClick={() => setLanguage(lang.code)}
          className={currentLanguage === lang.code ? 'active' : ''}
        >
          {lang.flag}
        </button>
      ))}
    </div>
  );
};
```

### Пример 3: С переводами

```javascript
import useLanguage from '../hooks/useLanguage';
import useLocalization from '../hooks/useLocalization';
import translations from './translations.json';

const MyComponent = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useLocalization(); // для глобальных переводов
  const localT = translations[currentLanguage]; // для локальных переводов
  
  return (
    <div>
      <h1>{t('globalTitle')}</h1>
      <p>{localT.localDescription}</p>
    </div>
  );
};
```

---

## 🔍 Redux DevTools

Для отладки установите [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd):

1. Откройте Chrome DevTools (F12)
2. Перейдите на вкладку "Redux"
3. Наблюдайте за изменениями состояния в реальном времени

**Что можно увидеть:**
- Все dispatch действия (setLanguage, initializeLanguage)
- Изменения состояния до и после
- Временная шкала действий
- Возможность "перемотать" состояние назад

---

## 🔄 Поток данных

```
Пользователь нажимает кнопку смены языка
         ↓
LanguageSelector.handleLanguageSelect(languageCode)
         ↓
useLanguage.setLanguage(languageCode)
         ↓
dispatch(setLanguageAction(languageCode))
         ↓
Redux Store обновляет state.language.currentLanguage
         ↓
├─→ Сохраняет в localStorage
└─→ Синхронизирует с localizationService
         ↓
React re-render всех компонентов, подписанных на язык
         ↓
Home, Navbar, LanguageSelector - все показывают один язык ✅
```

---

## 💾 Сохранение состояния

### localStorage

Язык автоматически сохраняется в localStorage при изменении:

```javascript
setLanguage: (state, action) => {
  state.currentLanguage = action.payload;
  localStorage.setItem('selectedLanguage', action.payload); // ✅ Автосохранение
}
```

### Инициализация

При загрузке приложения язык восстанавливается:

```javascript
const getInitialLanguage = () => {
  // 1. Проверяем localStorage
  const savedLanguage = localStorage.getItem('selectedLanguage');
  if (savedLanguage) return savedLanguage;
  
  // 2. Проверяем localizationService
  const serviceLanguage = localizationService.getCurrentLanguage();
  if (serviceLanguage) return serviceLanguage;
  
  // 3. Определяем по браузеру
  const browserLang = navigator.language.split('-')[0];
  return ['uk', 'en', 'ru'].includes(browserLang) ? browserLang : 'en';
};
```

---

## 🧪 Тестирование

### Проверка синхронизации

1. **Откройте Home страницу**
2. **Выберите украинский язык** в селекторе на Home
3. **Перейдите в другую секцию** (например, Skills)
4. **Проверьте Navbar** - язык должен быть украинским ✅

### Проверка сохранения

1. **Выберите язык** (например, русский)
2. **Обновите страницу** (F5)
3. **Язык должен остаться русским** ✅

### Проверка через Redux DevTools

1. Откройте DevTools → Redux
2. Измените язык
3. Посмотрите на действие `language/setLanguage`
4. Проверьте изменение в state

---

## 🚀 Расширение функциональности

### Добавление нового языка

Отредактируйте `languageSlice.js`:

```javascript
supportedLanguages: [
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },      // ✨ Новый
  { code: 'fr', name: 'Français', flag: '🇫🇷' },    // ✨ Новый
]
```

### Добавление middleware для логирования

```javascript
const loggerMiddleware = (store) => (next) => (action) => {
  if (action.type.startsWith('language/')) {
    console.log('Language changed:', action.payload);
  }
  return next(action);
};

export const store = configureStore({
  reducer: { language: languageReducer },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(loggerMiddleware),
});
```

### Добавление persist (сохранение всего store)

Установите `redux-persist`:
```bash
npm install redux-persist
```

Настройте persist:
```javascript
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['language'], // только язык
};

const persistedReducer = persistReducer(persistConfig, languageReducer);
```

---

## 📚 Дополнительные ресурсы

- [Redux Toolkit Документация](https://redux-toolkit.js.org/)
- [React-Redux Hooks](https://react-redux.js.org/api/hooks)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)

---

## ✅ Чеклист интеграции

- [x] Установлены пакеты `@reduxjs/toolkit` и `react-redux`
- [x] Создан Redux store (`src/store/store.js`)
- [x] Создан language slice (`src/store/slices/languageSlice.js`)
- [x] Создан хук `useLanguage` для удобного использования
- [x] Redux Provider добавлен в `App.js`
- [x] `Home.jsx` переведен на Redux
- [x] `LanguageSelector.jsx` обновлен для Redux
- [x] `useLocalization.js` синхронизирован с Redux
- [x] Язык синхронизирован между всеми компонентами
- [x] Сохранение в localStorage работает
- [x] Восстановление из localStorage при загрузке

---

## 🎉 Результат

**Теперь выбор языка работает глобально:**
- 🌐 Один источник правды (Redux)
- 🔄 Автоматическая синхронизация
- 💾 Сохранение в localStorage
- ✨ Простое API через хуки
- 🐛 Легкая отладка через DevTools

**Выбор языка в любом месте приложения автоматически обновляет язык везде!** ✅

---

**Дата создания:** 7 октября 2025  
**Автор:** AI Assistant  
**Версия:** 1.0

