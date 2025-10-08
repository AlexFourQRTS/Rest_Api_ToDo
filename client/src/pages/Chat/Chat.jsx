import React from 'react';
import { MessageCircle, Code, Coffee, Clock } from 'lucide-react';
// Removed CSS module import

const Chat = () => {
  return (
    <div className="min-h-screen">
      <div 
        className="section-padding text-center"
      >
        <h1 className="text-4xl font-bold text-white mb-4">💬 Беседка</h1>
        <p className="text-gray-400 text-lg">Система обмена сообщениями</p>
      </div>

      <div 
        className="container-custom py-8"
      >
        <div className="card-hover p-8 text-center max-w-2xl mx-auto">
          <div className="mb-6">
            <Code size={64} className="mx-auto text-gray-300" />
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-6">
            🚧 В разработке
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-4 text-left">
              <div className="bg-slate-600/20 p-3 rounded-lg">
                <MessageCircle size={24} className="text-gray-300" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Обмен сообщениями</h3>
                <p className="text-gray-400">Мгновенная отправка и получение сообщений</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat; 