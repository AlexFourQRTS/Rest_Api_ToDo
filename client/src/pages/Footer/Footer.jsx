import React from "react";
import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, GithubIcon } from "lucide-react";
import { FaLinkedin, FaTelegram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: GithubIcon, href: "https://github.com/AlexFourQRTS", label: "GitHub" },
    { icon: FaLinkedin, href: "https://www.linkedin.com/in/oleksandr-maliuk-620206225/", label: "LinkedIn" },
    { icon: FaTelegram, href: "https://t.me/BrahmaDzen", label: "Telegramm" }
  ];

  const quickLinks = [
    { name: "Головна", href: "/" },
    // { name: "Портфоліо", href: "/portfolio" },
    { name: "Обсуждение", href: "/chat" },
    { name: "Ігри", href: "/games" },
    // { name: "Навички", href: "/skills" },
    { name: "Блог", href: "/blog" },
    { name: "Файли", href: "/filecloud" },
    // { name: "Про нас", href: "/about" },
    // { name: "FAQ", href: "/faq" }
  ];

  // eslint-disable-next-line no-unused-vars
  const services = [
    // "Розробка",
    // "Консультації",
    // "Навчання"
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900/50 to-slate-900/50 text-white">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-600/10 via-purple-600/10 to-slate-600/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/80" />
      
      <div className="relative container-custom py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 lg:gap-12">
          {/* Company Info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
              <span className="gradient-text">DEV</span> Hub
            </h3>
            <p className="text-base sm:text-lg text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              Платформа для разработчиков с современными инструментами и возможностями.
            </p>
            <div className="flex space-x-4 sm:space-x-5">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="p-3 sm:p-4 bg-gradient-to-r from-slate-600/20 to-purple-600/20 hover:from-slate-600/40 hover:to-purple-600/40 rounded-lg group border border-slate-500/20 hover:border-slate-400/40"
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon size={18} className="text-gray-300 group-hover:text-gray-300" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">Навігація</h3>
            <ul className="space-y-3 sm:space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href} 
                    className="text-base sm:text-lg text-gray-400 hover:text-white block py-1 hover:translate-x-1 transition-transform"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-white">Контакти</h3>
            <div className="space-y-4 sm:space-y-5">
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Mail size={18} className="text-gray-300 flex-shrink-0" />
                <span className="text-base sm:text-lg text-gray-400 break-all hover:text-white">xvergox@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Phone size={18} className="text-gray-300 flex-shrink-0" />
                <span className="text-base sm:text-lg text-gray-400 hover:text-white">+380 95 469 96 56</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <Phone size={18} className="text-gray-300 flex-shrink-0" />
                <span className="text-base sm:text-lg text-gray-400 hover:text-white">+380 97 556 53 71</span>
              </div>
              <div className="flex items-center space-x-3 sm:space-x-4">
                <MapPin size={18} className="text-gray-300 flex-shrink-0" />
                <span className="text-base sm:text-lg text-gray-400 hover:text-white">Одесса, Україна</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-800 mt-12 sm:mt-16 pt-8 sm:pt-10">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm sm:text-base text-center sm:text-left">
              © {currentYear} <span className="text-white font-medium">Oleksandr Maliuk</span> Всі права захищені.
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8">
              <Link 
                to="/privacy" 
                className="text-gray-400 hover:text-white text-sm sm:text-base text-center hover:underline"
              >
                Політика конфіденційності
              </Link>
              <Link 
                to="/terms" 
                className="text-gray-400 hover:text-white text-sm sm:text-base text-center hover:underline"
              >
                Умови використання
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;