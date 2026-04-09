import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface DropCardProps {
  editionLabel?: string; 
  description: string;    
  price: string | number; // Позволяем передавать и числа        
  currency?: string;      // <-- ДОБАВЛЕН ПРОП ДЛЯ ВАЛЮТЫ
  onSecurePress?: () => void; 
  onPress?: () => void; 
}

export default function DropCard({ 
  editionLabel = "КОЛЛЕКЦИОННОЕ ИЗДАНИЕ", 
  description, 
  price, 
  currency = "$", // <-- ЗНАЧЕНИЕ ПО УМОЛЧАНИЮ
  onSecurePress,
  onPress 
}: DropCardProps) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <LinearGradient
        colors={['#8A2BE2', '#FF69B4']} 
        start={{ x: 0.5, y: 0 }}       
        end={{ x: 0.5, y: 1 }}         
        style={styles.borderGradient}
      >
        <View style={styles.cardContent}>
          
          <Text style={styles.headerText}>{editionLabel}</Text>
          
          <Text style={styles.bodyText}>
            {description}
          </Text>

          <View style={styles.buttonContainer}>
            
            <TouchableOpacity style={styles.priceButton} activeOpacity={0.9}>
              <Text style={styles.priceLabel}>ЦЕНА</Text>
              {/* <-- ВЫВОДИМ ВАЛЮТУ И ЦЕНУ --> */}
              <Text style={styles.priceValue}>{currency}{price}</Text> 
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionButton} 
              activeOpacity={0.9} 
              onPress={onSecurePress}
            >
              <Text style={styles.actionButtonText}>ЗАБРОНИРОВАТЬ{'\n'}ДРОП</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  borderGradient: {
    borderRadius: 24, 
    paddingBottom: 2, 
    paddingRight: 2,  
  },
  cardContent: {
    backgroundColor: '#191919', 
    borderRadius: 22, 
    padding: 24,
  },
  headerText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#00FFFF', 
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
  },
  bodyText: {
    fontSize: 16,
    color: '#ffffff', 
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  priceButton: {
    backgroundColor: '#C8FF00', 
    borderRadius: 30, 
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120, 
  },
  priceLabel: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '900',
    color: '#000000',
    marginTop: 2,
  },
  actionButton: {
    backgroundColor: '#ffffff', 
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 140,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
    textTransform: 'uppercase',
  }
});