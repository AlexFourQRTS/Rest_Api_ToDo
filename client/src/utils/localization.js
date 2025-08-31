// Система локализации для навбара
import geolocationService from './geolocation.js';

// Переводы для навбара
const translations = {
  // Украинский
  uk: {
    // Основные элементы навбара
    brand: 'DEV Hub',
    subtitle: ' ',
    
    // Меню "Про мене"
    aboutMe: 'Про мене',
    aboutMeDropdown: 'Про мене',
    aboutMeItems: {
      about: 'Про мене',
      portfolio: 'Портфоліо',
      skills: 'Навички',
      services: 'Сервіси',
      // news: 'Новини'
    },
    
    // Меню "Інструменти"
    tools: 'Інструменти',
    toolsDropdown: 'Інструменти',
    toolsItems: {
      camera: 'Камера',
      microphone: 'Микрофон',
      // converter: 'Конвертор',
      ip: 'Ваш IP',
      toneGenerator: 'Тон-генератор',
      // paint: 'Paint'
    },
    
    // Остальные пункты меню
    chat: 'Чат',
    games: 'Ігри',
    blog: 'Блог',
    files: 'Файли',
    // faq: 'FAQ',
    profile: 'Профіль',
    
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
  
  // Русский
  ru: {
    brand: 'DEV Hub',
    subtitle: ' ',
    
    aboutMe: 'Обо мне',
    aboutMeDropdown: 'Обо мне',
    aboutMeItems: {
      about: 'Обо мне',
      portfolio: 'Портфолио',
      skills: 'Навыки',
      services: 'Сервисы',
      // news: 'Новости'
    },
    
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
    
    chat: 'Чат',
    games: 'Игры',
    blog: 'Блог',
    files: 'Файлы',
    // faq: 'FAQ',
    profile: 'Профиль',
    
    openMenu: 'Открыть меню',
    closeMenu: 'Закрыть меню',
    
    home: 'Главная',
    login: 'Авторизация',
    register: 'Регистрация',
    logout: 'Выйти',
    admin: 'Админ',
    user: 'Пользователь'
  },
  
  // Английский
  en: {
    brand: 'DEV Hub',
    subtitle: ' ',
    
    aboutMe: 'About Me',
    aboutMeDropdown: 'About Me',
    aboutMeItems: {
      about: 'About Me',
      portfolio: 'Portfolio',
      skills: 'Skills',
      services: 'Services',
      // news: 'News'
    },
    
    tools: 'Tools',
    toolsDropdown: 'Tools',
    toolsItems: {
      camera: 'Camera',
      microphone: 'Microphone',
      // converter: 'Converter',
      ip: 'Your IP',
      toneGenerator: 'Tone Generator',
      // paint: 'Paint'
    },
    
    chat: 'Chat',
    games: 'Games',
    blog: 'Blog',
    files: 'Files',
    // faq: 'FAQ',
    profile: 'Profile',
    
    openMenu: 'Open Menu',
    closeMenu: 'Close Menu',
    
    home: 'Home',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    admin: 'Admin',
    user: 'User'
  },
  
  // Французский
  fr: {
   brand: 'DEV Hub',
    subtitle: ' ',
    
    aboutMe: 'À propos',
    aboutMeDropdown: 'À propos',
    aboutMeItems: {
      about: 'À propos',
      portfolio: 'Portfolio',
      skills: 'Compétences',
      services: 'Services',
      // news: 'Actualités'
    },
    
    tools: 'Outils',
    toolsDropdown: 'Outils',
    toolsItems: {
      camera: 'Caméra',
      microphone: 'Microphone',
      // converter: 'Convertisseur',
      ip: 'Votre IP',
      toneGenerator: 'Générateur de tons',
      // paint: 'Paint'
    },
    
    chat: 'Chat',
    games: 'Jeux',
    blog: 'Blog',
    files: 'Fichiers',
    // faq: 'FAQ',
    profile: 'Profil',
    
    openMenu: 'Ouvrir le menu',
    closeMenu: 'Fermer le menu',
    
    home: 'Accueil',
    login: 'Connexion',
    register: 'Inscription',
    logout: 'Déconnexion',
    admin: 'Admin',
    user: 'Utilisateur'
  },
  
  // Испанский
  es: {
    brand: 'DEV Hub',
    subtitle: ' ',
    
    aboutMe: 'Sobre mí',
    aboutMeDropdown: 'Sobre mí',
    aboutMeItems: {
      about: 'Sobre mí',
      portfolio: 'Portafolio',
      skills: 'Habilidades',
      services: 'Servicios',
      // news: 'Noticias'
    },
    
    tools: 'Herramientas',
    toolsDropdown: 'Herramientas',
    toolsItems: {
      camera: 'Cámara',
      microphone: 'Micrófono',
      // converter: 'Convertidor',
      ip: 'Tu IP',
      toneGenerator: 'Generador de tonos',
      // paint: 'Paint'
    },
    
    chat: 'Chat',
    games: 'Juegos',
    blog: 'Blog',
    files: 'Archivos',
    // faq: 'FAQ',
    profile: 'Perfil',
    
    openMenu: 'Abrir menú',
    closeMenu: 'Cerrar menú',
    
    home: 'Inicio',
    login: 'Iniciar sesión',
    register: 'Registrarse',
    logout: 'Cerrar sesión',
    admin: 'Admin',
    user: 'Usuario'
  },
  
  // Португальский
  pt: {
    brand: 'DEV Hub',
    subtitle: ' ',
    
    aboutMe: 'Sobre mim',
    aboutMeDropdown: 'Sobre mim',
    aboutMeItems: {
      about: 'Sobre mim',
      portfolio: 'Portfólio',
      skills: 'Habilidades',
      services: 'Serviços',
      // news: 'Notícias'
    },
    
    tools: 'Ferramentas',
    toolsDropdown: 'Ferramentas',
    toolsItems: {
      camera: 'Câmera',
      microphone: 'Microfone',
      // converter: 'Conversor',
      ip: 'Seu IP',
      toneGenerator: 'Gerador de tons',
      // paint: 'Paint'
    },
    
    chat: 'Chat',
    games: 'Jogos',
    blog: 'Blog',
    files: 'Arquivos',
    // faq: 'FAQ',
    profile: 'Perfil',
    
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    
    home: 'Início',
    login: 'Entrar',
    register: 'Registrar',
    logout: 'Sair',
    admin: 'Admin',
    user: 'Usuário'
  }
};

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
      fr: 'Français',
      es: 'Español',
      pt: 'Português'
    };
    return languageNames[code] || code;
  }

  // Получение флага языка
  getLanguageFlag(code) {
    const languageFlags = {
      uk: '🇺🇦',
      ru: '🇷🇺',
      en: '🇺🇸',
      fr: '🇫🇷',
      es: '🇪🇸',
      pt: '🇵🇹'
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