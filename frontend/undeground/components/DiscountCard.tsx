import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Включаем LayoutAnimation для Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface DiscountCardProps {
  points: number;
  cardNumber: string;
}

export default function DiscountCard({ points, cardNumber }: DiscountCardProps) {
  const [showQR, setShowQR] = useState(false);

  const toggleQR = () => {
    // Плавная анимация при изменении состояния
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowQR(!showQR);
  };

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={toggleQR} style={styles.cardWrapper}>
      <LinearGradient
        colors={['#191919', '#0a0a0a']}
        style={styles.cardContainer}
      >
        {/* Фоновый узор (имитация текстуры) */}
        <View style={styles.bgPattern} />

        {showQR ? (
          // === СОСТОЯНИЕ 2: QR КОД ===
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>SCAN AT CHECKOUT</Text>
            {/* Заглушка для QR-кода */}
            <View style={styles.qrCodeWrapper}>
              <Ionicons name="qr-code" size={120} color="#D1FF00" />
            </View>
            <Text style={styles.cardNumber}>{cardNumber}</Text>
          </View>
        ) : (
          // === СОСТОЯНИЕ 1: ИНФОРМАЦИЯ О БОНУСАХ ===
          <View style={styles.infoContainer}>
            <View style={styles.header}>
              <Text style={styles.clubText}>GROOVE // SYNDICATE</Text>
              <Ionicons name="barcode-outline" size={32} color="#D1FF00" />
            </View>
            
            <View style={styles.pointsWrapper}>
              <Text style={styles.pointsLabel}>AVAILABLE WAX POINTS</Text>
              <Text style={styles.pointsValue}>{points.toLocaleString()}</Text>
            </View>

            <View style={styles.footer}>
              <Text style={styles.cardNumber}>{cardNumber}</Text>
              <View style={styles.tapToScanBadge}>
                <Text style={styles.tapToScanText}>TAP FOR QR</Text>
              </View>
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    shadowColor: '#D1FF00',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 32,
  },
  cardContainer: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#333333',
    minHeight: 200,
    overflow: 'hidden',
  },
  bgPattern: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
    backgroundColor: '#D1FF00',
    // Имитация сетки или полос через бордеры (упрощенно)
  },
  // --- Info State ---
  infoContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  clubText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 2,
  },
  pointsWrapper: {
    marginTop: 20,
  },
  pointsLabel: {
    color: '#c1fffe', // Бирюзовый
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  pointsValue: {
    color: '#D1FF00',
    fontSize: 48,
    fontWeight: '900',
    fontStyle: 'italic',
    letterSpacing: -2,
    marginTop: -4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  cardNumber: {
    color: '#757575',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 4,
  },
  tapToScanBadge: {
    backgroundColor: '#262626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#484848',
  },
  tapToScanText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // --- QR State ---
  qrContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qrTitle: {
    color: '#D1FF00',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 16,
  },
  qrCodeWrapper: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  }
});