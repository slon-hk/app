import React from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

// Описываем, какие данные принимает наша карточка
interface HeroCardProps {
  imageUrl: string;
  badgeText: string;
  titleLine1: string;
  titleLine2?: string; // Опциональная вторая строка (знак вопроса значит, что её можно не передавать)
  onPress: () => void; // Функция, которая сработает при нажатии
}

export default function HeroCard({ 
  imageUrl, 
  badgeText, 
  titleLine1, 
  titleLine2, 
  onPress 
}: HeroCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} style={styles.heroCard} onPress={onPress}>
      <Image 
        source={{ uri: imageUrl }} 
        style={styles.heroImage} 
      />
      
      {/* Затемнение картинки для читаемости текста */}
      <View style={styles.heroOverlay} />
      
      {/* Плашка в левом верхнем углу */}
      <View style={styles.badgeContainer}>
        <Text style={styles.badgeText}>{badgeText}</Text>
      </View>
      
      {/* Заголовок внизу */}
      <View style={styles.heroTextContainer}>
        <Text style={styles.heroTitle}>{titleLine1}</Text>
        {/* Если передана вторая строка, рисуем и её */}
        {titleLine2 && <Text style={styles.heroTitle}>{titleLine2}</Text>}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: '100%',
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#191919',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', 
  },
  badgeContainer: {
    position: 'absolute',
    top: 20,
    left: -10,
    backgroundColor: '#cffc00',
    paddingHorizontal: 20,
    paddingVertical: 8,
    transform: [{ rotate: '-12deg' }],
  },
  badgeText: {
    color: '#000000',
    fontWeight: '900',
    fontSize: 18,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  heroTextContainer: {
    position: 'absolute',
    bottom: 24,
    left: 20,
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 56,
    fontWeight: '900',
    textTransform: 'uppercase',
    lineHeight: 60,
  },
});