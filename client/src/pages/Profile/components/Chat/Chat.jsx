import React, { useState, useEffect, useRef } from 'react';
// Removed CSS module import
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
    <div className="h-full flex flex-col">
      <div className="bg-gray-800/50 p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-slate-600 rounded-full flex items-center justify-center">
            <FaUser className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Чат підтримки</h3>
            <span className="text-gray-300 text-sm">Онлайн</span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-white p-2">
          <FaEllipsisV />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              message.sender === 'user' 
                ? 'bg-slate-600 text-white' 
                : 'bg-gray-700 text-white'
            }`}>
              <p className="text-sm">{message.text}</p>
              <span className="text-xs opacity-70 mt-1 block">{message.timestamp}</span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="bg-gray-800/50 p-4 border-t border-gray-700" onSubmit={handleSendMessage}>
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Введіть повідомлення..."
            className="flex-1 input-field"
          />
          <button type="submit" className="btn-primary p-3">
            <FaPaperPlane />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 