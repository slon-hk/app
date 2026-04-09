import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';

interface RecordCardProps {
  title: string;          
  subtitle?: string;      
  price: string | number; // Позволяем передавать и числа          
  currency?: string;      // <-- ДОБАВЛЕН ПРОП ДЛЯ ВАЛЮТЫ
  imageUrl: string;       
  badgeText?: string;     
  badgeColor?: string;    
  onPress?: () => void;
}

export default function RecordCard({ 
  title, 
  subtitle,
  price, 
  currency = "$", // <-- ЗНАЧЕНИЕ ПО УМОЛЧАНИЮ
  imageUrl, 
  badgeText,
  badgeColor = '#8A2BE2', 
  onPress 
}: RecordCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.cardContainer} onPress={onPress}>
      <ImageBackground 
        source={{ uri: imageUrl }} 
        style={styles.imageBackground}
        imageStyle={{ borderRadius: 16 }}
      >
        <View style={styles.overlay} />

        {badgeText && (
          <View style={[styles.badge, { backgroundColor: badgeColor }]}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}

        <View style={styles.verticalTextContainer}>
          <Text style={styles.verticalText}>{title}</Text>
        </View>

        <View style={styles.bottomContent}>
          {/* <-- ВЫВОДИМ ВАЛЮТУ И ЦЕНУ --> */}
          <Text style={styles.priceText}>{currency}{price}</Text>
          {subtitle && (
            <Text style={styles.subtitleText}>{subtitle}</Text>
          )}
        </View>

      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 350,
    marginBottom: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', 
    borderRadius: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 20,
    marginLeft: -5, 
    paddingHorizontal: 16,
    paddingVertical: 6,
    transform: [{ rotate: '-5deg' }], 
  },
  badgeText: {
    color: '#ffffff',
    fontWeight: '900',
    fontSize: 10,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  verticalTextContainer: {
    position: 'absolute',
    right: 16,
    top: 40,
    bottom: 40,
    justifyContent: 'center',
  },
  verticalText: {
    color: 'rgba(255, 255, 255, 0.4)', 
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 6,
    textTransform: 'uppercase',
    transform: [{ rotate: '90deg' }],
    width: 300, 
    textAlign: 'center',
  },
  bottomContent: {
    padding: 20,
  },
  priceText: {
    fontSize: 64,
    fontWeight: '900',
    fontStyle: 'italic',
    color: '#D1FF00', 
    lineHeight: 64,
  },
  subtitleText: {
    color: '#ababab',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 4,
  }
});