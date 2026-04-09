import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface ShopCardProps {
  name: string;
  specialty: string;
  distance: string;
  imageUrl: string;
  tags?: string[]; // <-- ДОБАВЛЕН ПРОП ТЕГОВ
  onDirectionsPress?: () => void;
  onMapPress?: () => void;
  onPress?: () => void;
  onTagPress?: (tag: string) => void; // <-- ДОБАВЛЕН ОБРАБОТЧИК ТЕГОВ
}

export default function ShopCard({ 
  name, 
  specialty, 
  distance, 
  imageUrl, 
  tags = [],
  onDirectionsPress,
  onMapPress,
  onPress,
  onTagPress
}: ShopCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <View style={styles.cardContainer}>
        {/* Верхняя часть с картинкой */}
        <View style={styles.imageWrapper}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <LinearGradient
            colors={['transparent', '#121212']} 
            style={styles.gradientOverlay}
          />
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        </View>

        {/* Нижняя часть */}
        <View style={styles.contentContainer}>
          <Text style={styles.shopName}>{name}</Text>
          <Text style={styles.specialtyText}>SPECIALTY: {specialty}</Text>

          {/* === ВЫВОД ХЕШТЕГОВ === */}
          {tags && tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {tags.map((tag, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.tagBadge}
                  activeOpacity={0.7}
                  onPress={() => onTagPress && onTagPress(tag)}
                >
                  <Text style={styles.tagText}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.directionsButton} activeOpacity={0.7} onPress={onDirectionsPress}>
              <Text style={styles.directionsText}>DIRECTIONS</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.compassButton} activeOpacity={0.7} onPress={onMapPress}>
              <Ionicons name="compass-outline" size={24} color="#D1FF00" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#121212',
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  imageWrapper: { height: 180, width: '100%', position: 'relative' },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  distanceBadge: { position: 'absolute', top: 16, right: 16, backgroundColor: '#D1FF00', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  distanceText: { color: '#000000', fontWeight: '900', fontSize: 12 },
  
  contentContainer: { padding: 20, paddingTop: 0 },
  shopName: { color: '#ffffff', fontSize: 32, fontWeight: '900', fontStyle: 'italic', textTransform: 'uppercase', marginBottom: 8 },
  specialtyText: { color: '#c1fffe', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold', marginBottom: 16, textTransform: 'uppercase' },
  
  // Стили для тегов
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 },
  tagBadge: { backgroundColor: '#191919', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#262626' },
  tagText: { color: '#ababab', fontSize: 10, fontWeight: 'bold' },

  actionsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  directionsButton: { backgroundColor: '#1f1f1f', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#2c2c2c' },
  directionsText: { color: '#ffffff', fontSize: 12, fontWeight: '900' },
  compassButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D1FF00' }
});