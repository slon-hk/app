import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  Platform,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function PublicProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();
  
  // Получаем данные пользователя из параметров навигации
  const username = route.params?.username || "UNKNOWN_USER";
  const avatar = route.params?.avatar || "https://images.unsplash.com/photo-1520028404064-2e92c2a9dd7a?q=80&w=200&auto=format&fit=crop";

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* === 1. ШАПКА: ГРАДИЕНТ И КНОПКА НАЗАД === */}
        <View style={styles.coverContainer}>
          <LinearGradient
            colors={['#1a1a1a', '#0e0e0e']}
            style={styles.gradientOverlay}
          />
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* === 2. ИНФОРМАЦИЯ О ПОЛЬЗОВАТЕЛЕ === */}
        <View style={styles.infoContainer}>
          {/* Аватарка, которая наполовину залезает на шапку */}
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
          </View>
          
          <Text style={styles.username}>{username}</Text>
          
          <View style={styles.badge}>
            <Text style={styles.badgeText}>COMMUNITY MEMBER</Text>
          </View>

          {/* Статистика */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>1.2K</Text>
              <Text style={styles.statLabel}>KARMA</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>42</Text>
              <Text style={styles.statLabel}>THREADS</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>18</Text>
              <Text style={styles.statLabel}>WAX IN VAULT</Text>
            </View>
          </View>

          {/* Кнопка подписки/сообщения (визуальная) */}
          <View style={styles.actionsRow}>
            <TouchableOpacity style={styles.followButton} activeOpacity={0.8}>
              <Text style={styles.followButtonText}>FOLLOW</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.messageButton} activeOpacity={0.8}>
              <Ionicons name="chatbubble-outline" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* === 3. ПОСЛЕДНЯЯ АКТИВНОСТЬ (Заглушка) === */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>RECENT ACTIVITY</Text>
          
          <View style={styles.activityCard}>
            <Text style={styles.activityAction}>Started a new thread in <Text style={{color: '#D1FF00'}}>#GEAR</Text></Text>
            <Text style={styles.activityTarget}>"Best needles for scratching high-weight vinyl?"</Text>
            <Text style={styles.activityTime}>2 HOURS AGO</Text>
          </View>

          <View style={styles.activityCard}>
            <Text style={styles.activityAction}>Secured a new release</Text>
            <Text style={styles.activityTarget}>CYBER_STORM.WAV</Text>
            <Text style={styles.activityTime}>YESTERDAY</Text>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  scrollContent: { paddingBottom: 40 },
  
  coverContainer: { width: width, height: 180, position: 'relative' },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 60 : 40, left: 20, width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(25, 25, 25, 0.6)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#333333' },

  infoContainer: { paddingHorizontal: 24, marginTop: -50, alignItems: 'center' },
  avatarWrapper: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#0e0e0e', padding: 4, marginBottom: 16 },
  avatar: { width: '100%', height: '100%', borderRadius: 46, backgroundColor: '#262626' },
  
  username: { color: '#ffffff', fontSize: 28, fontWeight: '900', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 },
  badge: { backgroundColor: '#191919', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#262626', marginBottom: 24 },
  badgeText: { color: '#c1fffe', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginBottom: 32 },
  statBox: { alignItems: 'center' },
  statValue: { color: '#ffffff', fontSize: 20, fontWeight: '900', marginBottom: 4 },
  statLabel: { color: '#757575', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', fontWeight: 'bold' },

  actionsRow: { flexDirection: 'row', width: '100%', gap: 12, marginBottom: 40 },
  followButton: { flex: 1, backgroundColor: '#D1FF00', height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center' },
  followButtonText: { color: '#000000', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
  messageButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#191919', borderWidth: 1, borderColor: '#262626', alignItems: 'center', justifyContent: 'center' },

  activitySection: { paddingHorizontal: 24 },
  sectionTitle: { color: '#ffffff', fontSize: 18, fontWeight: '900', textTransform: 'uppercase', marginBottom: 16 },
  activityCard: { backgroundColor: '#111111', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#191919', marginBottom: 12 },
  activityAction: { color: '#ababab', fontSize: 12, marginBottom: 8 },
  activityTarget: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  activityTime: { color: '#757575', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }
});