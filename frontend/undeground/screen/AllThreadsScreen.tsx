import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ThreadCard from '../components/ThreadCard';
import { RootStackParamList } from '../types/navigation';
import testData from '../data/test_data.json'; // Берем наши фейковые данные

type AllThreadsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllThreads'>;

export default function AllThreadsScreen() {
  const navigation = useNavigation<AllThreadsScreenNavigationProp>();
  const [threads, setThreads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Имитируем загрузку
    const timer = setTimeout(() => {
      // Для красоты можно продублировать массив, чтобы список казался длиннее
      setThreads([...testData.active_threads, ...testData.active_threads]); 
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      
      {/* КАСТОМНАЯ ШАПКА С КНОПКОЙ НАЗАД */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>FORUM_HUB</Text>
          <Text style={styles.headerSubtitle}>// ALL ACTIVE DISCUSSIONS</Text>
        </View>
        <View style={{ width: 44 }} /> {/* Балансир для центрирования текста */}
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D1FF00" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.threadsList}>
            {threads.map((thread: any, index: number) => (
              <View key={`${thread.id}-${index}`} style={styles.threadWrapper}>
                <ThreadCard 
                  title={thread.title}
                  repliesCount={thread.replies_count}
                  rating={thread.rating}
                  borderColor={thread.border_color}
                  onPress={() => {
                    navigation.navigate('ThreadDetail');
                  }}
                />
              </View>
            ))}
          </View>

        </ScrollView>
      )}

      {/* ПЛАВАЮЩАЯ КНОПКА ДЛЯ СОЗДАНИЯ НОВОГО ТРЕДА */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.9}>
        <Ionicons name="add" size={32} color="#000000" />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'rgba(14, 14, 14, 0.9)', zIndex: 10 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#191919', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#262626' },
  headerTitleContainer: { alignItems: 'center' },
  headerTitle: { color: '#D1FF00', fontSize: 18, fontWeight: '900', letterSpacing: 2 },
  headerSubtitle: { color: '#757575', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold', marginTop: 2 },
  
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 100 },
  threadsList: { width: '100%' },
  
  // Добавляем отступ вниз для каждой карточки, чтобы они не слипались
  threadWrapper: { marginBottom: 16 },

  // Floating Action Button (Плавающая кнопка)
  fab: { position: 'absolute', bottom: Platform.OS === 'ios' ? 40 : 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#D1FF00', alignItems: 'center', justifyContent: 'center', shadowColor: '#D1FF00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 }
});