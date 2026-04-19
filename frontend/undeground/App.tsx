import 'react-native-gesture-handler'; // Обязательный импорт для работы жестов
import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native'; 
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // Импортируем обертку

import BottomMenu from "./components/BottomMenu";
import HomeScreen from "./screen/HomeScreen"; 
import DiscoveryScreen from "./screen/DiscoveryScreen";
import MapScreen from "./screen/MapScreen";
import FavoritesScreen from "./screen/FavoritesScreen";
import ProfileScreen from "./screen/ProfileSreen";
import ItemDetailScreen from './screen/ItemDetailScreen';
import CartScreen from './screen/CartScreen';
import AllThreadsScreen from './screen/AllThreadsScreen';
import ThreadDetailScreen from './screen/ThreadDetailScreen';
import ShopDetailScreen from './screen/ShopDetailScreen';
import NotificationsScreen from './screen/NotificationsScreen';
import NotificationDetailScreen from './screen/NotificationDetailScreen';
import PublicProfileScreen from './screen/PublicProfileScreen';
import CreateThreadScreen from './screen/CreateThreadScreen';
import LoginScreen from './screen/LoginScreen';
import RegisterScreen from './screen/RegisterScreen';

import { FavoritesProvider } from './context/FavoritesContext';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { PreorderProvider } from './context/PreorderContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Импорт типов навигации
import { RootStackParamList, MainTabParamList } from './types/navigation';

const Tab = createBottomTabNavigator<MainTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// 1. Оборачиваем все твои вкладки в отдельный компонент MainTabs
function MainTabs() {
  return (
    <Tab.Navigator 
      tabBar={(props) => <BottomMenu {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Search" component={DiscoveryScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Auth Stack for Login/Register
function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

// Main App Navigator
function RootNavigator() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00bfff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isSignedIn ? (
          // App Stack - только если пользователь авторизован
          <Stack.Group>
            {/* Главный экран приложения — это наши вкладки с нижним меню */}
            <Stack.Screen name="MainTabs" component={MainTabs} />
            
            {/* Страницы, которые открываются ПОВЕРХ нижнего меню */}
            <Stack.Screen name="AllThreads" component={AllThreadsScreen} />
            <Stack.Screen name="ThreadDetail" component={ThreadDetailScreen} />
            <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
            <Stack.Screen name="ShopDetail" component={ShopDetailScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="PublicProfile" component={PublicProfileScreen} />
            <Stack.Screen name="NotificationDetail" component={NotificationDetailScreen} />
            <Stack.Screen name="CreateThread" component={CreateThreadScreen} />
          </Stack.Group>
        ) : (
          // Auth Stack
          <Stack.Group screenOptions={{ animationEnabled: false }}>
            <Stack.Screen name="Auth" component={AuthStack} />
          </Stack.Group>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// 2. В главном App используем Stack.Navigator
export default function App() {
  return (
    // Оборачиваем всё приложение в GestureHandlerRootView со стилем flex: 1
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NotificationProvider>
          <FavoritesProvider>
            <CartProvider>
              <PreorderProvider>
                <RootNavigator />
              </PreorderProvider>
            </CartProvider>
          </FavoritesProvider>
        </NotificationProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#0e0e0e', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenText: {
    color: '#D1FF00', 
    fontSize: 32,
    fontWeight: '900',
    fontStyle: 'italic',
    textTransform: 'uppercase',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    justifyContent: 'center',
    alignItems: 'center',
  },
});