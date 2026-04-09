import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';

// === ИЗМЕНЯЕМАЯ ВАЛЮТА ===
const CURRENCY = "₽";

export default function CartScreen() {
  const navigation = useNavigation<any>();
  
  // Достаем cartItems прямо из контекста
  const { cartItems, removeFromCart } = useCart();

  // Считаем сумму напрямую из данных, которые лежат в корзине (без поиска по JSON)
  const calculateTotal = () => {
    return cartItems.reduce((sum, cartItem: any) => {
      // Очищаем цену (например, "₽48" -> 48)
      const priceValue = parseInt(String(cartItem.price).replace(/[^0-9]/g, '')) || 0;
      return sum + (priceValue * (cartItem.quantity || 1));
    }, 0);
  };

  // Обработчик покупки
  const handleCheckout = () => {
    Alert.alert(
      "SECURE CHECKOUT", 
      "Ваш заказ успешно оформлен! Мы свяжемся с вами для уточнения деталей доставки.",
      [
        { 
          text: "ОК", 
          onPress: () => navigation.goBack() // Закрываем корзину после оформления
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="close" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>YOUR BAG</Text>
        <View style={{ width: 28 }} />
      </View>

      {cartItems.length > 0 ? (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {cartItems.map((cartItem: any, index: number) => {
              // Очищаем цену для красивого вывода
              const numericPrice = String(cartItem.price).replace(/[^\d\s.,]/g, '').trim();

              return (
                <View key={cartItem.id || index} style={styles.itemCard}>
                  
                  {/* === АКТИВНАЯ КАРТОЧКА: Переход на экран товара === */}
                  <TouchableOpacity 
                    style={styles.itemCardContent}
                    activeOpacity={0.8}
                    onPress={() => {
                      // Если переходим из корзины, закрываем её и открываем товар
                      navigation.goBack();
                      setTimeout(() => {
                        navigation.navigate('ItemDetail', { id: cartItem.id });
                      }, 100);
                    }}
                  >
                    <Image source={{ uri: cartItem.image_url }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemTitle} numberOfLines={1}>
                        {cartItem.title}
                      </Text>
                      {/* Отрисовка цены с нашей валютой */}
                      <Text style={styles.itemPrice}>{CURRENCY}{numericPrice}</Text>
                    </View>
                  </TouchableOpacity>

                  {/* Кнопка удаления */}
                  <TouchableOpacity 
                    style={styles.removeButton} 
                    onPress={() => removeFromCart(cartItem.id)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Ionicons name="trash-outline" size={20} color="#757575" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>TOTAL ESTIMATE</Text>
              <Text style={styles.totalPrice}>{CURRENCY}{calculateTotal().toLocaleString()}</Text>
            </View>

            {/* === АКТИВНАЯ КНОПКА ПОКУПКИ === */}
            <TouchableOpacity 
              style={styles.checkoutButton} 
              activeOpacity={0.8}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>SECURE CHECKOUT</Text>
              <Ionicons name="shield-checkmark" size={18} color="#000000" />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#191919" />
          <Text style={styles.emptyText}>BAG IS EMPTY</Text>
          <TouchableOpacity 
            style={styles.goShopButton} 
            activeOpacity={0.8}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.goShopText}>GO DIGGING</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 60, paddingHorizontal: 20, paddingBottom: 20 },
  headerTitle: { color: '#D1FF00', fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  
  itemCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#191919', 
    borderRadius: 16, 
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#262626',
    paddingRight: 12 
  },
  itemCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  
  itemImage: { width: 70, height: 70, borderRadius: 8, backgroundColor: '#262626' },
  itemInfo: { flex: 1, marginLeft: 16 },
  itemTitle: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
  itemPrice: { color: '#D1FF00', fontSize: 16, fontWeight: '900', marginTop: 4 },
  removeButton: { padding: 12 },
  
  footer: { backgroundColor: '#111111', padding: 24, borderTopWidth: 1, borderTopColor: '#262626', paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalLabel: { color: '#757575', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },
  totalPrice: { color: '#ffffff', fontSize: 28, fontWeight: '900' },
  checkoutButton: { backgroundColor: '#D1FF00', height: 60, borderRadius: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, shadowColor: '#D1FF00', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  checkoutText: { color: '#000000', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#191919', fontSize: 24, fontWeight: '900', marginTop: 16 },
  goShopButton: { marginTop: 24, paddingHorizontal: 30, paddingVertical: 14, borderRadius: 24, borderWidth: 1, borderColor: '#D1FF00' },
  goShopText: { color: '#D1FF00', fontSize: 12, fontWeight: '900', letterSpacing: 1 }
});