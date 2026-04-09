import React, { createContext, useState, useContext, ReactNode } from 'react';

// 1. Расширяем интерфейс, чтобы он мог хранить все данные о пластинке
export interface CartItem {
  id: string;
  title: string;
  price: string | number;
  image_url: string;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  // Теперь функция принимает объект типа CartItem, а не просто id
  addToCart: (item: CartItem) => void; 
  removeFromCart: (id: string) => void;
  getTotalItems: () => number;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      // Ищем, есть ли уже такой товар
      const existing = prev.find(item => item.id === newItem.id);
      
      if (existing) {
        // Если есть, не добавляем дубликат (или можно увеличить quantity, если нужно)
        return prev;
      }
      
      // Если нет, добавляем весь объект целиком
      return [...prev, newItem];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter(item => item.id !== id));
  };

  const getTotalItems = () => cartItems.length;

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, getTotalItems, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};