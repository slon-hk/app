import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Swipeable } from 'react-native-gesture-handler';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const { notifications, deleteNotification, clearAll } = useNotifications();

  // Функция, которая рисует красную кнопку "Удалить" под свайпом
  const renderRightActions = (id: string) => {
    return (
      <TouchableOpacity 
        style={styles.deleteSwipeAction}
        onPress={() => deleteNotification(id)}
        activeOpacity={0.8}
      >
        <Ionicons name="trash-outline" size={24} color="#ffffff" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ACTIVITY</Text>
        <TouchableOpacity onPress={clearAll} style={styles.clearAllButton}>
          <Text style={styles.clearAllText}>CLEAR</Text>
        </TouchableOpacity>
      </View>

      {/* СПИСОК УВЕДОМЛЕНИЙ */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <Swipeable 
              key={notif.id} 
              renderRightActions={() => renderRightActions(notif.id)}
              overshootRight={false}
            >
              <TouchableOpacity 
                style={[styles.notificationCard, !notif.isRead && styles.notificationCardUnread]}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('NotificationDetail', { id: notif.id })}
              >
                {/* Иконка типа уведомления */}
                <View style={[styles.iconContainer, { borderColor: notif.color }]}>
                  <Ionicons name={notif.icon as any} size={24} color={notif.color} />
                </View>

                {/* Текст */}
                <View style={styles.textContainer}>
                  <View style={styles.titleRow}>
                    <Text style={styles.title}>{notif.title}</Text>
                    <Text style={styles.time}>{notif.time}</Text>
                  </View>
                  {/* Ограничиваем текст в 1 строку, чтобы карточки были одинакового размера */}
                  <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
                    {notif.message}
                  </Text>
                </View>

                {/* Индикатор непрочитанного */}
                {!notif.isRead && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            </Swipeable>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#191919" />
            <Text style={styles.emptyText}>NO NEW ACTIVITY</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#191919',
  },
  backButton: {
    width: 60,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 2,
  },
  clearAllButton: {
    width: 60,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  clearAllText: {
    color: '#FF51FA',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#191919',
  },
  notificationCardUnread: {
    backgroundColor: '#1a1a1a',
    borderColor: '#262626',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  time: {
    color: '#757575',
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  message: {
    color: '#ababab',
    fontSize: 12,
    lineHeight: 18,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#D1FF00',
    marginLeft: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyText: {
    color: '#262626',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 16,
    letterSpacing: 1,
  },
  
  // Стили для красной кнопки свайпа
  deleteSwipeAction: {
    backgroundColor: '#ff3333',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: 16,
    marginBottom: 12,
    marginLeft: 12,
  }
});