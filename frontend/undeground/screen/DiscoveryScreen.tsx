import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native'; 

import Header from '../components/Header';
import RecordCard from '../components/RecordCard';
import ShopCard from '../components/ShopCard'; // <-- ДОБАВИЛИ ИМПОРТ SHOPCARD

// Импортируем моковые данные
import testData from '../data/test_data.json';

const CURRENCY = "₽";

export default function DiscoveryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // === СОСТОЯНИЯ ===
  const [activeTab, setActiveTab] = useState<'WAX' | 'SHOPS'>('WAX'); // <-- НОВОЕ СОСТОЯНИЕ ДЛЯ ВКЛАДОК
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL DIGS');
  
  const [filters, setFilters] = useState<string[]>([]);
  const [records, setRecords] = useState<any[]>([]);
  const [shops, setShops] = useState<any[]>([]); // <-- НОВОЕ СОСТОЯНИЕ ДЛЯ МАГАЗИНОВ
  const [isLoading, setIsLoading] = useState(true);

  // 1. Загрузка данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(testData.discovery_filters || []);
      setRecords(testData.discovery_records || []);
      setShops(testData.nearby_shops || []); // Подтягиваем магазины из БД
      setIsLoading(false);
    }, 800); 
    
    return () => clearTimeout(timer);
  }, []);

  // 2. Слушаем клики по хештегам из других экранов
  useEffect(() => {
    if (route.params?.query) {
      setSearchQuery(route.params.query);
      setActiveFilter('ALL DIGS'); 
      
      // <-- ДОБАВИЛИ ПРОВЕРКУ ВКЛАДКИ -->
      // Если вместе с тегом передали параметр tab: 'SHOPS', открываем магазины
      if (route.params?.tab === 'SHOPS') {
        setActiveTab('SHOPS');
      } else {
        // Иначе по умолчанию открываем пластинки
        setActiveTab('WAX'); 
      }
    }
  }, [route.params?.query, route.params?.tab]);

  // 3. Логика фильтрации ПЛАСТИНОК
  const filteredRecords = records.filter(record => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = query === '' || 
      record.title?.toLowerCase().includes(query) ||
      record.subtitle?.toLowerCase().includes(query) ||
      record.tags?.some((tag: string) => tag.toLowerCase().includes(query));

    const matchesFilter = activeFilter === 'ALL DIGS' || 
      record.badge_text?.toUpperCase().includes(activeFilter) ||
      record.tags?.some((tag: string) => tag.toUpperCase().includes(activeFilter)) ||
      record.title?.toUpperCase().includes(activeFilter);

    return matchesSearch && matchesFilter;
  });

  // 4. Логика фильтрации МАГАЗИНОВ
  const filteredShops = shops.filter(shop => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') return true; // Если поиск пуст, показываем все магазины

    return shop.name?.toLowerCase().includes(query) ||
           shop.specialty?.toLowerCase().includes(query) ||
           shop.tags?.some((tag: string) => tag.toLowerCase().includes(query));
  });

  return (
    <View style={styles.container}>
      <Header 
        isAuthenticated={true} 
        onNotificationPress={() => navigation.navigate('Notifications')}
      />

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D1FF00" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* === ПОИСКОВАЯ СТРОКА === */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
            <TextInput 
              style={styles.searchInput}
              placeholder={activeTab === 'WAX' ? "SEARCH WAX..." : "SEARCH SHOPS..."}
              placeholderTextColor="#757575"
              value={searchQuery}
              onChangeText={setSearchQuery}
              selectionColor="#D1FF00"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Ionicons name="close-circle" size={20} color="#757575" />
              </TouchableOpacity>
            )}
          </View>

          {/* === ПЕРЕКЛЮЧАТЕЛЬ ВКЛАДОК (TABS) === */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'WAX' && styles.tabButtonActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('WAX')}
            >
              <Ionicons name="disc-outline" size={16} color={activeTab === 'WAX' ? "#000000" : "#757575"} style={styles.tabIcon} />
              <Text style={[styles.tabText, activeTab === 'WAX' && styles.tabTextActive]}>RECORDS</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'SHOPS' && styles.tabButtonActive]}
              activeOpacity={0.8}
              onPress={() => setActiveTab('SHOPS')}
            >
              <Ionicons name="storefront-outline" size={16} color={activeTab === 'SHOPS' ? "#000000" : "#757575"} style={styles.tabIcon} />
              <Text style={[styles.tabText, activeTab === 'SHOPS' && styles.tabTextActive]}>SHOPS</Text>
            </TouchableOpacity>
          </View>

          {/* === КОНТЕНТ В ЗАВИСИМОСТИ ОТ ВЫБРАННОЙ ВКЛАДКИ === */}
          
          {activeTab === 'WAX' ? (
            <>
              {/* ФИЛЬТРЫ (Пилюли) показываем только для пластинок */}
              <View style={styles.filtersWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
                  {filters.map((filter) => {
                    const isActive = activeFilter === filter;
                    return (
                      <TouchableOpacity 
                        key={filter} 
                        activeOpacity={0.8}
                        onPress={() => {
                          setActiveFilter(filter);
                          if (searchQuery) setSearchQuery(''); 
                        }}
                        style={[
                          styles.filterPill, 
                          isActive ? styles.filterPillActive : styles.filterPillInactive
                        ]}
                      >
                        <Text style={[
                          styles.filterText,
                          isActive ? styles.filterTextActive : styles.filterTextInactive
                        ]}>
                          {filter}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* СЕТКА ПЛАСТИНОК */}
              <View style={styles.gridContainer}>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => {
                    const numericPrice = record.price.toString().replace(/[^\d\s.,]/g, '').trim();
                    return (
                      <RecordCard 
                        key={record.id}
                        title={record.title}
                        subtitle={record.subtitle}
                        price={numericPrice} 
                        currency={CURRENCY}
                        imageUrl={record.image_url}
                        badgeText={record.badge_text}
                        badgeColor={record.badge_color}
                        onPress={() => navigation.navigate('ItemDetail', { id: record.id })}
                      />
                    );
                  })
                ) : (
                  <View style={styles.emptyStateContainer}>
                    <Ionicons name="disc-outline" size={64} color="#191919" />
                    <Text style={styles.emptyStateText}>NO WAX FOUND</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            // === СЕТКА МАГАЗИНОВ ===
            <View style={styles.gridContainer}>
              {filteredShops.length > 0 ? (
                filteredShops.map((shop) => (
                  <ShopCard 
                    key={shop.id}
                    name={shop.name}
                    specialty={shop.specialty}
                    distance={shop.distance} // Для простоты используем статику, но можно и геолокацию прикрутить
                    imageUrl={shop.image_url}
                    tags={shop.tags}
                    onPress={() => navigation.navigate('ShopDetail', { id: shop.id })}
                    onDirectionsPress={() => navigation.navigate('ShopDetail', { id: shop.id })}
                    onMapPress={() => navigation.navigate('Map')}
                    onTagPress={(tag) => {
                      // При клике на тег внутри поиска магазинов, ищем магазины с этим тегом
                      setSearchQuery(tag);
                    }}
                  />
                ))
              ) : (
                <View style={styles.emptyStateContainer}>
                  <Ionicons name="storefront-outline" size={64} color="#191919" />
                  <Text style={styles.emptyStateText}>NO SHOPS FOUND</Text>
                </View>
              )}
            </View>
          )}

        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 120, paddingTop: 10 },
  
  // Поиск
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#191919', marginHorizontal: 20, borderRadius: 30, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#262626', marginBottom: 20 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#ffffff', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },

  // Вкладки
  tabsContainer: { flexDirection: 'row', paddingHorizontal: 20, marginBottom: 24, gap: 12 },
  tabButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 24, backgroundColor: '#191919', borderWidth: 1, borderColor: '#262626' },
  tabButtonActive: { backgroundColor: '#D1FF00', borderColor: '#D1FF00' },
  tabIcon: { marginRight: 6 },
  tabText: { color: '#757575', fontSize: 12, fontWeight: '900', letterSpacing: 1 },
  tabTextActive: { color: '#000000' },

  // Фильтры
  filtersWrapper: { marginBottom: 32 },
  filtersScroll: { paddingHorizontal: 20, gap: 12 },
  filterPill: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1 },
  filterPillActive: { backgroundColor: '#D1FF00', borderColor: '#D1FF00', shadowColor: '#D1FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  filterPillInactive: { backgroundColor: '#191919', borderColor: '#262626' },
  filterText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },
  filterTextActive: { color: '#000000' },
  filterTextInactive: { color: '#757575' },

  // Сетка
  gridContainer: { paddingHorizontal: 20 },
  
  // Пустое состояние
  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyStateText: { color: '#262626', fontSize: 18, fontWeight: '900', marginTop: 16, letterSpacing: 1 }
});