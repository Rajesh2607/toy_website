import { useState, useEffect } from 'react';

export const useNotification = () => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'info', duration = 4000) => {
    setNotification({ message, type, duration });
  };

  const hideNotification = () => {
    setNotification(null);
  };

  useEffect(() => {
    if (notification && notification.duration > 0) {
      const timer = setTimeout(() => {
        hideNotification();
      }, notification.duration);

      return () => clearTimeout(timer);
    }
  }, [notification]);

  return {
    notification,
    showNotification,
    hideNotification
  };
};

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const getStyles = () => {
    const baseStyles = 'fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 max-w-sm';
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-white`;
      default:
        return `${baseStyles} bg-blue-500 text-white`;
    }
  };

  return (
    <div className={getStyles()}>
      <div className="flex items-center justify-between">
        <span className="text-sm">{notification.message}</span>
        <button
          onClick={onClose}
          className="ml-3 text-white hover:text-gray-200"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default Notification;
