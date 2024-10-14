import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications();

  return (
    <div className="relative">
      <Bell className="w-6 h-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationBell;