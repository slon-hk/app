import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThreadCardProps {
  title: string;
  repliesCount: number;
  rating: number;
  tags?: string[];
  borderColor?: string; 
  onPress?: () => void;
}

export default function ThreadCard({ 
  title, 
  repliesCount, 
  rating, 
  tags = [], // <-- ПО УМОЛЧАНИЮ ПУСТОЙ МАССИВ
  borderColor = '#cffc00', 
  onPress 
}: ThreadCardProps) {
  
  // Определяем цвет и иконку на основе рейтинга
  const isPositive = rating >= 0;
  const ratingColor = isPositive ? '#D1FF00' : '#ff3333';
  const ratingIcon = isPositive ? 'arrow-up' : 'arrow-down';

  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: borderColor }]} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View>
        <Text style={styles.title} numberOfLines={2}>
          {title}
        </Text>

        {/* <-- ВЫВОДИМ ТЕГИ --> */}
        {tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {tags.map((tag, index) => (
              <Text key={index} style={styles.tagText}>#{tag.toUpperCase()}</Text>
            ))}
          </View>
        )}
      </View>

      <View style={styles.footer}>
        <View style={styles.ratingContainer}>
          {/* <-- ПОКАЗЫВАЕМ ТОЛЬКО ОДНУ СТРЕЛКУ СОГЛАСНО РЕЙТИНГУ --> */}
          <Ionicons name={ratingIcon} size={14} color={ratingColor} />
          {/* Показываем абсолютное значение (без минуса) */}
          <Text style={[styles.ratingText, { color: ratingColor }]}>
            {rating}
          </Text>
        </View>

        <Text style={styles.repliesText}>{repliesCount} REPLIES</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 280,
    backgroundColor: '#191919',
    padding: 20,
    borderRadius: 12,
    borderLeftWidth: 4,
    marginRight: 16,
    justifyContent: 'space-between', 
    minHeight: 140, 
  },
  title: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8, // Уменьшили отступ, так как ниже будут теги
    lineHeight: 24,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16, // Отступ до футера
  },
  tagText: {
    color: '#ababab',
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262626',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4, 
  },
  ratingText: {
    fontWeight: '900',
    fontSize: 12,
  },
  repliesText: {
    color: '#757575', 
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
  }
});