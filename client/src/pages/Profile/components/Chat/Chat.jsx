import React, { useState, useEffect, useRef } from 'react';
import styles from './Chat.module.css';
import { FaPaperPlane, FaUser, FaEllipsisV } from 'react-icons/fa';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Мокові дані для прикладу
  const mockMessages = [
    {
      id: 1,
      sender: 'user',
      text: 'Привіт! Як справи?',
      timestamp: '10:30',
    },
    {
      id: 2,
      sender: 'other',
      text: 'Привіт! Все добре, дякую! А у тебе?',
      timestamp: '10:31',
    },
    {
      id: 3,
      sender: 'user',
      text: 'Теж добре! Що нового?',
      timestamp: '10:32',
    },
  ];

  useEffect(() => {
    // Імітація завантаження повідомлень
    setMessages(mockMessages);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      id: messages.length + 1,
      sender: 'user',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Імітація відповіді
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: 'other',
        text: 'Це автоматична відповідь. Реальний чат буде додано пізніше.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatHeader}>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>
            <FaUser />
          </div>
          <div className={styles.userDetails}>
            <h3>Чат підтримки</h3>
            <span className={styles.status}>Онлайн</span>
          </div>
        </div>
        <button className={styles.menuButton}>
          <FaEllipsisV />
        </button>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${
              message.sender === 'user' ? styles.userMessage : styles.otherMessage
            }`}
          >
            <div className={styles.messageContent}>
              <p>{message.text}</p>
              <span className={styles.timestamp}>{message.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputContainer} onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Введіть повідомлення..."
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default Chat; 