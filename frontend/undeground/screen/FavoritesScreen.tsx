import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';

import Header from '../components/Header';
import RecordCard from '../components/RecordCard';
import ShopCard from '../components/ShopCard';
import testData from '../data/test_data.json';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { favoriteIds } = useFavorites();
  // Состояние для переключения между пластинками и магазинами
  const [activeTab, setActiveTab] = useState<'WAX' | 'SHOPS'>('WAX');

  const favoriteRecords = [
    ...(testData.discovery_records || []),
    ...(testData.featured_edition || []),
    ...(testData.hero_drop || [])
  ].filter((item: any) => favoriteIds.includes(item.id));

  const favoriteShops = (testData.nearby_shops || []).filter((shop: any) => 
    favoriteIds.includes(shop.id)
  );

  return (
    <View style={styles.container}>
      <Header 
        isAuthenticated={true} 
        onNotificationPress={() => console.log('Открываем уведомления')}
      />

      {/* Заголовок страницы */}
      <View style={styles.headerSection}>
        <Text style={styles.pageTitle}>YOUR VAULT</Text>
        <Text style={styles.pageSubtitle}>
          // {activeTab === 'WAX' ? favoriteRecords.length : favoriteShops.length} ITEMS SAVED
        </Text>
      </View>

      {/* Переключатель вкладок (Tabs) */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'WAX' && styles.tabButtonActive]}
          onPress={() => setActiveTab('WAX')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'WAX' && styles.tabTextActive]}>
            SAVED WAX
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabButton, activeTab === 'SHOPS' && styles.tabButtonActive]}
          onPress={() => setActiveTab('SHOPS')}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabText, activeTab === 'SHOPS' && styles.tabTextActive]}>
            LOCAL SHOPS
          </Text>
        </TouchableOpacity>
      </View>

      {/* Список избранного */}
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === 'WAX' ? (
          // --- ВКЛАДКА: ПЛАСТИНКИ ---
          <> 
            {favoriteRecords.length > 0 ? (
              favoriteRecords.map((item: any) => (
                <RecordCard 
                  key={item.id}
                  title={item.title || item.title_line1 || item.edition_label || 'UNKNOWN'}
                  subtitle={item.description || 'NO DESCRIPTION'}
                  price={item.price || '$0'}
                  imageUrl={item.image_url || 'https://images.unsplash.com/photo-1614613535808-3196b0299f01?q=80&w=800&auto=format&fit=crop'}
                  badgeText={item.badge_text || 'SAVED'}
                  badgeColor="#FF51FA"
                  onPress={() => navigation.navigate('ItemDetail', { id: item.id })}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>VAULT IS EMPTY</Text>
                <Text style={styles.emptySubtext}>GO DIG SOME WAX</Text>
              </View>
            )}
          </>
        ) : (
          // --- ВКЛАДКА: МАГАЗИНЫ ---
          <>
            {favoriteShops.length > 0 ? (
              favoriteShops.map((shop: any) => (
                <ShopCard 
                  key={shop.id}
                  name={shop.name}
                  specialty={shop.specialty}
                  distance={shop.distance}
                  imageUrl={shop.image_url}
                  onPress={() => navigation.navigate('ShopDetail', { id: shop.id })}
                  onDirectionsPress={() => console.log('Route to', shop.name)}
                  onMapPress={() => navigation.navigate('Map')}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>NO SAVED SHOPS</Text>
                <Text style={styles.emptySubtext}>FIND YOUR LOCAL HOTSPOT</Text>
              </View>
            )}
          </>
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
  headerSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  pageTitle: {
    color: '#ffffff',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  pageSubtitle: {
    color: '#757575',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    marginTop: 4,
  },
  emptyState: {
    marginTop: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 2,
  },
  emptySubtext: {
    color: '#D1FF00',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 8,
  },
  
  // Стили для переключателя (Tabs)
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    gap: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#262626',
    backgroundColor: '#191919',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#D1FF00',
    borderColor: '#D1FF00',
    shadowColor: '#D1FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  tabText: {
    color: '#757575',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  tabTextActive: {
    color: '#000000',
  },

  // Скролл контента
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 120, // Оставляем место для нижнего меню
  }
});