import geolocationService from './geolocation.js';


const translations = {

  uk: {
  
    brand: 'DEV Hub',
    subtitle: '',
    tools: 'Інструменти',
    toolsDropdown: 'Інструменти',
    toolsItems: {
      camera: 'Камера',
      microphone: 'Микрофон',
      ip: 'Ваш IP',
      toneGenerator: 'Тон-генератор',
    },
    
    chat: 'Посиденьки',
    games: 'Ігри',
    blog: 'Блог',
    files: 'Файли',
    profile: 'Профіль',
    
    profileItems: {
      overview: 'Особистий кабінет',
      messages: 'Повідомлення',
      friends: 'Друзі',
      admin: 'Адмін-панель',
    },
    
    settings: 'Налаштування',
    
    // Кнопки
    openMenu: 'Відкрити меню',
    closeMenu: 'Закрити меню',
    
    // Навигация
    home: 'Головна',
    login: 'Авторизація',
    register: 'Реєстрація',
    logout: 'Вийти',
    admin: 'Адмін',
    user: 'Користувач'
  },
  

  ru: {
    brand: 'DEV Hub',
    subtitle: ' ',
    
    tools: 'Инструменты',
    toolsDropdown: 'Инструменты',
    toolsItems: {
      camera: 'Камера',
      microphone: 'Микрофон',
      // converter: 'Конвертер',
      ip: 'Ваш IP',
      toneGenerator: 'Тон-генератор',
      // paint: 'Paint'
    },
    
    chat: 'Беседка',
    games: 'Игры',
    blog: 'Блог',
    files: 'Файлы',
    // faq: 'FAQ',
    profile: 'Профиль',
    
    profileItems: {
      overview: 'Личный кабинет',
      messages: 'Сообщения',
      friends: 'Друзья',
      admin: 'Админ-панель',
    },
    
    settings: 'Настройки',
    
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    
    home: 'Главная',
    login: 'Авторизация',
    register: 'Регистрация',
    logout: 'Выйти',
    admin: 'Админ',
    user: 'Пользователь'
  },
  

  en: {
    brand: 'DEV Hub',
    subtitle: ' ',
    
    tools: 'Tools',
    toolsDropdown: 'Tools',
    toolsItems: {
      camera: 'Camera',
      microphone: 'Microphone',
      ip: 'Your IP',
      toneGenerator: 'Tone Generator',

    },
    
    chat: 'Chat',
    games: 'Games',
    blog: 'Blog',
    files: 'Files',
    // faq: 'FAQ',
    profile: 'Profile',
    
    profileItems: {
      overview: 'My Profile',
      messages: 'Messages',
      friends: 'Friends',
      admin: 'Admin Panel',
    },
    
    settings: 'Settings',
    
    openMenu: 'Open Menu',
    closeMenu: 'Close Menu',
    
    home: 'Home',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    admin: 'Admin',
    user: 'User'
  },
  
}


class LocalizationService {
  constructor() {
    this.currentLanguage = 'en';
    this.translations = translations;
    this.listeners = new Set();
  }

  // Инициализация локализации
  async initialize() {
    try {
      const geoData = await geolocationService.getPreferredLanguage();
      this.setLanguage(geoData.language);
      return geoData;
    } catch (error) {
      console.warn('Failed to initialize localization:', error);
      this.setLanguage('en');
      return { language: 'en', country: 'Unknown' };
    }
  }

  // Установка языка
  setLanguage(language) {
    if (this.translations[language]) {
      this.currentLanguage = language;
      this.notifyListeners();
      // Сохраняем в localStorage
      localStorage.setItem('preferredLanguage', language);
    } else {
      console.warn(`Language ${language} not supported, falling back to English`);
      this.currentLanguage = 'en';
      this.notifyListeners();
    }
  }

  // Получение текущего языка
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Получение перевода
  t(key, fallback = '') {
    const keys = key.split('.');
    let translation = this.translations[this.currentLanguage];
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        // Пробуем английский как fallback
        translation = this.translations['en'];
        for (const fallbackKey of keys) {
          if (translation && translation[fallbackKey]) {
            translation = translation[fallbackKey];
          } else {
            return fallback || key;
          }
        }
        break;
      }
    }
    
    return translation || fallback || key;
  }

  // Подписка на изменения языка
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Уведомление подписчиков
  notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentLanguage));
  }

  // Получение списка поддерживаемых языков
  getSupportedLanguages() {
    return Object.keys(this.translations).map(code => ({
      code,
      name: this.getLanguageName(code),
      flag: this.getLanguageFlag(code)
    }));
  }

  // Получение названия языка
  getLanguageName(code) {
    const languageNames = {
      uk: 'Українська',
      ru: 'Русский',
      en: 'English',
    };
    return languageNames[code] || code;
  }

  // Получение флага языка
  getLanguageFlag(code) {
    const languageFlags = {
      uk: '🇺🇦',
      ru: '🇷🇺',
      en: '🇺🇸',
    };
    return languageFlags[code] || '🌐';
  }

  // Загрузка сохраненного языка
  loadSavedLanguage() {
    const saved = localStorage.getItem('preferredLanguage');
    if (saved && this.translations[saved]) {
      this.currentLanguage = saved;
      return saved;
    }
    return null;
  }
}

export default new LocalizationService(); 