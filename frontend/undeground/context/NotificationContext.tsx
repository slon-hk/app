import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface AppNotification {
  id: string;
  type: 'order' | 'forum' | 'drop' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  icon: string;
  color: string;
}

// Стартовые моковые данные
const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: 'notif_1', type: 'order', title: 'ORDER SHIPPED', message: 'Твой заказ #GRV-042 с CYBER_STORM.WAV передан в доставку.', time: '10 MIN AGO', isRead: false, icon: 'cube-outline', color: '#D1FF00' },
  { id: 'notif_2', type: 'forum', title: 'NEW REPLY', message: 'VinylJunkie ответил(а) в твоем треде "Best needles for scratching..."', time: '2 HOURS AGO', isRead: false, icon: 'chatbubbles-outline', color: '#FF51FA' },
  { id: 'notif_3', type: 'drop', title: 'SECRET DROP UNLOCKED', message: 'Открыт доступ к скрытому тиражу японского пресса.', time: '1 DAY AGO', isRead: true, icon: 'skull-outline', color: '#00FFFF' },
];

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  getNotificationById: (id: string) => AppNotification | undefined;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const getNotificationById = (id: string) => {
    return notifications.find(n => n.id === id);
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, clearAll, getNotificationById }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
};