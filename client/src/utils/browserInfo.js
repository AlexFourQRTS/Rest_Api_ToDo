// Утилита для получения информации о браузере пользователя
class BrowserInfoService {
  constructor() {
    this.userAgent = navigator.userAgent;
    this.platform = navigator.platform;
    this.language = navigator.language;
    this.languages = navigator.languages;
    this.cookieEnabled = navigator.cookieEnabled;
    this.onLine = navigator.onLine;
    this.hardwareConcurrency = navigator.hardwareConcurrency;
    this.deviceMemory = navigator.deviceMemory;
    this.maxTouchPoints = navigator.maxTouchPoints;
  }

  // Получение информации о браузере
  getBrowserInfo() {
    return {
      name: this.getBrowserName(),
      version: this.getBrowserVersion(),
      engine: this.getBrowserEngine(),
      os: this.getOperatingSystem(),
      device: this.getDeviceType(),
      mobile: this.isMobile(),
      tablet: this.isTablet(),
      desktop: this.isDesktop(),
      userAgent: this.userAgent,
      vendor: navigator.vendor,
      appName: navigator.appName,
      appVersion: navigator.appVersion,
      product: navigator.product,
      productSub: navigator.productSub
    };
  }

  // Получение информации о системе
  getSystemInfo() {
    return {
      platform: this.platform,
      language: this.language,
      languages: this.languages,
      cookieEnabled: this.cookieEnabled,
      onLine: this.onLine,
      hardwareConcurrency: this.hardwareConcurrency,
      deviceMemory: this.deviceMemory,
      maxTouchPoints: this.maxTouchPoints,
      screenResolution: this.getScreenResolution(),
      viewportSize: this.getViewportSize(),
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timezoneOffset: new Date().getTimezoneOffset()
    };
  }

  // Получение информации о подключении
  getConnectionInfo() {
    return {
      onLine: this.onLine,
      effectiveType: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 'unknown',
      rtt: navigator.connection?.rtt || 'unknown',
      saveData: navigator.connection?.saveData || false
    };
  }

  // Получение информации о производительности
  getPerformanceInfo() {
    const performance = window.performance;
    const memory = performance.memory;
    const timing = performance.timing;
    
    return {
      memory: memory ? {
        usedJSHeapSize: this.formatBytes(memory.usedJSHeapSize),
        totalJSHeapSize: this.formatBytes(memory.totalJSHeapSize),
        jsHeapSizeLimit: this.formatBytes(memory.jsHeapSizeLimit)
      } : null,
      timing: timing ? {
        navigationStart: timing.navigationStart,
        loadEventEnd: timing.loadEventEnd,
        domContentLoadedEventEnd: timing.domContentLoadedEventEnd,
        responseEnd: timing.responseEnd,
        responseStart: timing.responseStart,
        requestStart: timing.requestStart,
        domainLookupEnd: timing.domainLookupEnd,
        domainLookupStart: timing.domainLookupStart,
        connectEnd: timing.connectEnd,
        connectStart: timing.connectStart
      } : null,
      navigation: performance.navigation ? {
        type: this.getNavigationType(performance.navigation.type),
        redirectCount: performance.navigation.redirectCount
      } : null
    };
  }

  // Получение информации о WebGL
  getWebGLInfo() {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (!gl) {
        return { supported: false };
      }

      return {
        supported: true,
        vendor: gl.getParameter(gl.VENDOR),
        renderer: gl.getParameter(gl.RENDERER),
        version: gl.getParameter(gl.VERSION),
        shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
        maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE),
        maxViewportDims: gl.getParameter(gl.MAX_VIEWPORT_DIMS),
        maxRenderbufferSize: gl.getParameter(gl.MAX_RENDERBUFFER_SIZE),
        maxVertexAttribs: gl.getParameter(gl.MAX_VERTEX_ATTRIBS),
        maxVertexUniformVectors: gl.getParameter(gl.MAX_VERTEX_UNIFORM_VECTORS),
        maxFragmentUniformVectors: gl.getParameter(gl.MAX_FRAGMENT_UNIFORM_VECTORS),
        maxVaryingVectors: gl.getParameter(gl.MAX_VARYING_VECTORS)
      };
    } catch (error) {
      return { supported: false, error: error.message };
    }
  }

  // Получение информации о Canvas
  getCanvasInfo() {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      return {
        supported: true,
        width: canvas.width,
        height: canvas.height,
        toDataURL: typeof canvas.toDataURL === 'function',
        getImageData: typeof ctx.getImageData === 'function',
        putImageData: typeof ctx.putImageData === 'function'
      };
    } catch (error) {
      return { supported: false, error: error.message };
    }
  }

  // Получение информации о медиа устройствах
  getMediaInfo() {
    return {
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia),
      mediaSession: !!navigator.mediaSession,
      mediaCapabilities: !!navigator.mediaCapabilities,
      mediaRecorder: !!window.MediaRecorder,
      webAudio: !!window.AudioContext || !!window.webkitAudioContext
    };
  }

  // Получение информации о хранилище
  getStorageInfo() {
    return {
      localStorage: this.testLocalStorage(),
      sessionStorage: this.testSessionStorage(),
      indexedDB: !!window.indexedDB,
      webSQL: !!window.openDatabase,
      cookies: this.cookieEnabled,
      cacheStorage: !!window.caches,
      serviceWorker: !!navigator.serviceWorker
    };
  }

  // Получение информации о безопасности
  getSecurityInfo() {
    return {
      isSecureContext: window.isSecureContext,
      origin: window.location.origin,
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
      referrer: document.referrer,
      userAgent: this.userAgent
    };
  }

  // Получение информации о датчиках
  getSensorInfo() {
    return {
      accelerometer: !!window.Accelerometer,
      gyroscope: !!window.Gyroscope,
      magnetometer: !!window.Magnetometer,
      absoluteOrientation: !!window.AbsoluteOrientationSensor,
      relativeOrientation: !!window.RelativeOrientationSensor,
      geolocation: !!navigator.geolocation,
      vibration: !!navigator.vibrate,
      battery: !!navigator.getBattery,
      proximity: !!window.ProximitySensor,
      ambientLight: !!window.AmbientLightSensor
    };
  }

  // Получение информации о Web APIs
  getWebAPIInfo() {
    return {
      fetch: !!window.fetch,
      promises: !!window.Promise,
      asyncAwait: this.testAsyncAwait(),
      webWorkers: !!window.Worker,
      sharedWorkers: !!window.SharedWorker,
      webSockets: !!window.WebSocket,
      serverSentEvents: !!window.EventSource,
      webRTC: !!(window.RTCPeerConnection || window.webkitRTCPeerConnection),
      pushManager: !!navigator.serviceWorker && !!navigator.serviceWorker.ready,
      notifications: !!window.Notification,
      clipboard: !!navigator.clipboard,
      share: !!navigator.share,
      contacts: !!navigator.contacts,
      credentials: !!navigator.credentials,
      permissions: !!navigator.permissions,
      wakeLock: !!navigator.wakeLock,
      bluetooth: !!navigator.bluetooth,
      usb: !!navigator.usb,
      serial: !!navigator.serial,
      hid: !!navigator.hid,
      gamepad: !!navigator.getGamepads,
      presentation: !!navigator.presentation,
      payment: !!window.PaymentRequest
    };
  }

  // Вспомогательные методы
  testLocalStorage() {
    try {
      const test = 'test';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  testSessionStorage() {
    try {
      const test = 'test';
      sessionStorage.setItem(test, test);
      sessionStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  testAsyncAwait() {
    try {
      eval('async function test() { return true; }');
      return true;
    } catch (e) {
      return false;
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  getNavigationType(type) {
    const types = {
      0: 'Navigate',
      1: 'Reload',
      2: 'Back/Forward',
      255: 'Reserved'
    };
    return types[type] || 'Unknown';
  }

  // Определение названия браузера
  getBrowserName() {
    if (this.userAgent.includes('Firefox')) return 'Firefox';
    if (this.userAgent.includes('Chrome') && !this.userAgent.includes('Edg')) return 'Chrome';
    if (this.userAgent.includes('Safari') && !this.userAgent.includes('Chrome')) return 'Safari';
    if (this.userAgent.includes('Edg')) return 'Edge';
    if (this.userAgent.includes('Opera') || this.userAgent.includes('OPR')) return 'Opera';
    if (this.userAgent.includes('MSIE') || this.userAgent.includes('Trident')) return 'Internet Explorer';
    return 'Unknown';
  }

  // Определение версии браузера
  getBrowserVersion() {
    const match = this.userAgent.match(/(chrome|firefox|safari|opera|edge|msie|trident(?=\/))\/?\s*(\d+)/i);
    return match ? match[2] : 'Unknown';
  }

  // Определение движка браузера
  getBrowserEngine() {
    if (this.userAgent.includes('Gecko')) return 'Gecko';
    if (this.userAgent.includes('WebKit')) return 'WebKit';
    if (this.userAgent.includes('Blink')) return 'Blink';
    if (this.userAgent.includes('Trident')) return 'Trident';
    return 'Unknown';
  }

  // Определение операционной системы
  getOperatingSystem() {
    if (this.userAgent.includes('Windows')) return 'Windows';
    if (this.userAgent.includes('Mac')) return 'macOS';
    if (this.userAgent.includes('Linux')) return 'Linux';
    if (this.userAgent.includes('Android')) return 'Android';
    if (this.userAgent.includes('iOS')) return 'iOS';
    return 'Unknown';
  }

  // Определение типа устройства
  getDeviceType() {
    if (this.isMobile()) return 'Mobile';
    if (this.isTablet()) return 'Tablet';
    if (this.isDesktop()) return 'Desktop';
    return 'Unknown';
  }

  // Проверка на мобильное устройство
  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(this.userAgent);
  }

  // Проверка на планшет
  isTablet() {
    return /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i.test(this.userAgent);
  }

  // Проверка на десктоп
  isDesktop() {
    return !this.isMobile() && !this.isTablet();
  }

  // Получение разрешения экрана
  getScreenResolution() {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight
    };
  }

  // Получение размера viewport
  getViewportSize() {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }

  // Получение всех данных о браузере
  getAllInfo() {
    return {
      browser: this.getBrowserInfo(),
      system: this.getSystemInfo(),
      connection: this.getConnectionInfo(),
      performance: this.getPerformanceInfo(),
      webgl: this.getWebGLInfo(),
      canvas: this.getCanvasInfo(),
      media: this.getMediaInfo(),
      storage: this.getStorageInfo(),
      security: this.getSecurityInfo(),
      sensors: this.getSensorInfo(),
      webAPIs: this.getWebAPIInfo(),
      userAgent: this.userAgent
    };
  }
}

const browserInfoService = new BrowserInfoService();
export default browserInfoService; 