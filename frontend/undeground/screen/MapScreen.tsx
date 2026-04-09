import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  Animated, 
  ScrollView, 
  Dimensions, 
  Pressable,
  PanResponder,
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps'; 
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';

import Header from '../components/Header';
import HotspotCard from '../components/HotspotCard';

// Импорт моковых данных
import testData from '../data/test_data.json';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32; 

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#111111' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#757575' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c2c2c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e0e0e' }] },
];

export default function MapScreen() {
  const navigation = useNavigation();
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [shops, setShops] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const animation = useRef(new Animated.Value(0)).current;
  const mapRef = useRef<MapView>(null);
  const scrollRef = useRef<ScrollView>(null);

  // Имитация загрузки данных
  useEffect(() => {
    const timer = setTimeout(() => {
      setShops(testData.nearby_shops);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const toggleMapMode = (expand: boolean) => {
    Animated.spring(animation, {
      toValue: expand ? 1 : 0,
      useNativeDriver: true,
      bounciness: 4,
      speed: 12,
    }).start();
    setIsMapExpanded(expand);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy > 30) toggleMapMode(true);
        else if (gestureState.dy < -30) toggleMapMode(false);
      }
    })
  ).current;

  const cardsTranslateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 280], 
  });

  const hudOpacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const locateUser = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return;
    let location = await Location.getCurrentPositionAsync({});
    mapRef.current?.animateToRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    }, 1000);
  };

  // Функция для фокусировки на магазине при клике на маркер
  const onMarkerPress = (index: number) => {
    toggleMapMode(false); // Разворачиваем карточки
    scrollRef.current?.scrollTo({
      x: index * CARD_WIDTH,
      animated: true
    });
  };

  return (
    <View style={styles.container}>
      <Header isAuthenticated={true} />

      <View style={styles.mapArea}>
        {isLoading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#D1FF00" />
          </View>
        ) : (
          <>
            <MapView 
              ref={mapRef}
              style={StyleSheet.absoluteFillObject}
              customMapStyle={darkMapStyle}
              initialRegion={{
                latitude: 55.751244,
                longitude: 37.618423,
                latitudeDelta: 0.1,
                longitudeDelta: 0.1,
              }}
              showsUserLocation={true}
              showsMyLocationButton={false}
              onPress={() => { if (!isMapExpanded) toggleMapMode(true); }} 
            >
              {/* ДИНАМИЧЕСКИЕ МАРКЕРЫ */}
              {shops.map((shop, index) => (
                <Marker 
                  key={shop.id}
                  coordinate={shop.coordinates}
                  onPress={() => onMarkerPress(index)}
                >
                  <View style={styles.customMarker}>
                    <View style={styles.markerDotInner} />
                  </View>
                </Marker>
              ))}
            </MapView>

            <Animated.View style={[styles.locateButtonWrapper, { opacity: hudOpacity }]} pointerEvents={isMapExpanded ? 'none' : 'auto'}>
              <Pressable style={styles.locateButton} onPress={locateUser}>
                <Ionicons name="navigate" size={24} color="#000000" />
              </Pressable>
            </Animated.View>

            <Animated.View style={[styles.searchBar, { opacity: hudOpacity }]} pointerEvents={isMapExpanded ? 'none' : 'auto'}>
              <Ionicons name="search" size={20} color="#D1FF00" />
              <TextInput 
                style={styles.searchInput}
                placeholder="FIND NEAREST HOTSPOT."
                placeholderTextColor="#757575"
              />
              <Ionicons name="options-outline" size={20} color="#FF51FA" />
            </Animated.View>

            <Animated.View style={[styles.bottomSlider, { transform: [{ translateY: cardsTranslateY }] }]}>
              <View {...panResponder.panHandlers} style={styles.dragHandleWrapper}>
                <View style={styles.dragHandle} />
              </View>

              <View>
                {isMapExpanded && (
                  <Pressable style={styles.hiddenPanelTrigger} onPress={() => toggleMapMode(false)} />
                )}

                <ScrollView 
                  ref={scrollRef}
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  snapToInterval={CARD_WIDTH} 
                  decelerationRate="fast" 
                  contentContainerStyle={styles.cardsScrollContent}
                >
                  {/* ДИНАМИЧЕСКИЕ КАРТОЧКИ */}
                  {shops.map((shop) => (
                    <View key={shop.id} style={{ width: CARD_WIDTH }}>
                      <HotspotCard 
                        title={shop.name}
                        distance={shop.distance}
                        description={shop.description}
                        tags={shop.tags}
                        imageUrl={shop.image_url}
                        onPress={() => navigation.navigate('ShopDetail', { id: shop.id })}
                        onDirectionsPress={() => navigation.navigate('ShopDetail', { id: shop.id })}
                      />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </Animated.View>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  mapArea: { flex: 1, position: 'relative', overflow: 'hidden' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0e0e0e' },
  customMarker: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(209, 255, 0, 0.3)', alignItems: 'center', justifyContent: 'center' },
  markerDotInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#D1FF00', borderWidth: 2, borderColor: '#000000' },
  searchBar: { position: 'absolute', top: 20, left: 20, right: 20, flexDirection: 'row', alignItems: 'center', backgroundColor: '#191919', borderRadius: 30, paddingHorizontal: 20, height: 55, borderWidth: 1, borderColor: '#262626', zIndex: 10 },
  searchInput: { flex: 1, color: '#ffffff', fontSize: 12, fontWeight: 'bold', marginHorizontal: 12 },
  locateButtonWrapper: { position: 'absolute', right: 20, top: 90, zIndex: 10 },
  locateButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#D1FF00', alignItems: 'center', justifyContent: 'center', shadowColor: '#D1FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 10, elevation: 5 },
  bottomSlider: { position: 'absolute', bottom: Platform.OS === 'ios' ? 100 : 80, left: 0, right: 0, zIndex: 20 },
  dragHandleWrapper: { width: '100%', height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'transparent' },
  dragHandle: { width: 50, height: 6, borderRadius: 3, backgroundColor: '#D1FF00', shadowColor: '#D1FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 5 },
  cardsScrollContent: { paddingLeft: 16, paddingRight: 16 },
  hiddenPanelTrigger: { ...StyleSheet.absoluteFillObject, zIndex: 100 }
});