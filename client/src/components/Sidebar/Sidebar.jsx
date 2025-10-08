import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { routes } from "../../routes";
import { ChevronDown, Camera, Mic, Globe, BarChart2, MessageCircle, Play, BookOpen, Cloud, User, Wrench, Home, Users, Mail } from "lucide-react";
import { authApi } from "../../api";
import useLocalization from "../../hooks/useLocalization";
import useLanguage from "../../hooks/useLanguage";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { t } = useLocalization();
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const sidebarRef = useRef(null);
  const aboutDropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);



  const toggleToolsDropdown = () => {
    setIsToolsDropdownOpen(!isToolsDropdownOpen);
    if (isAboutDropdownOpen) setIsAboutDropdownOpen(false);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isAboutDropdownOpen) setIsAboutDropdownOpen(false);
    if (isToolsDropdownOpen) setIsToolsDropdownOpen(false);
  };

  // Получаем данные пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await authApi.getProfile();
        setUserData(data);
      } catch (error) {
        // Пользователь не авторизован
        setUserData(null);
      }
    };

    fetchUserData();
  }, []);

  // Removed feather icons dependency

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target)) {
        setIsAboutDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
        setIsToolsDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setIsAboutDropdownOpen(false);
    setIsToolsDropdownOpen(false);
    setIsProfileDropdownOpen(false);
  }, [location.pathname]);

  const SidebarLink = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-600/20 hover:to-purple-600/20 rounded-lg mx-2 ${
          isActive ? 'bg-gradient-to-r from-slate-600/20 to-purple-600/20 text-white border border-slate-500/30' : ''
        }`}
        onClick={onClose}
      >
        {Icon && <Icon size={18} />}
        <span>{label}</span>
      </Link>
    );
  };



  const ToolsDropdownMenu = () => {
    const dropdownItems = [
      { to: routes.camera, label: t('toolsItems.camera'), icon: Camera },
      { to: routes.microphone, label: t('toolsItems.microphone'), icon: Mic },
      { to: routes.ip, label: t('toolsItems.ip'), icon: Globe },
      { to: routes.tone_generator, label: t('toolsItems.toneGenerator'), icon: BarChart2 },
    ];

    return (
      <div className="mb-2" ref={toolsDropdownRef}>
        <button 
          className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-600/20 hover:to-purple-600/20 rounded-lg mx-2"
          onClick={toggleToolsDropdown}
        >
          <div className="flex items-center space-x-3">
            <Wrench size={18} />
            <span>{t('toolsDropdown')}</span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isToolsDropdownOpen && (
          <div className="ml-4 mt-2 space-y-1">
            {dropdownItems.map((item) => (
              <SidebarLink
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const ProfileDropdownMenu = () => {
    const profileItems = [
      { to: `${routes.profile}?tab=overview`, label: t('profileItems.overview'), icon: Home },
      { to: `${routes.profile}?tab=messages`, label: t('profileItems.messages'), icon: Mail },
      { to: `${routes.profile}?tab=friends`, label: t('profileItems.friends'), icon: Users },
    ];

    // Добавляем админ-панель если пользователь админ
    if (userData && userData.role === 'admin') {
      profileItems.push({ to: `${routes.profile}?tab=admin`, label: t('profileItems.admin'), icon: User });
    }

    return (
      <div className="mb-2" ref={profileDropdownRef}>
        <button 
          className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-600/20 hover:to-purple-600/20 rounded-lg mx-2"
          onClick={toggleProfileDropdown}
        >
          <div className="flex items-center space-x-3">
            <User size={18} />
            <span>{t('profile')}</span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isProfileDropdownOpen && (
          <div className="ml-4 mt-2 space-y-1">
            {profileItems.map((item) => (
              <SidebarLink
                key={item.to}
                to={item.to}
                label={item.label}
                icon={item.icon}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const mainNavLinks = [
    { to: routes.chat, label: t('chat'), icon: MessageCircle },
    { to: routes.games, label: t('games'), icon: Play },
    { to: routes.blog, label: t('blog'), icon: BookOpen },
    { to: routes.filecloud, label: t('files'), icon: Cloud },
  ];

  // Специальный компонент для мобильной версии
  const MobileLanguageSelector = () => {
    const { currentLanguage, setLanguage, supportedLanguages } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLanguageSelect = (languageCode) => {
      setLanguage(languageCode);
      setIsOpen(false);
    };

    const currentLangData = supportedLanguages.find(lang => lang.code === currentLanguage);

    // Закрытие дропдауна при клике вне его
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <div className="relative" ref={dropdownRef}>
        <button
          className="flex items-center justify-between w-full px-3 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white hover:bg-gray-700/50 transition-all"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center space-x-2">
            <span className="text-lg">{currentLangData?.flag || '🌐'}</span>
            <span className="text-sm font-medium">{currentLangData?.name || 'Language'}</span>
          </div>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-1 z-50">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                className={`w-full flex items-center space-x-2 px-3 py-2 text-sm text-left hover:bg-gray-700 transition-colors ${
                  currentLanguage === lang.code ? 'bg-gray-700 text-white' : 'text-gray-300'
                }`}
                onClick={() => handleLanguageSelect(lang.code)}
              >
                <span className="text-lg">{lang.flag}</span>
                <span>{lang.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <aside 
      ref={sidebarRef} 
      className={`fixed top-0 left-0 h-full w-72 bg-gray-900/95 backdrop-blur-md border-r border-slate-500/20 z-30 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:hidden`}
    >
      <nav className="p-4 pt-20 flex flex-col h-full">
        <div className="space-y-2 flex-1">
          <ToolsDropdownMenu />
          <ProfileDropdownMenu />
          {mainNavLinks.map((link, index) => (
            <SidebarLink key={index} to={link.to} label={link.label} icon={link.icon} />
          ))}
          
          {/* Language Selector in main list */}
          <div className="px-2 py-1">
            <MobileLanguageSelector />
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
