// Утилита для определения геолокации пользователя
class GeolocationService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 часа
  }

  // Определение страны по IP через API
  async getCountryByIP() {
    try {
      // Проверяем кэш
      const cached = this.cache.get('country');
      if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.data;
      }

      // Используем бесплатный API для определения страны
      const response = await fetch('https://ipapi.co/json/', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        timeout: 5000
      });

      if (!response.ok) {
        throw new Error('Failed to fetch geolocation data');
      }

      const data = await response.json();
      const countryData = {
        country: data.country_name,
        countryCode: data.country_code,
        region: data.region,
        city: data.city,
        timezone: data.timezone
      };

      // Кэшируем результат
      this.cache.set('country', {
        data: countryData,
        timestamp: Date.now()
      });

      return countryData;
    } catch (error) {
      console.warn('Failed to get geolocation:', error);
      // Возвращаем дефолтные значения
      return {
        country: 'Unknown',
        countryCode: 'US',
        region: 'Unknown',
        city: 'Unknown',
        timezone: 'UTC'
      };
    }
  }

  // Определение языка браузера
  getBrowserLanguage() {
    const language = navigator.language || navigator.userLanguage || 'en';
    return language.split('-')[0]; // Берем только основной язык
  }

  // Определение предпочтительного языка на основе геолокации и браузера
  async getPreferredLanguage() {
    try {
      const [countryData, browserLang] = await Promise.all([
        this.getCountryByIP(),
        Promise.resolve(this.getBrowserLanguage())
      ]);

      // Маппинг стран на языки (только нужные языки)
      const countryLanguageMap = {
        // Украинский
        'Ukraine': 'uk',
        
        // Русский
        'Russia': 'ru',
        'Belarus': 'ru',
        'Kazakhstan': 'ru',
        'Kyrgyzstan': 'ru',
        'Uzbekistan': 'ru',
        'Tajikistan': 'ru',
        'Turkmenistan': 'ru',
        'Moldova': 'ru',
        'Georgia': 'ru',
        'Armenia': 'ru',
        'Azerbaijan': 'ru',
        
        // Французский
        'France': 'fr',
        'Belgium': 'fr',
        'Luxembourg': 'fr',
        'Switzerland': 'fr',
        'Monaco': 'fr',
        'Andorra': 'fr',
        'French Guiana': 'fr',
        'Guadeloupe': 'fr',
        'Martinique': 'fr',
        'Réunion': 'fr',
        'New Caledonia': 'fr',
        'French Polynesia': 'fr',
        'Wallis and Futuna': 'fr',
        'Mayotte': 'fr',
        'Saint Pierre and Miquelon': 'fr',
        'Saint Barthélemy': 'fr',
        'Saint Martin': 'fr',
        'Vanuatu': 'fr',
        'Comoros': 'fr',
        'Madagascar': 'fr',
        'Mauritius': 'fr',
        'Seychelles': 'fr',
        'Djibouti': 'fr',
        'Chad': 'fr',
        'Central African Republic': 'fr',
        'Congo': 'fr',
        'Democratic Republic of the Congo': 'fr',
        'Gabon': 'fr',
        'Cameroon': 'fr',
        'Burkina Faso': 'fr',
        'Mali': 'fr',
        'Niger': 'fr',
        'Senegal': 'fr',
        'Guinea': 'fr',
        'Ivory Coast': 'fr',
        'Togo': 'fr',
        'Benin': 'fr',
        'Burundi': 'fr',
        'Rwanda': 'fr',
        'Haiti': 'fr',
        'Lebanon': 'fr',
        'Syria': 'fr',
        'Algeria': 'fr',
        'Morocco': 'fr',
        'Tunisia': 'fr',
        'Mauritania': 'fr',
        'Niger': 'fr',
        'Mali': 'fr',
        'Burkina Faso': 'fr',
        'Senegal': 'fr',
        'Guinea': 'fr',
        'Ivory Coast': 'fr',
        'Togo': 'fr',
        'Benin': 'fr',
        'Central African Republic': 'fr',
        'Congo': 'fr',
        'Democratic Republic of the Congo': 'fr',
        'Gabon': 'fr',
        'Cameroon': 'fr',
        'Chad': 'fr',
        'Comoros': 'fr',
        'Madagascar': 'fr',
        'Mauritius': 'fr',
        'Seychelles': 'fr',
        'Djibouti': 'fr',
        'Burundi': 'fr',
        'Rwanda': 'fr',
        'Haiti': 'fr',
        'Lebanon': 'fr',
        'Syria': 'fr',
        'Algeria': 'fr',
        'Morocco': 'fr',
        'Tunisia': 'fr',
        'Mauritania': 'fr',
        
        // Испанский
        'Spain': 'es',
        'Mexico': 'es',
        'Argentina': 'es',
        'Chile': 'es',
        'Colombia': 'es',
        'Peru': 'es',
        'Venezuela': 'es',
        'Cuba': 'es',
        'Puerto Rico': 'es',
        'Dominican Republic': 'es',
        'Panama': 'es',
        'Costa Rica': 'es',
        'Nicaragua': 'es',
        'Honduras': 'es',
        'El Salvador': 'es',
        'Guatemala': 'es',
        'Ecuador': 'es',
        'Bolivia': 'es',
        'Paraguay': 'es',
        'Uruguay': 'es',
        'Equatorial Guinea': 'es',
        'Philippines': 'es',
        
        // Португальский
        'Portugal': 'pt',
        'Brazil': 'pt',
        'Angola': 'pt',
        'Mozambique': 'pt',
        'Guinea-Bissau': 'pt',
        'Cape Verde': 'pt',
        'São Tomé and Príncipe': 'pt',
        'East Timor': 'pt',
        'Macau': 'pt',
        
        // Английский (как fallback для остальных стран)
        'United Kingdom': 'en',
        'Ireland': 'en',
        'United States': 'en',
        'Canada': 'en',
        'Australia': 'en',
        'New Zealand': 'en',
        'South Africa': 'en',
        'India': 'en',
        'Pakistan': 'en',
        'Bangladesh': 'en',
        'Nigeria': 'en',
        'Kenya': 'en',
        'Uganda': 'en',
        'Tanzania': 'en',
        'Ghana': 'en',
        'Ethiopia': 'en',
        'Sudan': 'en',
        'Egypt': 'en',
        'Israel': 'en',
        'Jordan': 'en',
        'Iraq': 'en',
        'Iran': 'en',
        'Afghanistan': 'en',
        'Saudi Arabia': 'en',
        'Yemen': 'en',
        'Oman': 'en',
        'United Arab Emirates': 'en',
        'Qatar': 'en',
        'Kuwait': 'en',
        'Bahrain': 'en',
        'Kuwait': 'en',
        'Malaysia': 'en',
        'Singapore': 'en',
        'Hong Kong': 'en',
        'Taiwan': 'en',
        'Japan': 'en',
        'South Korea': 'en',
        'China': 'en',
        'Thailand': 'en',
        'Vietnam': 'en',
        'Cambodia': 'en',
        'Laos': 'en',
        'Myanmar': 'en',
        'Nepal': 'en',
        'Bhutan': 'en',
        'Sri Lanka': 'en',
        'Maldives': 'en',
        'Indonesia': 'en',
        'Papua New Guinea': 'en',
        'Fiji': 'en',
        'Solomon Islands': 'en',
        'Vanuatu': 'en',
        'New Caledonia': 'en',
        'Samoa': 'en',
        'Tonga': 'en',
        'Kiribati': 'en',
        'Tuvalu': 'en',
        'Nauru': 'en',
        'Palau': 'en',
        'Marshall Islands': 'en',
        'Micronesia': 'en',
        'Northern Mariana Islands': 'en',
        'Guam': 'en',
        'American Samoa': 'en',
        'Cook Islands': 'en',
        'Niue': 'en',
        'Tokelau': 'en',
        'Pitcairn Islands': 'en',
        'Norfolk Island': 'en',
        'Christmas Island': 'en',
        'Cocos Islands': 'en',
        'Heard Island and McDonald Islands': 'en',
        'Bouvet Island': 'en',
        'South Georgia and the South Sandwich Islands': 'en',
        'Falkland Islands': 'en',
        'British Indian Ocean Territory': 'en',
        'Cayman Islands': 'en',
        'Turks and Caicos Islands': 'en',
        'British Virgin Islands': 'en',
        'Anguilla': 'en',
        'Montserrat': 'en',
        'Bermuda': 'en',
        'Gibraltar': 'en',
        'Saint Helena': 'en',
        'Ascension Island': 'en',
        'Tristan da Cunha': 'en',
        'Akrotiri and Dhekelia': 'en',
        'Svalbard and Jan Mayen': 'en',
        'Bouvet Island': 'en',
        'French Southern Territories': 'en',
        'Antarctica': 'en',
        'United States Minor Outlying Islands': 'en',
        'Midway Islands': 'en',
        'Wake Island': 'en',
        'Johnston Atoll': 'en',
        'Kingman Reef': 'en',
        'Palmyra Atoll': 'en',
        'Baker Island': 'en',
        'Howland Island': 'en',
        'Jarvis Island': 'en',
        'Navassa Island': 'en',
        'Bajo Nuevo Bank': 'en',
        'Serranilla Bank': 'en',
        'Clipperton Island': 'en',
        'Ashmore and Cartier Islands': 'en',
        'Coral Sea Islands': 'en',
        'Norfolk Island': 'en',
        'Christmas Island': 'en',
        'Cocos Islands': 'en',
        'Heard Island and McDonald Islands': 'en',
        'Australian Antarctic Territory': 'en',
        'Ross Dependency': 'en',
        'Peter I Island': 'en',
        'Queen Maud Land': 'en',
        'Adélie Land': 'en',
        'British Antarctic Territory': 'en',
        'Chilean Antarctic Territory': 'en',
        'Argentine Antarctica': 'en',
        'Australian Antarctic Territory': 'en',
        'Norwegian Antarctic Territory': 'en',
        'French Southern and Antarctic Lands': 'en',
        'South African Antarctic Territory': 'en',
        'New Zealand Antarctic Territory': 'en',
        'Unclaimed Antarctic Territory': 'en'
      };

      // Определяем язык по стране
      const countryLanguage = countryLanguageMap[countryData.country] || 'en';
      
      // Приоритет: язык браузера > язык по стране > английский
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
      return {
        language: 'en',
        country: 'Unknown',
        countryCode: 'US',
        browserLanguage: 'en',
        timezone: 'UTC'
      };
    }
  }

  // Проверка поддержки геолокации
  isGeolocationSupported() {
    return 'geolocation' in navigator;
  }

  // Получение точных координат (если пользователь разрешит)
  async getCurrentPosition() {
    if (!this.isGeolocationSupported()) {
      throw new Error('Geolocation is not supported');
    }

    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000 // 5 минут
        }
      );
    });
  }
}

export default new GeolocationService(); 