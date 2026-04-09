import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Моковые данные для поста
const MOCK_THREAD = {
  title: "Best needles for scratching high-weight vinyl?",
  author: "DJ_VORTEX",
  avatar: "https://images.unsplash.com/photo-1520028404064-2e92c2a9dd7a?q=80&w=200&auto=format&fit=crop",
  time: "2 HOURS AGO",
  content: "I recently copped some 180g and 200g pressings. My standard Ortofon needles seem to jump a bit during heavy scratching. What are you guys using for the heavy wax? Need something that tracks perfectly.",
  likes: 156,
  replies: [
    { 
      id: "1", 
      author: "WAX_ADDICT", 
      avatar: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=200&auto=format&fit=crop", 
      time: "1 HOUR AGO", 
      text: "Try the Shure M44-7 if you can find them deadstock. Otherwise, Ortofon Scratch MK2 is solid. Just adjust your tonearm weight." 
    },
    { 
      id: "2", 
      author: "SPIN_DOCTOR", 
      avatar: "https://images.unsplash.com/photo-1493225457124-a1a2a40b75b8?q=80&w=200&auto=format&fit=crop", 
      time: "45 MINS AGO", 
      text: "Definitely adjust the weight first. Heavy vinyl needs a bit more tracking force, but don't overdo it or you'll burn the grooves." 
    }
  ]
};

export default function ThreadDetailScreen() {
  const navigation = useNavigation();
  const [replyText, setReplyText] = useState('');

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* 1. ШАПКА */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THREAD</Text>
        <View style={{ width: 44 }} /> {/* Пустой блок для выравнивания заголовка по центру */}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 2. ГЛАВНЫЙ ПОСТ */}
        <View style={styles.originalPost}>
          <Text style={styles.title}>{MOCK_THREAD.title}</Text>
          
          <View style={styles.authorRow}>
            <Image source={{ uri: MOCK_THREAD.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.authorName}>{MOCK_THREAD.author}</Text>
              <Text style={styles.timestamp}>{MOCK_THREAD.time}</Text>
            </View>
          </View>
          
          <Text style={styles.postContent}>{MOCK_THREAD.content}</Text>
          
          <View style={styles.postActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="arrow-up" size={20} color="#D1FF00" />
              <Text style={styles.actionText}>{MOCK_THREAD.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-outline" size={20} color="#757575" />
              <Text style={[styles.actionText, { color: '#757575' }]}>SHARE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 3. КОММЕНТАРИИ */}
        <View style={styles.repliesSection}>
          <Text style={styles.repliesHeader}>REPLIES ({MOCK_THREAD.replies.length})</Text>
          
          {MOCK_THREAD.replies.map((reply) => (
            <View key={reply.id} style={styles.replyCard}>
              <Image source={{ uri: reply.avatar }} style={styles.replyAvatar} />
              <View style={styles.replyBody}>
                <View style={styles.replyHeader}>
                  <Text style={styles.replyAuthor}>{reply.author}</Text>
                  <Text style={styles.replyTime}>{reply.time}</Text>
                </View>
                <Text style={styles.replyText}>{reply.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* 4. ПОЛЕ ДЛЯ ВВОДА ОТВЕТА (Прилипает к низу/клавиатуре) */}
      <View style={styles.inputContainer}>
        <TextInput 
          style={styles.textInput}
          placeholder="ADD A REPLY..."
          placeholderTextColor="#757575"
          value={replyText}
          onChangeText={setReplyText}
          multiline
        />
        <TouchableOpacity 
          style={[styles.sendButton, replyText.length > 0 && styles.sendButtonActive]} 
          activeOpacity={0.8}
        >
          <Ionicons name="send" size={18} color={replyText.length > 0 ? "#000000" : "#757575"} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0e0e0e' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'ios' ? 60 : 40, paddingBottom: 20, paddingHorizontal: 20, backgroundColor: 'rgba(14, 14, 14, 0.9)', zIndex: 10 },
  backButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#191919', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#262626' },
  headerTitle: { color: '#D1FF00', fontSize: 14, fontWeight: '900', letterSpacing: 2, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  scrollContent: { paddingBottom: 40 },
  
  // Оригинальный пост
  originalPost: { padding: 24, borderBottomWidth: 1, borderBottomColor: '#191919' },
  title: { color: '#ffffff', fontSize: 24, fontWeight: '900', textTransform: 'uppercase', marginBottom: 20 },
  authorRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#262626' },
  authorName: { color: '#c1fffe', fontSize: 14, fontWeight: 'bold' },
  timestamp: { color: '#757575', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginTop: 2 },
  postContent: { color: '#ababab', fontSize: 16, lineHeight: 24, marginBottom: 20 },
  postActions: { flexDirection: 'row', gap: 16 },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#191919', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: '#262626' },
  actionText: { color: '#D1FF00', fontSize: 12, fontWeight: 'bold', marginLeft: 6 },

  // Комментарии
  repliesSection: { padding: 24 },
  repliesHeader: { color: '#757575', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 20 },
  replyCard: { flexDirection: 'row', marginBottom: 24 },
  replyAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12, backgroundColor: '#262626' },
  replyBody: { flex: 1 },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  replyAuthor: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  replyTime: { color: '#757575', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  replyText: { color: '#ababab', fontSize: 14, lineHeight: 20 },

  // Ввод
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#111111', borderTopWidth: 1, borderTopColor: '#262626', paddingBottom: Platform.OS === 'ios' ? 34 : 16 },
  textInput: { flex: 1, backgroundColor: '#191919', borderWidth: 1, borderColor: '#262626', borderRadius: 20, color: '#ffffff', fontSize: 14, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, minHeight: 45, maxHeight: 100 },
  sendButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#191919', alignItems: 'center', justifyContent: 'center', marginLeft: 12, borderWidth: 1, borderColor: '#262626' },
  sendButtonActive: { backgroundColor: '#D1FF00', borderColor: '#D1FF00' }
});