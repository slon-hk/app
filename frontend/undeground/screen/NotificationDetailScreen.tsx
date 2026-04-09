import React, { useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useNotifications } from '../context/NotificationContext';

export default function NotificationDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { id } = route.params;
  
  const { getNotificationById, markAsRead, deleteNotification } = useNotifications();
  const notif = getNotificationById(id);

  // Помечаем как прочитанное при открытии экрана
  useEffect(() => {
    if (notif && !notif.isRead) {
      markAsRead(id);
    }
  }, [id]);

  if (!notif) return null; // Если удалили и перешли

  const handleDelete = () => {
    deleteNotification(id);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={32} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.bigIconContainer, { borderColor: notif.color }]}>
          <Ionicons name={notif.icon as any} size={64} color={notif.color} />
        </View>

        <Text style={styles.time}>{notif.time}</Text>
        <Text style={styles.title}>{notif.title}</Text>
        
        <View style={styles.divider} />
        
        <Text style={styles.message}>{notif.message}</Text>
      </View>

      {/* FOOTER BUTTONS */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete} activeOpacity={0.8}>
          <Ionicons name="trash-outline" size={20} color="#ff3333" />
          <Text style={styles.deleteText}>DELETE MESSAGE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  header: { paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingHorizontal: 24, paddingBottom: 20 },
  content: { flex: 1, paddingHorizontal: 24, alignItems: 'center', paddingTop: 20 },
  
  bigIconContainer: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: '#111111', marginBottom: 24 },
  time: { color: '#757575', fontSize: 12, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 8 },
  title: { color: '#ffffff', fontSize: 28, fontWeight: '900', letterSpacing: -0.5, textAlign: 'center', textTransform: 'uppercase' },
  divider: { width: 40, height: 2, backgroundColor: '#D1FF00', marginVertical: 24 },
  message: { color: '#ababab', fontSize: 16, lineHeight: 26, textAlign: 'center' },

  footer: { padding: 32, paddingBottom: Platform.OS === 'ios' ? 50 : 32 },
  deleteButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#191919', paddingVertical: 18, borderRadius: 30, borderWidth: 1, borderColor: '#331111' },
  deleteText: { color: '#ff3333', fontSize: 14, fontWeight: '900', letterSpacing: 1, marginLeft: 8 }
});