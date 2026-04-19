import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  ActivityIndicator,
  TextInput // <-- ДОБАВИЛИ ИМПОРТ
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import ThreadCard from '../components/ThreadCard';
import { RootStackParamList } from '../types/navigation';
import testData from '../data/test_data.json'; 

type AllThreadsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AllThreads'>;

export default function AllThreadsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const [threads, setThreads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // === СОСТОЯНИЕ ПОИСКА ===
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setThreads([...testData.active_threads, ...testData.active_threads]); 
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Слушаем, не передали ли нам тег из другого экрана
  useEffect(() => {
    if (route.params?.query) {
      setSearchQuery(route.params.query);
    }
  }, [route.params?.query]);

  // === ЛОГИКА ФИЛЬТРАЦИИ ТРЕДОВ ===
  const filteredThreads = threads.filter(thread => {
    const query = searchQuery.toLowerCase().trim();
    if (query === '') return true;

    // Ищем совпадения в названии треда или в его тегах
    const matchTitle = thread.title?.toLowerCase().includes(query);
    // Убираем символ # из тега при поиске, чтобы искать чистые слова
    const matchTags = thread.tags?.some((tag: string) => 
      tag.toLowerCase().replace('#', '').includes(query.replace('#', ''))
    );

    return matchTitle || matchTags;
  });

  return (
    <View style={styles.container}>
      
      {/* ШАПКА */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>FORUM_HUB</Text>
          <Text style={styles.headerSubtitle}>// ALL ACTIVE DISCUSSIONS</Text>
        </View>
        <View style={{ width: 44 }} /> 
      </View>

      {/* === ПОИСКОВАЯ СТРОКА === */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#757575" style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="SEARCH DISCUSSIONS..."
          placeholderTextColor="#757575"
          value={searchQuery}
          onChangeText={setSearchQuery}
          selectionColor="#D1FF00"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Ionicons name="close-circle" size={20} color="#757575" />
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#D1FF00" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.threadsList}>
            {filteredThreads.length > 0 ? (
              filteredThreads.map((thread: any, index: number) => (
                <View key={`${thread.id}-${index}`} style={styles.threadWrapper}>
                  <ThreadCard 
                    title={thread.title}
                    repliesCount={thread.replies_count}
                    rating={thread.rating}
                    borderColor={thread.border_color}
                    tags={thread.tags}
                    fullWidth={true}
                    onPress={() => navigation.navigate('ThreadDetail', { id: thread.id })}
                    
                    // === ОБРАБОТЧИК КЛИКА ПО ТЕГУ ===
                    onTagPress={(tag) => {
                      // При клике на тег, текст подставляется в строку поиска
                      setSearchQuery(tag);
                    }}
                  />
                </View>
              ))
            ) : (
              // Состояние "ничего не найдено"
              <View style={styles.emptyStateContainer}>
                <Ionicons name="chatbubbles-outline" size={64} color="#191919" />
                <Text style={styles.emptyStateText}>NO THREADS FOUND</Text>
              </View>
            )}
          </View>

        </ScrollView>
      )}

      {/* === АКТИВНАЯ КНОПКА СОЗДАНИЯ ПОСТА === */}
      <TouchableOpacity
        style={styles.fab} 
        activeOpacity={0.9}
        onPress={() => navigation.navigate('CreateThread')} // <-- Переход на экран создания треда
      >
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
  
  // Стили поиска
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#191919', marginHorizontal: 20, marginTop: 10, borderRadius: 30, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#262626', zIndex: 5 },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, color: '#ffffff', fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  threadsList: { width: '100%' },
  threadWrapper: { marginBottom: 16 },

  emptyStateContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 60 },
  emptyStateText: { color: '#262626', fontSize: 18, fontWeight: '900', marginTop: 16, letterSpacing: 1 },

  // Плавающая кнопка
  fab: { position: 'absolute', bottom: Platform.OS === 'ios' ? 40 : 30, right: 20, width: 60, height: 60, borderRadius: 30, backgroundColor: '#D1FF00', alignItems: 'center', justifyContent: 'center', shadowColor: '#D1FF00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 8 }
});