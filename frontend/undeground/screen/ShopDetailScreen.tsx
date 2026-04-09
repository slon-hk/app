import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Platform,
  Dimensions,
  Linking 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from '../types/navigation';
import { RouteProp } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';

import testData from '../data/test_data.json';
import RecordCard from '../components/RecordCard';

const { width } = Dimensions.get('window');

type ShopDetailRouteProp = RouteProp<RootStackParamList, 'ShopDetail'>;

export default function ShopDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<ShopDetailRouteProp>();
  
  const shopId = route.params?.id || testData.nearby_shops[0].id;
  const shop = testData.nearby_shops.find((s: any) => s.id === shopId) || testData.nearby_shops[0];
  
  const inventory = testData.discovery_records;

  const { toggleFavorite, isFavorite } = useFavorites();
  const isSaved = isFavorite(shop.id);

  // === ОБРАБОТЧИК КЛИКА ПО ТЕГУ ===
  const handleTagPress = (tag: string) => {
    // @ts-ignore
    navigation.navigate('MainTabs', {
      screen: 'Search',
      params: { query: tag, tab: 'SHOPS' } // <-- Явно указываем вкладку
    });
  };

  const handleGetDirections = () => {
    if (!shop.coordinates) return;

    const { latitude, longitude } = shop.coordinates;
    const label = shop.name;

    const url = Platform.select({
      ios: `maps:0,0?q=${label}@${latitude},${longitude}`,
      android: `geo:0,0?q=${latitude},${longitude}(${label})`,
    });

    if (url) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`);
        }
      });
    }
  };

  const handleOpenInternalMap = () => {
    // @ts-ignore
    navigation.navigate('MainTabs' as never, { screen: 'Map' } as never);
  };
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.coverContainer}>
          <Image source={{ uri: shop.image_url }} style={styles.coverImage} />
          <LinearGradient colors={['transparent', 'rgba(14,14,14,0.8)', '#0e0e0e']} style={styles.gradientOverlay} />

          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.saveButtonHeader} onPress={() => toggleFavorite(shop.id)} activeOpacity={0.8}>
            <Ionicons name={isSaved ? "heart" : "heart-outline"} size={24} color={isSaved ? "#FF51FA" : "#ffffff"} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.distanceBadge}>
            <Ionicons name="location" size={12} color="#000000" style={{ marginRight: 4 }} />
            <Text style={styles.distanceText}>{shop.distance}</Text>
          </View>
          
          <Text style={styles.title}>{shop.name}</Text>
          <Text style={styles.specialty}>SPECIALTY: {shop.specialty}</Text>

          {/* === КЛИКАБЕЛЬНЫЕ ХЕШТЕГИ === */}
          <View style={styles.tagsContainer}>
            {shop.tags?.map((tag: string, index: number) => (
              <TouchableOpacity 
                key={index} 
                style={styles.tagBadge}
                activeOpacity={0.7}
                onPress={() => handleTagPress(tag)}
              >
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.description}>{shop.description}</Text>

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8} onPress={handleGetDirections}>
              <Ionicons name="navigate" size={18} color="#000000" />
              <Text style={styles.primaryButtonText}>GET DIRECTIONS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8} onPress={handleOpenInternalMap}>
              <Ionicons name="map-outline" size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inventorySection}>
          <Text style={styles.sectionTitle}>LATEST ARRIVALS</Text>
          <Text style={styles.sectionSubtitle}>// CURRENTLY IN STOCK</Text>
          
          <View style={styles.gridContainer}>
            {inventory.map((record: any) => (
              <RecordCard 
                key={record.id}
                title={record.title}
                subtitle={record.subtitle}
                price={record.price}
                imageUrl={record.image_url}
                badgeText={record.badge_text}
                badgeColor={record.badge_color}
                onPress={() => {
                  // @ts-ignore
                  navigation.navigate('ItemDetail', { id: record.id });
                }}
              />
            ))}
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  scrollContent: { paddingBottom: 40 },
  
  coverContainer: { width: width, height: width * 0.85, position: 'relative' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(25, 25, 25, 0.6)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333333' },
  saveButtonHeader: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, right: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(25, 25, 25, 0.6)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333333' },

  infoContainer: { paddingHorizontal: 24, marginTop: -30 },
  distanceBadge: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', backgroundColor: '#D1FF00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginBottom: 16 },
  distanceText: { color: '#000000', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: '#ffffff', fontSize: 36, fontWeight: '900', letterSpacing: -1, textTransform: 'uppercase', marginBottom: 4 },
  specialty: { color: '#00FFFF', fontSize: 12, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 20 },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  tagBadge: { backgroundColor: '#191919', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: '#262626' },
  tagText: { color: '#c1fffe', fontSize: 10, fontWeight: 'bold' },
  description: { color: '#ababab', fontSize: 14, lineHeight: 22, marginBottom: 32 },

  actionsRow: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  primaryButton: { flex: 1, flexDirection: 'row', backgroundColor: '#D1FF00', borderRadius: 30, alignItems: 'center', justifyContent: 'center', paddingVertical: 14, shadowColor: '#D1FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  primaryButtonText: { color: '#000000', fontSize: 14, fontWeight: '900', marginLeft: 8 },
  secondaryButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#191919', borderWidth: 1, borderColor: '#262626', alignItems: 'center', justifyContent: 'center' },

  inventorySection: { borderTopWidth: 1, borderTopColor: '#191919', paddingTop: 32 },
  sectionTitle: { color: '#ffffff', fontSize: 24, fontWeight: '900', textTransform: 'uppercase', paddingHorizontal: 24 },
  sectionSubtitle: { color: '#757575', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold', marginTop: 4, marginBottom: 24, paddingHorizontal: 24 },
  gridContainer: { paddingHorizontal: 24 }
});