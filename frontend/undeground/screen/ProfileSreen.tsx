import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import DiscountCard from '../components/DiscountCard';
import ProfileMenuButton from '../components/ProfileMenuButton';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      
      {/* Кастомный верхний бар */}
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>USER_SYSTEM</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        
        {/* 1. ШАПКА ПРОФИЛЯ */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=400&auto=format&fit=crop' }} 
              style={styles.avatar} 
            />
          </View>
          
          <Text style={styles.username}>DIGGER_042</Text>
          <Text style={styles.joinDate}>MEMBER SINCE: OCT 2023</Text>
        </View>

        {/* 2. СКИДОЧНАЯ КАРТА */}
        <View style={styles.sectionContainer}>
          <DiscountCard 
            points={1250} 
            cardNumber="0420 8812 9941 0021" 
          />
        </View>

        {/* 3. НАВИГАЦИОННОЕ МЕНЮ (История, посты и т.д.) */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>ACTIVITY & RECORDS</Text>
          
          <ProfileMenuButton 
            title="PURCHASE HISTORY" 
            subtitle="VIEW PAST ORDERS & RECEIPTS"
            iconName="receipt-outline" 
            iconColor="#FF51FA" // Розовый
            onPress={() => console.log('Открываем покупки')} 
          />
          
          <ProfileMenuButton 
            title="POSTS & COMMENTS" 
            subtitle="YOUR FORUM CONTRIBUTIONS"
            iconName="chatbubbles-outline" 
            iconColor="#c1fffe" // Бирюзовый
            onPress={() => console.log('Открываем форум')} 
          />

          <ProfileMenuButton 
            title="ACTIVE PRE-ORDERS" 
            subtitle="TRACK UPCOMING DROPS"
            iconName="time-outline" 
            iconColor="#D1FF00" // Лаймовый
            onPress={() => console.log('Открываем предзаказы')} 
          />

          <ProfileMenuButton 
            title="WANTLIST" 
            subtitle="32 ITEMS SEEKING"
            iconName="disc-outline" 
            iconColor="#ffffff" 
            onPress={() => console.log('Открываем вишлист')} 
          />
        </View>

        {/* 4. НАСТРОЙКИ */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>SYSTEM PREFERENCES</Text>
          
          <ProfileMenuButton 
            title="ACCOUNT SETTINGS" 
            iconName="settings-outline" 
            iconColor="#757575" 
            onPress={() => console.log('Настройки')} 
          />
          
          <ProfileMenuButton 
            title="LOGOUT" 
            iconName="exit-outline" 
            iconColor="#ff4444" 
            onPress={() => console.log('Выход')} 
          />
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e',
  },
  scrollContent: {
    paddingBottom: 120, // Под нижнее меню
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: 'rgba(14, 14, 14, 0.9)',
    zIndex: 10,
  },
  topBarTitle: {
    color: '#D1FF00',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  
  profileHeader: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#cffc00',
  },
  username: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -1,
  },
  joinDate: {
    color: '#757575',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
    marginTop: 4,
  },

  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#757575',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 16,
  }
});