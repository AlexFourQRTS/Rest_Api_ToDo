import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { RefreshCw, Download, Share2 } from "lucide-react";
import styles from "./IP.module.css";
import Hero from "../../../components/UI/Hero/Hero";
import IPInfo from "../../../components/IPInfo/IPInfo";
import BrowserInfo from "../../../components/BrowserInfo/BrowserInfo";
import PerformanceInfo from "../../../components/PerformanceInfo/PerformanceInfo";
import WebAPIInfo from "../../../components/WebAPIInfo/WebAPIInfo";
import browserInfoService from "../../../utils/browserInfo";


const IP = () => {
  const [ipData, setIpData] = useState(null);
  const [browserData, setBrowserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  // Получение данных об IP
  const fetchIPData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Получаем данные об IP через API
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Не удалось получить данные об IP');
      }

      const data = await response.json();
      
      // Добавляем флаг страны
      const countryFlags = {
        'Ukraine': '🇺🇦',
        'Russia': '🇷🇺',
        'United States': '🇺🇸',
        'Germany': '🇩🇪',
        'France': '🇫🇷',
        'United Kingdom': '🇬🇧',
        'Canada': '🇨🇦',
        'Australia': '🇦🇺',
        'Japan': '🇯🇵',
        'China': '🇨🇳',
        'India': '🇮🇳',
        'Brazil': '🇧🇷',
        'Mexico': '🇲🇽',
        'Spain': '🇪🇸',
        'Italy': '🇮🇹',
        'Netherlands': '🇳🇱',
        'Sweden': '🇸🇪',
        'Norway': '🇳🇴',
        'Denmark': '🇩🇰',
        'Finland': '🇫🇮',
        'Poland': '🇵🇱',
        'Czech Republic': '🇨🇿',
        'Austria': '🇦🇹',
        'Switzerland': '🇨🇭',
        'Belgium': '🇧🇪',
        'Ireland': '🇮🇪',
        'Portugal': '🇵🇹',
        'Greece': '🇬🇷',
        'Hungary': '🇭🇺',
        'Romania': '🇷🇴',
        'Bulgaria': '🇧🇬',
        'Croatia': '🇭🇷',
        'Slovenia': '🇸🇮',
        'Slovakia': '🇸🇰',
        'Lithuania': '🇱🇹',
        'Latvia': '🇱🇻',
        'Estonia': '🇪🇪',
        'Belarus': '🇧🇾',
        'Moldova': '🇲🇩',
        'Georgia': '🇬🇪',
        'Armenia': '🇦🇲',
        'Azerbaijan': '🇦🇿',
        'Kazakhstan': '🇰🇿',
        'Uzbekistan': '🇺🇿',
        'Kyrgyzstan': '🇰🇬',
        'Tajikistan': '🇹🇯',
        'Turkmenistan': '🇹🇲',
        'Mongolia': '🇲🇳',
        'South Korea': '🇰🇷',
        'Vietnam': '🇻🇳',
        'Thailand': '🇹🇭',
        'Malaysia': '🇲🇾',
        'Singapore': '🇸🇬',
        'Indonesia': '🇮🇩',
        'Philippines': '🇵🇭',
        'New Zealand': '🇳🇿',
        'South Africa': '🇿🇦',
        'Egypt': '🇪🇬',
        'Morocco': '🇲🇦',
        'Algeria': '🇩🇿',
        'Tunisia': '🇹🇳',
        'Libya': '🇱🇾',
        'Sudan': '🇸🇩',
        'Ethiopia': '🇪🇹',
        'Kenya': '🇰🇪',
        'Uganda': '🇺🇬',
        'Tanzania': '🇹🇿',
        'Ghana': '🇬🇭',
        'Nigeria': '🇳🇬',
        'Cameroon': '🇨🇲',
        'Chad': '🇹🇩',
        'Niger': '🇳🇪',
        'Mali': '🇲🇱',
        'Burkina Faso': '🇧🇫',
        'Senegal': '🇸🇳',
        'Guinea': '🇬🇳',
        'Ivory Coast': '🇨🇮',
        'Togo': '🇹🇬',
        'Benin': '🇧🇯',
        'Central African Republic': '🇨🇫',
        'Congo': '🇨🇬',
        'Democratic Republic of the Congo': '🇨🇩',
        'Gabon': '🇬🇦',
        'Equatorial Guinea': '🇬🇶',
        'Sao Tome and Principe': '🇸🇹',
        'Angola': '🇦🇴',
        'Zambia': '🇿🇲',
        'Zimbabwe': '🇿🇼',
        'Botswana': '🇧🇼',
        'Namibia': '🇳🇦',
        'Lesotho': '🇱🇸',
        'Eswatini': '🇸🇿',
        'Madagascar': '🇲🇬',
        'Mauritius': '🇲🇺',
        'Seychelles': '🇸🇨',
        'Comoros': '🇰🇲',
        'Djibouti': '🇩🇯',
        'Somalia': '🇸🇴',
        'Eritrea': '🇪🇷',
        'Burundi': '🇧🇮',
        'Rwanda': '🇷🇼',
        'Haiti': '🇭🇹',
        'Dominican Republic': '🇩🇴',
        'Jamaica': '🇯🇲',
        'Trinidad and Tobago': '🇹🇹',
        'Barbados': '🇧🇧',
        'Bahamas': '🇧🇸',
        'Guyana': '🇬🇾',
        'Suriname': '🇸🇷',
        'French Guiana': '🇬🇫',
        'Uruguay': '🇺🇾',
        'Paraguay': '🇵🇾',
        'Bolivia': '🇧🇴',
        'Ecuador': '🇪🇨',
        'Peru': '🇵🇪',
        'Chile': '🇨🇱',
        'Argentina': '🇦🇷',
        'Venezuela': '🇻🇪',
        'Colombia': '🇨🇴',
        'Panama': '🇵🇦',
        'Costa Rica': '🇨🇷',
        'Nicaragua': '🇳🇮',
        'Honduras': '🇭🇳',
        'El Salvador': '🇸🇻',
        'Guatemala': '🇬🇹',
        'Belize': '🇧🇿',
        'Cuba': '🇨🇺',
        'Puerto Rico': '🇵🇷',
        'Dominica': '🇩🇲',
        'Saint Lucia': '🇱🇨',
        'Saint Vincent and the Grenadines': '🇻🇨',
        'Grenada': '🇬🇩',
        'Antigua and Barbuda': '🇦🇬',
        'Saint Kitts and Nevis': '🇰🇳',
        'Israel': '🇮🇱',
        'Lebanon': '🇱🇧',
        'Syria': '🇸🇾',
        'Jordan': '🇯🇴',
        'Iraq': '🇮🇶',
        'Iran': '🇮🇷',
        'Afghanistan': '🇦🇫',
        'Pakistan': '🇵🇰',
        'Bangladesh': '🇧🇩',
        'Sri Lanka': '🇱🇰',
        'Maldives': '🇲🇻',
        'Nepal': '🇳🇵',
        'Bhutan': '🇧🇹',
        'Myanmar': '🇲🇲',
        'Laos': '🇱🇦',
        'Cambodia': '🇰🇭',
        'Brunei': '🇧🇳',
        'East Timor': '🇹🇱',
        'Papua New Guinea': '🇵🇬',
        'Fiji': '🇫🇯',
        'Solomon Islands': '🇸🇧',
        'Vanuatu': '🇻🇺',
        'New Caledonia': '🇳🇨',
        'Samoa': '🇼🇸',
        'Tonga': '🇹🇴',
        'Kiribati': '🇰🇮',
        'Tuvalu': '🇹🇻',
        'Nauru': '🇳🇷',
        'Palau': '🇵🇼',
        'Marshall Islands': '🇲🇭',
        'Micronesia': '🇫🇲',
        'Northern Mariana Islands': '🇲🇵',
        'Guam': '🇬🇺',
        'American Samoa': '🇦🇸',
        'Cook Islands': '🇨🇰',
        'Niue': '🇳🇺',
        'Tokelau': '🇹🇰',
        'Pitcairn Islands': '🇵🇳',
        'Norfolk Island': '🇳🇫',
        'Christmas Island': '🇨🇽',
        'Cocos Islands': '🇨🇨',
        'Heard Island and McDonald Islands': '🇭🇲',
        'Bouvet Island': '🇧🇻',
        'South Georgia and the South Sandwich Islands': '🇬🇸',
        'Falkland Islands': '🇫🇰',
        'British Indian Ocean Territory': '🇮🇴',
        'Cayman Islands': '🇰🇾',
        'Turks and Caicos Islands': '🇹🇨',
        'British Virgin Islands': '🇻🇬',
        'Anguilla': '🇦🇮',
        'Montserrat': '🇲🇸',
        'Bermuda': '🇧🇲',
        'Gibraltar': '🇬🇮',
        'Saint Helena': '🇸🇭',
        'Ascension Island': '🇦🇨',
        'Tristan da Cunha': '🇹🇦',
        'Akrotiri and Dhekelia': '🇦🇶',
        'Svalbard and Jan Mayen': '🇸🇯',
        'French Southern Territories': '🇹🇫',
        'Antarctica': '🇦🇶',
        'United States Minor Outlying Islands': '🇺🇲',
        'Midway Islands': '🇺🇲',
        'Wake Island': '🇺🇲',
        'Johnston Atoll': '🇺🇲',
        'Kingman Reef': '🇺🇲',
        'Palmyra Atoll': '🇺🇲',
        'Baker Island': '🇺🇲',
        'Howland Island': '🇺🇲',
        'Jarvis Island': '🇺🇲',
        'Navassa Island': '🇺🇲',
        'Bajo Nuevo Bank': '🇺🇲',
        'Serranilla Bank': '🇺🇲',
        'Clipperton Island': '🇨🇵',
        'Ashmore and Cartier Islands': '🇦🇺',
        'Coral Sea Islands': '🇦🇺',
        'Australian Antarctic Territory': '🇦🇶',
        'Ross Dependency': '🇳🇿',
        'Peter I Island': '🇳🇴',
        'Queen Maud Land': '🇳🇴',
        'Adélie Land': '🇫🇷',
        'British Antarctic Territory': '🇬🇧',
        'Chilean Antarctic Territory': '🇨🇱',
        'Argentine Antarctica': '🇦🇷',
        'Norwegian Antarctic Territory': '🇳🇴',
        'French Southern and Antarctic Lands': '🇫🇷',
        'South African Antarctic Territory': '🇿🇦',
        'New Zealand Antarctic Territory': '🇳🇿',
        'Unclaimed Antarctic Territory': '🇦🇶'
      };

      const enrichedData = {
        ...data,
        countryFlag: countryFlags[data.country_name] || '🌐'
      };

      setIpData(enrichedData);
      setLastUpdate(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Получение данных о браузере
  const fetchBrowserData = () => {
    const data = browserInfoService.getAllInfo();
    setBrowserData(data);
  };

  // Обновление всех данных
  const refreshData = () => {
    fetchIPData();
    fetchBrowserData();
  };

  // Экспорт данных
  const exportData = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      ip: ipData,
      browser: browserData
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ip-browser-info-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Поделиться данными
  const shareData = async () => {
    const shareText = `Мой IP: ${ipData?.ip}\nСтрана: ${ipData?.country_name} ${ipData?.countryFlag}\nГород: ${ipData?.city}\nБраузер: ${browserData?.browser.name} ${browserData?.browser.version}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Информация о моем IP',
          text: shareText,
          url: window.location.href
        });
      } catch (err) {
        console.log('Ошибка при попытке поделиться:', err);
      }
    } else {
      // Fallback для браузеров без поддержки Web Share API
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Информация скопирована в буфер обмена!');
      } catch (err) {
        console.log('Ошибка при копировании:', err);
      }
    }
  };

  useEffect(() => {
    fetchIPData();
    fetchBrowserData();
  }, []);

  return (
    <div className={styles.ip}>
      <motion.section
        className={styles.intro}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        <Hero 
          title="Ваш IP адрес" 
          subtitle="Подробная информация о вашем IP адресе, геолокации и браузере" 
        />
      </motion.section>
      
      <motion.section
        className={styles.content}
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Кнопки управления */}
        <div className={styles.controls}>
          <button 
            className={styles.controlButton}
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw size={16} />
            Обновить
          </button>
          <button 
            className={styles.controlButton}
            onClick={exportData}
            disabled={!ipData || !browserData}
          >
            <Download size={16} />
            Экспорт
          </button>
          <button 
            className={styles.controlButton}
            onClick={shareData}
            disabled={!ipData || !browserData}
          >
            <Share2 size={16} />
            Поделиться
          </button>
        </div>

        {/* Время последнего обновления */}
        {lastUpdate && (
          <div className={styles.lastUpdate}>
            Последнее обновление: {lastUpdate.toLocaleString('ru-RU')}
          </div>
        )}

        {/* Информация об IP */}
        <IPInfo 
          ipData={ipData} 
          isLoading={isLoading} 
          error={error} 
        />

        {/* Информация о браузере */}
        {browserData && (
          <BrowserInfo 
            browserInfo={browserData.browser}
            systemInfo={browserData.system}
            connectionInfo={browserData.connection}
          />
        )}

        {/* Информация о производительности */}
        {browserData && (
          <PerformanceInfo 
            performanceInfo={browserData.performance}
          />
        )}



        {/* Web APIs */}
        {browserData && (
          <WebAPIInfo 
            webAPIInfo={browserData.webAPIs}
            mediaInfo={browserData.media}
            storageInfo={browserData.storage}
            securityInfo={browserData.security}
            sensorsInfo={browserData.sensors}
          />
        )}

        {/* Советы по безопасности */}
       
      </motion.section>
    </div>
  );
};

export default IP; 