// Утилита для определения геолокации пользователя
class GeolocationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 часа
  }

  // Определение страны по IP через API
  async getCountryByIP() {
    try {
      const cached = this.cache.get('country');
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) throw new Error('Failed to fetch geolocation data');

      const data = await response.json();
      const countryData = {
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        timezone: data.timezone
      };

      this.cache.set('country', { data: countryData, timestamp: Date.now() });
      return countryData;
    } catch (error) {
      console.warn('Failed to get geolocation:', error);
      return {
        country: 'Unknown',
        countryCode: 'US',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'UTC'
      };
    }
  }

  getBrowserLanguage() {
    const language = navigator.language || navigator.userLanguage || 'en';
    return language.split('-')[0];
  }

  async getPreferredLanguage() {
    try {
      const [countryData, browserLang] = await Promise.all([
        this.getCountryByIP(),
        Promise.resolve(this.getBrowserLanguage())
      ]);

      const countryLanguageMap = {
        // Украинский
        'Ukraine': 'uk',
        
        // Русский
        'Russia': 'ru', 'Belarus': 'ru', 'Kazakhstan': 'ru', 'Kyrgyzstan': 'ru',
        'Uzbekistan': 'ru', 'Tajikistan': 'ru', 'Turkmenistan': 'ru', 'Moldova': 'ru',
        'Georgia': 'ru', 'Armenia': 'ru', 'Azerbaijan': 'ru',
        
        // Французский
        'France': 'fr', 'Belgium': 'fr', 'Luxembourg': 'fr', 'Switzerland': 'fr',
        'Monaco': 'fr', 'Andorra': 'fr', 'French Guiana': 'fr', 'Guadeloupe': 'fr',
        'Martinique': 'fr', 'Réunion': 'fr', 'New Caledonia': 'fr', 'French Polynesia': 'fr',
        'Wallis and Futuna': 'fr', 'Mayotte': 'fr', 'Saint Pierre and Miquelon': 'fr',
        'Saint Barthélemy': 'fr', 'Saint Martin': 'fr', 'Vanuatu': 'fr', 'Comoros': 'fr',
        'Madagascar': 'fr', 'Mauritius': 'fr', 'Seychelles': 'fr', 'Djibouti': 'fr',
        'Chad': 'fr', 'Central African Republic': 'fr', 'Congo': 'fr',
        'Democratic Republic of the Congo': 'fr', 'Gabon': 'fr', 'Cameroon': 'fr',
        'Burkina Faso': 'fr', 'Mali': 'fr', 'Niger': 'fr', 'Senegal': 'fr', 'Guinea': 'fr',
        'Ivory Coast': 'fr', 'Togo': 'fr', 'Benin': 'fr', 'Burundi': 'fr', 'Rwanda': 'fr',
        'Haiti': 'fr', 'Lebanon': 'fr', 'Syria': 'fr', 'Algeria': 'fr', 'Morocco': 'fr',
        'Tunisia': 'fr', 'Mauritania': 'fr',
        
        // Испанский
        'Spain': 'es', 'Mexico': 'es', 'Argentina': 'es', 'Chile': 'es', 'Colombia': 'es',
        'Peru': 'es', 'Venezuela': 'es', 'Cuba': 'es', 'Puerto Rico': 'es',
        'Dominican Republic': 'es', 'Panama': 'es', 'Costa Rica': 'es', 'Nicaragua': 'es',
        'Honduras': 'es', 'El Salvador': 'es', 'Guatemala': 'es', 'Ecuador': 'es',
        'Bolivia': 'es', 'Paraguay': 'es', 'Uruguay': 'es', 'Equatorial Guinea': 'es',
        'Philippines': 'es',
        
        // Португальский
        'Portugal': 'pt', 'Brazil': 'pt', 'Angola': 'pt', 'Mozambique': 'pt',
        'Guinea-Bissau': 'pt', 'Cape Verde': 'pt', 'São Tomé and Príncipe': 'pt',
        'East Timor': 'pt', 'Macau': 'pt',
        
        // Английский (Fallback для основных англоязычных стран и территорий)
        'United Kingdom': 'en', 'Ireland': 'en', 'United States': 'en', 'Canada': 'en',
        'Australia': 'en', 'New Zealand': 'en', 'South Africa': 'en', 'India': 'en'
        // ... все остальные по умолчанию станут 'en' через логику ниже
      };

      const countryLanguage = countryLanguageMap[countryData.country] || 'en';
      
      // Приоритет: 1. Язык по стране (если есть в мапе), 2. Язык браузера, 3. Английский
      const preferredLanguage = countryLanguageMap[countryData.country] || browserLang || 'en';
      
      return {
        language: preferredLanguage,
        country: countryData.country,
        countryCode: countryData.countryCode,
        browserLanguage: browserLang,
        timezone: countryData.timezone
      };
    } catch (error) {
      console.warn('Failed to determine preferred language:', error);
      return { language: 'en', country: 'Unknown', countryCode: 'US', browserLanguage: 'en', timezone: 'UTC' };
    }
  }

  isGeolocationSupported() {
    return 'geolocation' in navigator;
  }

  async getCurrentPosition() {
    if (!this.isGeolocationSupported()) throw new Error('Geolocation is not supported');

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          accuracy: pos.coords.accuracy
        }),
        (err) => reject(err),
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
      );
    });
  }
}

export default new GeolocationService();