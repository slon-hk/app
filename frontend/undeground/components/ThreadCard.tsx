import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThreadCardProps {
  title: string;
  repliesCount: number;
  rating: number;
  tags?: string[];
  borderColor?: string; 
  fullWidth?: boolean;
  onPress?: () => void;
  onTagPress?: (tag: string) => void; // <-- ДОБАВЛЕН ОБРАБОТЧИК КЛИКА ПО ТЕГУ
}

export default function ThreadCard({ 
  title, 
  repliesCount, 
  rating, 
  tags = [], 
  borderColor = '#cffc00', 
  fullWidth = false,
  onPress,
  onTagPress // <-- ПРИНИМАЕМ ЕГО
}: ThreadCardProps) {
  
  // Определяем цвет и иконку на основе рейтинга (строго 1 стрелка)
  const isPositive = rating >= 0;
  const ratingColor = isPositive ? '#D1FF00' : '#ff3333';
  const ratingIcon = isPositive ? 'arrow-up' : 'arrow-down';
  const displayRating = rating;

  return (
    <TouchableOpacity 
      style={[
        styles.card, 
        { borderLeftColor: borderColor },
        fullWidth && styles.cardFullWidth
      ]} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* === КЛИКАБЕЛЬНЫЕ ХЕШТЕГИ === */}
        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <TouchableOpacity 
                key={index} 
                activeOpacity={0.7}
                onPress={() => onTagPress && onTagPress(tag)} // <-- ВЫЗЫВАЕМ ФУНКЦИЮ ПРИ КЛИКЕ
              >
                <Text style={styles.tagText}>#{tag.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.ratingContainer}>
          <Ionicons name={ratingIcon} size={14} color={ratingColor} />
          <Text style={[styles.ratingText, { color: ratingColor }]}>
            {displayRating}
          </Text>
        </View>

        <Text style={styles.repliesText}>{repliesCount} REPLIES</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { width: 280, backgroundColor: '#191919', padding: 20, borderRadius: 12, borderLeftWidth: 4, marginRight: 16, justifyContent: 'space-between', minHeight: 140 },
  cardFullWidth: { width: '100%', marginRight: 0 },
  title: { color: '#ffffff', fontSize: 18, fontWeight: 'bold', marginBottom: 8, lineHeight: 24 },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  tagText: { color: '#ababab', fontSize: 12, fontWeight: 'bold', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#262626', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, gap: 4 },
  ratingText: { fontWeight: '900', fontSize: 12 },
  repliesText: { color: '#757575', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold', letterSpacing: 1 }
});