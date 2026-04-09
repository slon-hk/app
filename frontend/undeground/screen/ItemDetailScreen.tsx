import React, { useState, useEffect, useRef } from 'react'; // Добавили useRef
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Platform,
  Dimensions,
  ActivityIndicator,
  Modal,      // <-- Добавили Modal
  Animated    // <-- Добавили Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

import { useAudioPlayer, useAudioPlayerStatus, setAudioModeAsync } from 'expo-audio';
import { useFavorites } from '../context/FavoritesContext';
import { useCart } from '../context/CartContext';
import testData from '../data/test_data.json';

const { width, height } = Dimensions.get('window');

const FALLBACK_DATA = {
  artist: "UNKNOWN ARTIST",
  label: "INDEPENDENT PRESSING",
  description: "Эксклюзивный 180-граммовый винил. Глубокое аналоговое звучание и плотный грув. Идеально для коллекции.",
  tags: ["#VINYL", "#WAX"],
  tracklist: [
    { side: "A1", name: "Cyber Storm (Preview)", duration: "0:30", preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
    { side: "A2", name: "Neon Tears (Preview)", duration: "0:30", preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
    { side: "B1", name: "Analog Dreams (Preview)", duration: "0:30", preview_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" }
  ]
};

export default function ItemDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  
  // === СОСТОЯНИЕ ДЛЯ КАСТОМНОГО АЛЕРТА ===
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const showCustomAlert = (title: string, message: string) => {
    setAlertConfig({ title, message });
    setAlertVisible(true);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideCustomAlert = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setAlertVisible(false));
  };

  // @ts-ignore
  const itemId = route.params?.id;

  const foundRecord = (
    testData.discovery_records?.find(r => r.id === itemId) || 
    testData.featured_edition?.find(r => r.id === itemId) || 
    testData.hero_drop?.find(r => r.id === itemId)
  ) as any;

  const record = {
    id: foundRecord?.id || "unknown",
    title: foundRecord?.title || foundRecord?.title_line1 || foundRecord?.edition_label || "UNKNOWN TITLE",
    price: foundRecord?.price || "0",
    image_url: foundRecord?.image_url || "https://images.unsplash.com/photo-1614613535808-3196b0299f01?q=80&w=800&auto=format&fit=crop",
    badge_text: foundRecord?.badge_text || "STANDARD PRESSING",
    artist: foundRecord?.artist || FALLBACK_DATA.artist,
    label: foundRecord?.label || FALLBACK_DATA.label,
    description: foundRecord?.description || FALLBACK_DATA.description,
    tags: foundRecord?.tags || FALLBACK_DATA.tags,
    tracklist: foundRecord?.tracklist || FALLBACK_DATA.tracklist,
  };

  const { toggleFavorite, isFavorite } = useFavorites();
  const { addToCart, cartItems } = useCart();
  const isSaved = isFavorite(record.id);
  const inCart = cartItems.some(item => item.id === record.id);

  const CURRENCY = "₽"; 
  const numericPrice = record.price.toString().replace(/[^\d\s.,]/g, '').trim();
  const availableShops = testData.nearby_shops?.slice(0, 2) || [];

  const [activeTrackIndex, setActiveTrackIndex] = useState<number | null>(null);
  const player = useAudioPlayer(null); 
  const status = useAudioPlayerStatus(player);

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true, allowsRecording: false });
  }, []);

  useEffect(() => {
    if (activeTrackIndex !== null && status.duration > 0) {
      if (status.currentTime >= status.duration && !player.playing) {
        setActiveTrackIndex(null);
      }
    }
  }, [status.currentTime, status.duration, player.playing]);

  const togglePlay = (trackUrl: string, index: number) => {
    if (!trackUrl) {
      showCustomAlert("NO PREVIEW", "Превью для этого трека недоступно.");
      return;
    }

    if (activeTrackIndex === index) {
      if (player.playing) {
        player.pause();
      } else {
        if (status.currentTime >= status.duration) player.seekTo(0);
        player.play();
      }
    } else {
      player.replace(trackUrl);
      player.play();
      setActiveTrackIndex(index);
    }
  };

  const handleAddToCart = () => {
    if (!inCart) {
      addToCart({ id: record.id, title: record.title, price: record.price, image_url: record.image_url, quantity: 1 });
      showCustomAlert("ADDED TO BAG", `${record.title}\nтеперь в вашей коллекции.`);
    } else {
      navigation.navigate('Cart');
    }
  };

  const handleTagPress = (tag: string) => {
    navigation.navigate('MainTabs', { screen: 'Search', params: { query: tag } });
  };

  return (
    <View style={styles.container}>
      {/* === CUSTOM ALERT MODAL === */}
      <Modal visible={alertVisible} transparent animationType="none">
        <View style={styles.modalOverlay}>
          <Animated.View style={[styles.alertBox, { opacity: fadeAnim }]}>
            <LinearGradient colors={['#1a1a1a', '#0a0a0a']} style={styles.alertGradient}>
              <Ionicons name="checkmark-circle" size={50} color="#D1FF00" style={styles.alertIcon} />
              <Text style={styles.alertTitle}>{alertConfig.title}</Text>
              <Text style={styles.alertMessage}>{alertConfig.message}</Text>
              <TouchableOpacity style={styles.alertButton} onPress={hideCustomAlert}>
                <Text style={styles.alertButtonText}>UNDERSTOOD</Text>
              </TouchableOpacity>
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.coverContainer}>
          <Image source={{ uri: record.image_url }} style={styles.coverImage} />
          <LinearGradient colors={['transparent', 'rgba(14,14,14,0.8)', '#0e0e0e']} style={styles.gradientOverlay} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.badge}><Text style={styles.badgeText}>{record.badge_text}</Text></View>
          <Text style={styles.title}>{record.title}</Text>
          <Text style={styles.artist}>BY {record.artist}</Text>
          <Text style={styles.label}>{record.label}</Text>

          <View style={styles.tagsContainer}>
            {record.tags.map((tag: string, index: number) => (
              <TouchableOpacity key={index} style={styles.tagBadge} onPress={() => handleTagPress(tag)}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionTitle}>DESCRIPTION</Text>
          <Text style={styles.description}>{record.description}</Text>
        </View>

        <View style={styles.tracklistContainer}>
          <Text style={styles.sectionTitle}>AUDIO PREVIEW</Text>
          {record.tracklist.map((track: any, index: number) => {
            const isThisTrackActive = activeTrackIndex === index;
            const isPlaying = isThisTrackActive && player.playing;
            const isBuffering = isThisTrackActive && player.isBuffering;

            return (
              <TouchableOpacity 
                key={index} 
                style={[styles.trackRow, isThisTrackActive && styles.trackRowActive]}
                onPress={() => togglePlay(track.preview_url, index)}
              >
                <View style={styles.trackLeft}>
                  <View style={styles.iconWrapper}>
                    {isBuffering ? <ActivityIndicator size="small" color="#D1FF00" /> : 
                    <Ionicons name={isPlaying ? "pause-circle" : "play-circle"} size={28} color={isThisTrackActive ? "#D1FF00" : "#757575"} />}
                  </View>
                  <View>
                    <Text style={[styles.trackSide, isThisTrackActive && { color: '#D1FF00' }]}>{track.side}</Text>
                    <Text style={[styles.trackName, isThisTrackActive && { color: '#ffffff' }]}>{track.name}</Text>
                  </View>
                </View>
                {isPlaying ? <Ionicons name="stats-chart" size={16} color="#D1FF00" /> : <Text style={styles.trackDuration}>{track.duration}</Text>}
              </TouchableOpacity>
            );
          })}
        </View>

        {availableShops.length > 0 && (
          <View style={styles.shopsContainer}>
            <Text style={styles.sectionTitle}>AVAILABLE AT</Text>
            {availableShops.map((shop: any) => (
              <TouchableOpacity key={shop.id} style={styles.shopRow} onPress={() => navigation.navigate('ShopDetail', { id: shop.id })}>
                <Image source={{ uri: shop.image_url }} style={styles.shopMiniImage} />
                <View style={styles.shopInfo}>
                  <Text style={styles.shopName} numberOfLines={1}>{shop.name}</Text>
                  <Text style={styles.shopStatus}>IN STOCK • {shop.distance}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#757575" />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>PRICE</Text>
          <Text style={styles.priceValue}>{CURRENCY}{numericPrice}</Text>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={() => toggleFavorite(record.id)}>
          <Ionicons name={isSaved ? "heart" : "heart-outline"} size={28} color={isSaved ? "#FF51FA" : "#ffffff"} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.buyButton, inCart && styles.buyButtonActive]} onPress={handleAddToCart}>
          <Text style={[styles.buyButtonText, inCart && styles.buyButtonTextActive]}>{inCart ? "IN CART" : "BUY"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  scrollContent: { paddingBottom: 140 },
  
  // === ALERT STYLES ===
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'center', alignItems: 'center' },
  alertBox: { width: width * 0.8, borderRadius: 24, overflow: 'hidden', borderWidth: 1, borderColor: '#262626' },
  alertGradient: { padding: 32, alignItems: 'center' },
  alertIcon: { marginBottom: 16 },
  alertTitle: { color: '#ffffff', fontSize: 20, fontWeight: '900', marginBottom: 8, textAlign: 'center' },
  alertMessage: { color: '#ababab', fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  alertButton: { backgroundColor: '#D1FF00', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 30 },
  alertButtonText: { color: '#000000', fontWeight: '900', fontSize: 12 },

  coverContainer: { width: width, height: width, position: 'relative' },
  coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(14, 14, 14, 0.6)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333333' },

  infoContainer: { paddingHorizontal: 24, marginTop: -40 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#D1FF00', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, marginBottom: 16 },
  badgeText: { color: '#000000', fontSize: 10, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: '#ffffff', fontSize: 40, fontWeight: '900', letterSpacing: -1, textTransform: 'uppercase', marginBottom: 4 },
  artist: { color: '#FF51FA', fontSize: 16, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 8 },
  label: { color: '#757575', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold', marginBottom: 24 },
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 32 },
  tagBadge: { backgroundColor: '#191919', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#262626' },
  tagText: { color: '#c1fffe', fontSize: 10, fontWeight: 'bold' },

  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: '900', marginBottom: 12, letterSpacing: 1 },
  description: { color: '#ababab', fontSize: 14, lineHeight: 22, marginBottom: 40 },

  tracklistContainer: { paddingHorizontal: 24, marginBottom: 32 },
  trackRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#191919' },
  trackRowActive: { backgroundColor: 'rgba(209, 255, 0, 0.05)', borderRadius: 8, paddingHorizontal: 8, borderBottomWidth: 0 },
  trackLeft: { flexDirection: 'row', alignItems: 'center' },
  iconWrapper: { width: 32, alignItems: 'flex-start', justifyContent: 'center', marginRight: 12 },
  trackSide: { color: '#757575', fontSize: 10, fontWeight: '900', marginBottom: 2 },
  trackName: { color: '#ababab', fontSize: 16, fontWeight: 'bold' },
  trackDuration: { color: '#757575', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },

  shopsContainer: { paddingHorizontal: 24, marginBottom: 32 },
  shopRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111111', padding: 12, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#191919' },
  shopMiniImage: { width: 48, height: 48, borderRadius: 8, marginRight: 16, backgroundColor: '#262626' },
  shopInfo: { flex: 1 },
  shopName: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginBottom: 4, textTransform: 'uppercase' },
  shopStatus: { color: '#D1FF00', fontSize: 10, fontWeight: '900', letterSpacing: 0.5 },

  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(20, 20, 20, 0.95)', borderTopWidth: 1, borderTopColor: '#262626', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 34 : 24 },
  priceContainer: { flex: 1 },
  priceLabel: { color: '#757575', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  priceValue: { color: '#ffffff', fontSize: 28, fontWeight: '900', marginTop: -4 },
  saveButton: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  buyButton: { backgroundColor: '#D1FF00', paddingHorizontal: 32, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', shadowColor: '#D1FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 5 },
  buyButtonActive: { backgroundColor: '#ffffff', shadowColor: '#ffffff' }, 
  buyButtonText: { color: '#000000', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  buyButtonTextActive: { color: '#000000' }
});