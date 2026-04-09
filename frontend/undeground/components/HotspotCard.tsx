import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface HotspotCardProps {
  title: string;
  distance: string;
  description?: string; 
  tags?: string[];      
  imageUrl: string;
  onDirectionsPress?: () => void;
  onFavoritePress?: () => void;
  onPress?: () => void;
}

export default function HotspotCard({ 
  title, 
  distance, 
  description = '', 
  tags = [], 
  imageUrl, 
  onDirectionsPress,
  onFavoritePress,
  onPress
}: HotspotCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <LinearGradient
        colors={['#FF51FA', '#8A2BE2']} 
        start={{ x: 1, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
      <View style={styles.cardContent}>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.image} />
          <View style={styles.distanceBadge}>
            <Text style={styles.distanceText}>{distance}</Text>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.titleText}>{title}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>OPEN{'\n'}NOW</Text>
            </View>
          </View>

          {/* Жестко фиксируем высоту текста. Если строк меньше - будет пустое место, если больше - обрежется */}
          <Text style={styles.descriptionText} numberOfLines={2} ellipsizeMode="tail">
            {description}
          </Text>

          {/* Жестко фиксируем высоту тегов */}
          <View style={styles.tagsContainer}>
            {tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tagBadge}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Кнопки всегда будут на одном и том же месте */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.directionsButton} 
            activeOpacity={0.8}
            onPress={onDirectionsPress}
          >
            <Text style={styles.directionsText}>GET DIRECTIONS</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.favoriteButton} 
            activeOpacity={0.8}
            onPress={onFavoritePress}
          >
            <Ionicons name="heart-outline" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

      </View>
    </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gradientBorder: {
    borderRadius: 24,
    paddingRight: 4, 
    marginBottom: 20,
    marginHorizontal: 16,
  },
  cardContent: {
    backgroundColor: '#191919',
    borderRadius: 24,
    padding: 16,
    height: 390, // ФИКС: Увеличили общую высоту карточки
  },
  imageContainer: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  distanceBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#D1FF00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  distanceText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  contentContainer: {
    flex: 1, 
    marginBottom: 16, // Отступ от контента до кнопок
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: -0.5,
    maxWidth: '75%',
  },
  statusBadge: {
    backgroundColor: '#D1FF00',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    color: '#000000',
    fontSize: 10,
    fontWeight: '900',
    textAlign: 'center',
  },
  descriptionText: {
    color: '#ababab',
    fontSize: 12,
    lineHeight: 18,
    height: 36, // ФИКС: Жесткая высота ровно под 2 строки (18 * 2)
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    height: 28, // ФИКС: Жесткая высота под один ряд тегов
    overflow: 'hidden', // Обрезаем всё, что не влезло (если тегов слишком много)
  },
  tagBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  tagText: {
    color: '#c1fffe',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  directionsButton: {
    flex: 1,
    backgroundColor: '#D1FF00',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    shadowColor: '#D1FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  directionsText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '900',
  },
  favoriteButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#484848',
    alignItems: 'center',
    justifyContent: 'center',
  }
});