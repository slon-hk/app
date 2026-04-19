import { NavigatorScreenParams } from '@react-navigation/native';

// Типы для Stack Navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ItemDetail: { id: string };
  AllThreads: undefined;
  ThreadDetail: undefined;
  ShopDetail: { id: string };
  Cart: undefined;
  Notifications: undefined;
  NotificationDetail: { id: string };
  PublicProfile: { userId: string };
  CreateThread: undefined;
};

// Типы для Auth Stack Navigator
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
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