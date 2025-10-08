import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import LanguageSelector from "../LanguageSelector/LanguageSelector";
import { Menu, X, ChevronDown, User, Home, Users, Mail } from "lucide-react";
import { routes } from "../../routes";
import useLocalization from "../../hooks/useLocalization";
import { authApi } from "../../api";

const Navbar = ({ onMenuClick, isSidebarOpen }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isAboutDropdownOpen, setIsAboutDropdownOpen] = useState(false);
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const aboutDropdownRef = useRef(null);
  const toolsDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  
  // Используем хук локализации
  const { t, isInitialized } = useLocalization();

  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Removed feather icons dependency

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (aboutDropdownRef.current && !aboutDropdownRef.current.contains(event.target)) {
        setIsAboutDropdownOpen(false);
      }
      if (toolsDropdownRef.current && !toolsDropdownRef.current.contains(event.target)) {
        setIsToolsDropdownOpen(false);
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

  const toggleSidebar = () => {
    onMenuClick();
  };

  const toggleAboutDropdown = () => {
    setIsAboutDropdownOpen(!isAboutDropdownOpen);
    if (isToolsDropdownOpen) setIsToolsDropdownOpen(false);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
  };

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

  const NavLink = ({ to, label, icon: Icon }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        className={`nav-link ${isActive ? 'nav-link-active' : ''}`}
        onClick={() => {
          setIsAboutDropdownOpen(false);
          setIsToolsDropdownOpen(false);
          setIsProfileDropdownOpen(false);
        }}
      >
        {Icon && <Icon size={14} className="mr-1.5 sm:mr-2" />}
        <span className="mobile-text">{label}</span>
      </Link>
    );
  };

  // eslint-disable-next-line no-unused-vars
  const AboutDropdownMenu = () => {
    const dropdownItems = [
      { to: routes.about, label: t('aboutMeItems.about'), icon: "user" },
      { to: routes.portfolio, label: t('aboutMeItems.portfolio'), icon: "folder" },
      { to: routes.skills, label: t('aboutMeItems.skills'), icon: "code" },
      { to: routes.whyus, label: t('aboutMeItems.services'), icon: "briefcase" },
      { to: routes.news, label: t('aboutMeItems.news'), icon: "briefcase" }
    ];

    return (
      <div className="relative" ref={aboutDropdownRef}>
        <button 
          className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-gradient-to-r hover:from-slate-600/20 hover:to-purple-600/20"
          onClick={toggleAboutDropdown}
        >
          <span>{t('aboutMeDropdown')}</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isAboutDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isAboutDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 sm:w-56 bg-gray-800/90 backdrop-blur-md rounded-md shadow-xl border border-slate-500/30 py-1 z-50">
            {dropdownItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                onClick={() => {
                  setIsAboutDropdownOpen(false);
                  setIsToolsDropdownOpen(false);
                  setIsProfileDropdownOpen(false);
                }}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const ToolsDropdownMenu = () => {
    const dropdownItems = [
      { to: routes.camera, label: t('toolsItems.camera') },
      { to: routes.microphone, label: t('toolsItems.microphone') },
      { to: routes.ip, label: t('toolsItems.ip') },
      { to: routes.tone_generator, label: t('toolsItems.toneGenerator') },
    ];

    return (
      <div className="relative" ref={toolsDropdownRef}>
        <button 
          className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          onClick={toggleToolsDropdown}
        >
          <span>{t('toolsDropdown')}</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isToolsDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 sm:w-56 bg-gray-800 rounded-md shadow-lg border border-gray-700 py-1 z-50">
            {dropdownItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                onClick={() => {
                  setIsAboutDropdownOpen(false);
                  setIsToolsDropdownOpen(false);
                  setIsProfileDropdownOpen(false);
                }}
              >
                <span>{item.label}</span>
              </Link>
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
      <div className="relative" ref={profileDropdownRef}>
        <button 
          className="flex items-center space-x-1 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
          onClick={toggleProfileDropdown}
        >
          <span>{t('profile')}</span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
        </button>
        {isProfileDropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 sm:w-56 bg-gray-800 rounded-md shadow-lg border border-gray-700 py-1 z-50">
            {profileItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700"
                onClick={() => {
                  setIsAboutDropdownOpen(false);
                  setIsToolsDropdownOpen(false);
                  setIsProfileDropdownOpen(false);
                }}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };


  // Показываем загрузку пока локализация не инициализирована
  if (!isInitialized) {
    return (
      <>
        {/* Desktop loading navbar */}
        <nav className="hidden md:block bg-gradient-to-r from-gray-950 via-purple-950 to-purple-900 border-b border-slate-500/20 sticky top-0 z-40 backdrop-blur-md">
          <div className="container-custom">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="text-xl font-bold gradient-text">
                DEV Hub
              </Link>
            </div>
          </div>
        </nav>

        {/* Mobile loading navbar */}
        <nav className="md:hidden bg-gradient-to-r from-gray-950 via-purple-950 to-purple-900 border-b border-slate-500/20 sticky top-0 z-40 backdrop-blur-md">
          <div className="container-custom">
            <div className="flex items-center justify-between h-14">
              <Link to="/" className="text-lg font-bold gradient-text">
                DEV Hub
              </Link>
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
                aria-label="Toggle menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </nav>
      </>
    );
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block bg-gradient-to-r from-gray-950 via-purple-950 to-purple-900 border-b border-slate-500/20 sticky top-0 z-40 backdrop-blur-md">
        <div className="container-custom">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Brand */}
            <div className="flex items-center space-x-1 sm:space-x-2 flex-1 min-w-0">
              <Link to="/" className="mobile-text-xl font-bold gradient-text truncate">
                {t('brand')}
              </Link>
              <span className="mobile-text text-gray-400 desktop-only truncate">{t('subtitle')}</span>
            </div>

            {/* Desktop navigation */}
              <div className="flex items-center space-x-1 flex-shrink-0">
                <ToolsDropdownMenu />
                <ProfileDropdownMenu />
                <NavLink to={routes.chat} label={t('chat')} />
                <NavLink to={routes.games} label={t('games')} />
                <NavLink to={routes.blog} label={t('blog')} />
                <NavLink to={routes.filecloud} label={t('files')} />
                <LanguageSelector />
              </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <nav className="md:hidden bg-gradient-to-r from-gray-950 via-purple-950 to-purple-900 border-b border-slate-500/20 sticky top-0 z-40 backdrop-blur-md">
        <div className="container-custom">
          <div className="flex items-center justify-between h-14">
            {/* Brand */}
            <Link to="/" className="text-lg font-bold gradient-text">
              {t('brand')}
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
              aria-label="Toggle menu"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;