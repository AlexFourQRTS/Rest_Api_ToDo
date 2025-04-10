// FooterPage.js
import React from "react";
import "../../style.css";
import { FaPhone, FaEnvelope, FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const FooterPage = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h4>Контактная информация</h4>
          <p><FaPhone /> +38 (099) 123-45-67</p>
          <p><FaEnvelope /> xvergox@gmail.com</p>
          <p>Одесса, Украина</p>
        </div>
        <div className="footer-section">
          <h4>Социальные сети</h4>
          <div className="social-links">
            <a href="#" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
          </div>
        </div>
        <div className="footer-section">
          <h4>Информация</h4>
          <ul>
            <li><a href="#">О нас</a></li>
            <li><a href="#">Условия использования</a></li>
            <li><a href="#">Политика конфиденциальности</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Подпишитесь на новости</h4>
          <form>
            <input type="email" placeholder="Ваш e-mail" />
            <button type="submit" >Подписаться</button>
          </form>
        </div>
      </div>
      <div className="footer-bottom">
        <p>  Skydishch.fun  </p>
        <p>&copy; {new Date().getFullYear()} Все права защищены.</p>
      </div>
    </footer>
  );
};

export default FooterPage;