import React, { useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// Импортируем типы для кастомного бара
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'; 

// 1. Наш анимированный компонент остается почти без изменений
const AnimatedTab = ({ iconName, isActive, onPress }: { iconName: any, isActive: boolean, onPress: () => void }) => {
  const animValue = useRef(new Animated.Value(isActive ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isActive ? 1 : 0,
      useNativeDriver: false,
      bounciness: 10,
      speed: 12,
    }).start();
  }, [isActive]);

  const translateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -18],
  });

  const backgroundColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['transparent', '#D1FF00'],
  });

  const glowScale = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.5, 1.6],
  });

  const glowOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.4],
  });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={[styles.iconContainer, { zIndex: isActive ? 10 : 1 }]}>
      <Animated.View style={[styles.glowLayer, { transform: [{ translateY }, { scale: glowScale }], opacity: glowOpacity }]} />
      <Animated.View style={[styles.glowLayer, { transform: [{ translateY }, { scale: animValue.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.2] }) }], opacity: animValue.interpolate({ inputRange: [0, 1], outputRange: [0, 0.6] }) }]} />
      <Animated.View style={[
        styles.animatedCircle,
        {
          transform: [{ translateY }],
          backgroundColor,
          shadowColor: '#D1FF00',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isActive ? 0.8 : 0,
          shadowRadius: 10,
        }
      ]}>
        <Ionicons name={iconName} size={26} color={isActive ? '#000000' : '#757575'} />
      </Animated.View>
    </TouchableOpacity>
  );
};

// 2. Обновленный главный компонент (теперь принимает пропсы от навигатора)
export default function BottomMenu({ state, descriptors, navigation }: BottomTabBarProps) {
  
  // Функция для подбора иконки по имени маршрута (экрана)
  const getIconName = (routeName: string) => {
    switch(routeName) {
      case 'Home': return 'home';
      case 'Search': return 'search';
      case 'Map': return 'map';
      case 'Favorites': return 'heart';
      case 'Profile': return 'person';
      default: return 'ellipse'; // Иконка по умолчанию, если что-то пойдет не так
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.navBar}>
        {/* React Navigation сам передает нам список экранов (state.routes), мы по ним проходимся */}
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name); // Переход на экран
            }
          };

          return (
            <AnimatedTab 
              key={route.key}
              iconName={getIconName(route.name)}
              isActive={isFocused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  navBar: {
    flexDirection: 'row',
    backgroundColor: '#191919',
    width: '90%',
    height: 70,
    borderRadius: 40,
    justifyContent: 'space-around', // Равномерно распределяем кнопки
    alignItems: 'center',
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 20,

    borderWidth: 1,
    borderColor: 'rgba(209, 255, 0, 0.1)',

    shadowColor: '#D1FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 30,
    elevation: 20,
  },
  iconContainer: {
    // Зона нажатия
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedCircle: {
    // Сам визуальный круг, который будет светиться
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  }
});


