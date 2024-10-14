import React from 'react';
import { useNotifications } from '../contexts/NotificationContext';

const NotificationList: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Notificaciones</h3>
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-500 hover:text-blue-700"
        >
          Marcar todas como leídas
        </button>
      </div>
      {notifications.length === 0 ? (
        <p className="text-gray-500">No tienes notificaciones</p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-2 rounded ${
                notification.read ? 'bg-gray-100' : 'bg-blue-100'
              }`}
            >
              <p className="text-sm">{notification.content}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
                {!notification.read && (
                  <button
                    onClick={() => markAsRead(notification._id)}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    Marcar como leída
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;