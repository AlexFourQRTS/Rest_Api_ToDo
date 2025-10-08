import React, { useEffect } from 'react';
// Removed CSS module import

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border max-w-sm flex items-center ${
      type === 'success' ? 'bg-green-900/90 border-green-500 text-green-100' :
      type === 'error' ? 'bg-red-900/90 border-red-500 text-red-100' :
      type === 'warning' ? 'bg-yellow-900/90 border-yellow-500 text-yellow-100' :
      'bg-blue-900/90 border-blue-500 text-blue-100'
    }`}>
      <div className="flex items-center space-x-2">
        {type === 'success' && <span className="text-green-400">✓</span>}
        {type === 'error' && <span className="text-red-400">✕</span>}
        {type === 'info' && <span className="text-blue-400">ℹ</span>}
        {type === 'warning' && <span className="text-yellow-400">⚠</span>}
        <span className="text-sm font-medium">{message}</span>
      </div>
      <button 
        className="ml-3 text-lg hover:opacity-70 transition-opacity" 
        onClick={onClose}
      >
        ×
      </button>
    </div>
  );
};

export default Toast; 