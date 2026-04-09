import { NavigatorScreenParams } from '@react-navigation/native';

// Типы для Stack Navigator
export type RootStackParamList = {
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ItemDetail: { id: string };
  AllThreads: undefined; // Экран списка всех тредов
  ThreadDetail: undefined; // Экран подробностей треда
  ShopDetail: { id: string }; // Экран подробностей магазина
  Cart: undefined;
};

// Типы для Tab Navigator
export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  Map: undefined;
  Favorites: undefined;
  Profile: undefined;
};

// Типы для навигации
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}