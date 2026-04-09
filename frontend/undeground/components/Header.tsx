import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';

interface HeaderProps {
  isAuthenticated?: boolean;
  onMenuPress?: () => void;
  onBagPress?: () => void;
  onTitlePress?: () => void;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export default function Header({ 
  isAuthenticated = false, 
  onMenuPress,
  onBagPress,
  onTitlePress,
  onNotificationPress,
  onProfilePress
}: HeaderProps) {
  
  const navigation = useNavigation<any>();

  const { getTotalItems } = useCart();
  const { unreadCount } = useNotifications();
  
  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      navigation.navigate('Profile');
    }
  };

  // ==========================================
  // ВАРИАНТ 1: ДЛЯ АВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ
  // ==========================================
  if (isAuthenticated) {
    return (
      <View style={styles.headerContainer}>
        {/* Левая часть: Профиль */}
        <TouchableOpacity 
          style={styles.profileContainer} 
          onPress={handleProfilePress}
          activeOpacity={0.7}
        >
          <View style={styles.avatarBorder}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=200&auto=format&fit=crop' }} 
              style={styles.profileImage} 
            />
          </View>
          <View style={styles.profileTextContainer}>
            <Text style={styles.welcomeText}>WELCOME BACK</Text>
            <Text style={styles.usernameText}>DIGGER_042</Text>
          </View>
        </TouchableOpacity>

        {/* Правая часть: Иконки (Уведомления + Корзина) */}
        <View style={styles.rightActions}>
          
          {/* Кнопка уведомлений со счетчиком */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Notifications')} 
            activeOpacity={0.7}
            style={styles.iconButton}
          >
            <Ionicons name="notifications-outline" size={28} color="#D1FF00" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Кнопка корзины со счетчиком */}
          <TouchableOpacity 
            onPress={() => navigation.navigate('Cart')} 
            activeOpacity={0.7} 
            style={styles.iconButton}
          >
            <MaterialIcons name="shopping-bag" size={28} color="#D1FF00" />
            {getTotalItems() > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.bottomBorder} />
      </View>
    );
  }

  // ==========================================
  // ВАРИАНТ 2: ДЛЯ НЕАВТОРИЗОВАННОГО ПОЛЬЗОВАТЕЛЯ
  // ==========================================
  return (
    <View style={styles.headerContainer}>
      {/* Меню слева */}
      <View style={styles.leftSection}>
        <TouchableOpacity onPress={onMenuPress} activeOpacity={0.7}>
          <MaterialIcons name="menu" size={28} color="#D1FF00" />
        </TouchableOpacity>
      </View>

      {/* Центрированный заголовок */}
      <TouchableOpacity onPress={onTitlePress} activeOpacity={0.7} style={styles.centerSection}>
        <Text style={styles.logoText}>LOCAL DIGS</Text>
      </TouchableOpacity>

      {/* Корзина справа */}
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={() => navigation.navigate('Cart')} activeOpacity={0.7} style={styles.iconButton}>
          <MaterialIcons name="shopping-bag" size={28} color="#D1FF00" />
          {getTotalItems() > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{getTotalItems()}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBorder} />
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 20,
    backgroundColor: 'rgba(14, 14, 14, 0.9)', 
    position: 'relative',
    zIndex: 50,
  },
  leftSection: { flexDirection: 'row', alignItems: 'center', zIndex: 10 },
  
  // Контейнер для иконок справа (уведомления + корзина)
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16, // Расстояние между колокольчиком и корзиной
    zIndex: 10,
  },
  rightSection: { flexDirection: 'row', alignItems: 'center', zIndex: 10 },
  
  centerSection: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center', zIndex: 1 },
  logoText: { fontSize: 28, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', letterSpacing: -1, color: '#D1FF00', textAlign: 'center', textShadowColor: '#FF51FA', textShadowOffset: { width: 4, height: 4 }, textShadowRadius: 0, paddingTop: Platform.OS === 'ios' ? 40 : 20 },
  
  profileContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarBorder: { borderWidth: 2, borderColor: '#cffc00', borderRadius: 25, padding: 2 },
  profileImage: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#262626' },
  profileTextContainer: { justifyContent: 'center' },
  welcomeText: { fontSize: 10, fontWeight: 'bold', color: '#757575', textTransform: 'uppercase', letterSpacing: 1.5 },
  usernameText: { fontSize: 16, fontWeight: '900', color: '#ffffff' },
  
  // Общий стиль для кнопок-иконок
  iconButton: { position: 'relative', justifyContent: 'center', alignItems: 'center' },
  
  // Бейдж Корзины (Желтый)
  cartBadge: { position: 'absolute', top: -6, right: -6, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: '#D1FF00', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  cartBadgeText: { color: '#000000', fontSize: 10, fontWeight: '900' },

  // Бейдж Уведомлений (Розовый)
  notificationBadge: { position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: '#FF51FA', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  notificationBadgeText: { color: '#ffffff', fontSize: 10, fontWeight: '900' },

  bottomBorder: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, backgroundColor: '#191919' }
});