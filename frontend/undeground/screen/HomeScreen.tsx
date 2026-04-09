import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Platform, 
  ActivityIndicator, 
  TouchableOpacity,
  Dimensions,
  Alert
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location'; 

import Header from '../components/Header';
import HeroCard from '../components/HeroCard'; 
import DropCard from '../components/DropCard'; 
import ThreadCard from '../components/ThreadCard'; 
import ShopCard from '../components/ShopCard';

import { RootStackParamList } from '../types/navigation';
import testData from '../data/test_data.json';

// Подключаем Корзину (для обычных товаров)
import { useCart } from '../context/CartContext';
// Подключаем Предзаказы (для эксклюзивных дропов)
import { usePreorders } from '../context/PreorderContext';

const { width } = Dimensions.get('window');

// Формула Гаверсинуса для расчета расстояния
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  const distance = R * c; 
  return distance.toFixed(1); 
};

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [userLocation, setUserLocation] = useState<{lat: number, lon: number} | null>(null);
  
  // Инициализируем оба контекста
  const { addToCart } = useCart();
  const { addPreorder } = usePreorders();

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(testData);
      setIsLoading(false);
    }, 800);

    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Доступ к локации запрещен');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserLocation({ lat: location.coords.latitude, lon: location.coords.longitude });
      } catch (error) {
        console.log("Ошибка получения локации: ", error);
      }
    })();

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Header isAuthenticated={true} />

      {isLoading || !data ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D1FF00" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* === ДИНАМИЧЕСКИЕ HERO DROPS === */}
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {data.hero_drop.map((drop: any, index: number) => (
              <View key={drop.id || index} style={{ width: width }}>
                <HeroCard 
                  imageUrl={drop.image_url}
                  badgeText={drop.badge_text}
                  titleLine1={drop.title_line1}
                  titleLine2={drop.title_line2}
                  onPress={() => navigation.getParent()?.navigate('ItemDetail', { id: drop.id })}
                />
              </View>
            ))}
          </ScrollView>

          {/* === КОЛЛЕКЦИОННЫЕ ИЗДАНИЯ === */}
          <View style={styles.sectionContainer}>
            <ScrollView 
              horizontal={true} 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={styles.horizontalScrollPadding}
              snapToInterval={width * 0.85 + 16} 
              decelerationRate="fast"
            >
              {data.featured_edition.map((edition: any, index: number) => (
                <View key={edition.id || index} style={{ width: width * 0.85, marginRight: 16 }}>
                  <DropCard 
                    editionLabel={edition.edition_label}
                    description={edition.description}
                    price={edition.price}
                    onSecurePress={() => {
                      addPreorder({
                        id: edition.id,
                        title: edition.edition_label || 'EXCLUSIVE DROP',
                        price: edition.price,
                        image_url: edition.image_url || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop',
                      });
                      Alert.alert("SECURED!", "Издание добавлено в ваш Vault (Предзаказы).");
                    }}
                    onPress={() => navigation.getParent()?.navigate('ItemDetail', { id: edition.id })}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* === ДИНАМИЧЕСКИЕ ОБСУЖДЕНИЯ === */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>ACTIVE THREADS</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalScrollPadding}>
              {data.active_threads.map((thread: any, index: number) => {
                const threadTags = thread.tags || (index % 2 === 0 ? ["GEAR", "SETUP"] : ["IDENTIFICATION"]);

                return (
                  <ThreadCard 
                    key={thread.id} 
                    title={thread.title}
                    repliesCount={thread.replies_count}
                    rating={thread.rating} 
                    tags={threadTags}      
                    borderColor={thread.border_color}
                    onPress={() => navigation.getParent()?.navigate('ThreadDetail')}
                  />
                )
              })}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.viewAllButton} 
              activeOpacity={0.8}
              onPress={() => navigation.getParent()?.navigate('AllThreads')}
            >
              <Text style={styles.viewAllText}>VIEW ALL FORUM THREADS</Text>
              <Ionicons name="arrow-forward" size={16} color="#D1FF00" />
            </TouchableOpacity>
          </View>

          {/* === МАГАЗИНЫ С АВТО-ДИСТАНЦИЕЙ И КЛИКАБЕЛЬНЫМИ ТЕГАМИ === */}
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>NEARBY SHOPS</Text>
              <Text style={styles.sectionSubtitle}>// LOCATED IN YOUR SECTOR</Text>
            </View>

            {data.nearby_shops.map((shop: any) => {
              const dynamicDistance = (userLocation && shop.coordinates)
                ? `${calculateDistance(userLocation.lat, userLocation.lon, shop.coordinates.latitude, shop.coordinates.longitude)}KM AWAY`
                : shop.distance; 

              return (
                <ShopCard 
                  key={shop.id}
                  name={shop.name}
                  specialty={shop.specialty}
                  distance={dynamicDistance}
                  imageUrl={shop.image_url}
                  tags={shop.tags} // <-- ПЕРЕДАЕМ ТЕГИ В КАРТОЧКУ
                  onPress={() => navigation.navigate('ShopDetail', { id: shop.id })}
                  onDirectionsPress={() => navigation.navigate('ShopDetail', { id: shop.id })}
                  onMapPress={() => navigation.navigate('Map')}
                  // <-- ДОБАВЛЯЕМ ПЕРЕХОД ПО ТЕГУ В ПОИСК -->
                  onTagPress={(tag) => {
                    navigation.navigate('Search', { query: tag, tab: 'SHOPS' });
                  }}
                />
              );
            })}
          </View>
          
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 120, paddingTop: 10 }, 
  dropCardWrapper: { marginTop: 40 },
  sectionContainer: { marginTop: 40, paddingHorizontal: 20 },
  sectionHeader: { marginBottom: 24 },
  sectionTitle: { color: '#ffffff', fontSize: 40, fontWeight: '900', letterSpacing: -1, textTransform: 'uppercase' },
  sectionSubtitle: { color: '#757575', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold', marginTop: 4 },
  horizontalScrollPadding: { paddingRight: 40 },
  viewAllButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 24, paddingVertical: 16, borderRadius: 30, backgroundColor: '#191919', borderWidth: 1, borderColor: '#262626' },
  viewAllText: { color: '#D1FF00', fontSize: 12, fontWeight: '900', letterSpacing: 1.5, marginRight: 8 },
});