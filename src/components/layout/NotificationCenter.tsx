import React, { useState } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import { format, formatDistanceToNow } from 'date-fns';

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    clearNotifications 
  } = useNotifications();

  const toggleNotifications = () => setIsOpen(!isOpen);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <div className="rounded-full bg-green-100 p-2 text-green-500"><Check className="h-4 w-4" /></div>;
      case 'warning':
        return <div className="rounded-full bg-yellow-100 p-2 text-yellow-500"><Bell className="h-4 w-4" /></div>;
      case 'error':
        return <div className="rounded-full bg-red-100 p-2 text-red-500"><X className="h-4 w-4" /></div>;
      default:
        return <div className="rounded-full bg-blue-100 p-2 text-blue-500"><Bell className="h-4 w-4" /></div>;
    }
  };

  const formatTime = (createdAt: string) => {
    const date = new Date(createdAt);
    const now = new Date();
    
    // If less than 24 hours ago
    if (now.getTime() - date.getTime() < 24 * 60 * 60 * 1000) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    return format(date, 'MMM d, yyyy');
  };

  return (
    <>
      {/* Notification button */}
      <button
        onClick={toggleNotifications}
        className="fixed bottom-4 right-4 bg-white p-3 rounded-full shadow-lg z-20 hover:bg-gray-50 transition-colors duration-200"
        aria-label={`Open notifications (${unreadCount} unread)`}
      >
        <Bell className="h-6 w-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification panel */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed bottom-16 right-4 sm:right-6 w-80 sm:w-96 max-h-[70vh] bg-white rounded-lg shadow-xl z-40 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-lg">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close notifications"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                <ul className="divide-y">
                  {notifications.map((notification) => (
                    <li 
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex">
                        <div className="mr-3 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <h4 className="font-medium text-gray-900">{notification.title}</h4>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="p-3 border-t text-center">
                <button
                  onClick={clearNotifications}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Clear all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default NotificationCenter;