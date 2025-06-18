import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Функция для сбора информации о пользователе
const getUserInfo = () => {
  const userAgent = navigator.userAgent;
  const language = navigator.language || navigator.userLanguage;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const colorDepth = window.screen.colorDepth;
  const referrer = document.referrer;
  const platform = navigator.platform;
  const vendor = navigator.vendor;
  const connection = navigator.connection ? {
    effectiveType: navigator.connection.effectiveType,
    downlink: navigator.connection.downlink,
    rtt: navigator.connection.rtt,
    saveData: navigator.connection.saveData
  } : null;
  const deviceMemory = navigator.deviceMemory;
  const hardwareConcurrency = navigator.hardwareConcurrency;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent);
  const isDesktop = !isMobile && !isTablet;

  return {
    userAgent,
    language,
    timezone,
    screenWidth,
    screenHeight,
    colorDepth,
    referrer,
    platform,
    vendor,
    connection,
    deviceMemory,
    hardwareConcurrency,
    deviceType: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
};

export const logActivity = async (action, details) => {
  const userInfo = getUserInfo();
  const payload = {
    action,
    details,
    timestamp: new Date().toISOString(),
    ...userInfo
  };

  try {
    // В будущем здесь будет отправка на бэкенд
    // await axios.post(`${BASE_URL}/api/activity/log`, payload);
    console.log('Activity logged:', payload);
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

// Логируем загрузку страницы при импорте модуля
logActivity('page_load', { path: window.location.pathname });

// Логируем, если пользователь гость (не авторизован)
const isGuest = !localStorage.getItem('token'); // или другая проверка на гостя
if (isGuest) {
  logActivity('guest_visit', { path: window.location.pathname });
} 