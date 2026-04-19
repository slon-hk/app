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
  KeyboardAvoidingView,
  Share 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Обновленные моковые данные
const INITIAL_THREAD_DATA = {
  id: "thread_101",
  title: "Best needles for scratching high-weight vinyl?",
  author: "DJ_VORTEX",
  avatar: "https://images.unsplash.com/photo-1520028404064-2e92c2a9dd7a?q=80&w=200&auto=format&fit=crop",
  time: "2 HOURS AGO",
  content: "I recently copped some 180g and 200g pressings. My standard Ortofon needles seem to jump a bit during heavy scratching. What are you guys using for the heavy wax? Need something that tracks perfectly.",
  likes: 156,
  tags: ["#GEAR", "#DJ", "#HARDWARE"],
  replies: [
    { 
      id: "1", 
      author: "WAX_ADDICT", 
      avatar: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=200&auto=format&fit=crop", 
      time: "1 HOUR AGO", 
      text: "Try the Shure M44-7 if you can find them deadstock. Otherwise, Ortofon Scratch MK2 is solid. Just adjust your tonearm weight.",
      subReplies: [
        {
          id: "1-1",
          author: "DJ_VORTEX",
          avatar: "https://images.unsplash.com/photo-1520028404064-2e92c2a9dd7a?q=80&w=200&auto=format&fit=crop",
          time: "40 MINS AGO",
          text: "Thanks! Hard to find deadstock these days, but I'll look into it."
        }
      ]
    },
    { 
      id: "2", 
      author: "SPIN_DOCTOR", 
      avatar: "https://images.unsplash.com/photo-1493225457124-a1a2a40b75b8?q=80&w=200&auto=format&fit=crop", 
      time: "45 MINS AGO", 
      text: "Definitely adjust the weight first. Heavy vinyl needs a bit more tracking force, but don't overdo it or you'll burn the grooves.",
      subReplies: []
    }
  ]
};

export default function ThreadDetailScreen() {
  const navigation = useNavigation<any>();
  
  // === СТЕЙТЫ ===
  const [threadData, setThreadData] = useState(INITIAL_THREAD_DATA);
  const [replyText, setReplyText] = useState('');
  
  const [rating, setRating] = useState(threadData.likes);
  const [voteStatus, setVoteStatus] = useState<'up' | 'down' | null>(null);

  const [replyingTo, setReplyingTo] = useState<{id: string, author: string} | null>(null);
  const [hiddenReplies, setHiddenReplies] = useState<Record<string, boolean>>({});

  // === ЛОГИКА ГОЛОСОВАНИЯ ===
  const handleVote = (type: 'up' | 'down') => {
    if (type === 'up') {
      if (voteStatus === 'up') {
        setRating(rating - 1); setVoteStatus(null);
      } else {
        setRating(voteStatus === 'down' ? rating + 2 : rating + 1); setVoteStatus('up');
      }
    } else {
      if (voteStatus === 'down') {
        setRating(rating + 1); setVoteStatus(null);
      } else {
        setRating(voteStatus === 'up' ? rating - 2 : rating - 1); setVoteStatus('down');
      }
    }
  };

  // === ЛОГИКА ПОДЕЛИТЬСЯ ===
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this thread on GrooveSync: "${threadData.title}"\n\nJoin the discussion!`,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // === ОТПРАВКА КОММЕНТАРИЯ ===
  const handleSendReply = () => {
    if (!replyText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      author: "YOU",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop", 
      time: "JUST NOW",
      text: replyText.trim(),
      subReplies: []
    };

    if (replyingTo) {
      setThreadData(prev => ({
        ...prev,
        replies: prev.replies.map(reply => {
          if (reply.id === replyingTo.id) {
            return { ...reply, subReplies: [...reply.subReplies, newComment] };
          }
          return reply;
        })
      }));
      setHiddenReplies(prev => ({ ...prev, [replyingTo.id]: false }));
    } else {
      setThreadData(prev => ({
        ...prev,
        replies: [...prev.replies, newComment]
      }));
    }

    setReplyText('');
    setReplyingTo(null);
  };

  // === ПЕРЕХОД В ПРОФИЛЬ ===
  const handleProfilePress = (name: string, avatarUrl: string) => {
    if (name !== "YOU") { 
      navigation.navigate('PublicProfile', { username: name, avatar: avatarUrl });
    }
  };

  // === ИЗМЕНЕННАЯ ФУНКЦИЯ: ПЕРЕХОД НА ALL THREADS ===
  const handleTagPress = (tag: string) => {
    // Теперь мы направляем пользователя на экран AllThreads и передаем тег
    navigation.navigate('AllThreads', { query: tag });
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color="#ffffff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>THREAD</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* === ГЛАВНЫЙ ПОСТ === */}
        <View style={styles.originalPost}>
          <Text style={styles.title}>{threadData.title}</Text>
          
          <View style={styles.authorRow}>
            <TouchableOpacity onPress={() => handleProfilePress(threadData.author, threadData.avatar)} activeOpacity={0.8}>
              <Image source={{ uri: threadData.avatar }} style={styles.avatar} />
            </TouchableOpacity>
            <View>
              <TouchableOpacity onPress={() => handleProfilePress(threadData.author, threadData.avatar)} activeOpacity={0.8}>
                <Text style={styles.authorName}>{threadData.author}</Text>
              </TouchableOpacity>
              <Text style={styles.timestamp}>{threadData.time}</Text>
            </View>
          </View>
          
          <Text style={styles.postContent}>{threadData.content}</Text>
          
          <View style={styles.tagsContainer}>
            {threadData.tags.map((tag, index) => (
              <TouchableOpacity key={index} style={styles.tagBadge} onPress={() => handleTagPress(tag)}>
                <Text style={styles.tagText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.postActions}>
            <View style={styles.voteContainer}>
              <TouchableOpacity style={[styles.voteButton, voteStatus === 'up' && styles.voteButtonActiveUp]} onPress={() => handleVote('up')}>
                <Ionicons name="arrow-up" size={18} color={voteStatus === 'up' ? "#000000" : "#D1FF00"} />
              </TouchableOpacity>
              
              <View style={styles.ratingTextContainer}>
                <Text style={[styles.ratingText, voteStatus === 'up' && {color: '#D1FF00'}, voteStatus === 'down' && {color: '#ff3333'}]}>
                  {rating}
                </Text>
              </View>
              
              <TouchableOpacity style={[styles.voteButton, voteStatus === 'down' && styles.voteButtonActiveDown]} onPress={() => handleVote('down')}>
                <Ionicons name="arrow-down" size={18} color={voteStatus === 'down' ? "#ffffff" : "#ff3333"} />
              </TouchableOpacity>
            </View>

            {/* КНОПКА ПОДЕЛИТЬСЯ */}
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color="#757575" />
              <Text style={[styles.actionText, { color: '#757575' }]}>SHARE</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* === КОММЕНТАРИИ === */}
        <View style={styles.repliesSection}>
          <Text style={styles.repliesHeader}>REPLIES ({threadData.replies.length})</Text>
          
          {threadData.replies.map((reply) => {
            const isHidden = hiddenReplies[reply.id];
            
            return (
              <View key={reply.id} style={styles.replyThreadContainer}>
                {/* Главный комментарий */}
                <View style={styles.replyCard}>
                  <TouchableOpacity onPress={() => handleProfilePress(reply.author, reply.avatar)}>
                    <Image source={{ uri: reply.avatar }} style={styles.replyAvatar} />
                  </TouchableOpacity>
                  
                  <View style={styles.replyBody}>
                    <View style={styles.replyHeader}>
                      <TouchableOpacity onPress={() => handleProfilePress(reply.author, reply.avatar)}>
                        <Text style={styles.replyAuthor}>{reply.author}</Text>
                      </TouchableOpacity>
                      <Text style={styles.replyTime}>{reply.time}</Text>
                    </View>
                    <Text style={styles.replyText}>{reply.text}</Text>
                    
                    {/* Кнопки под комментарием */}
                    <View style={styles.replyActionsRow}>
                      <TouchableOpacity 
                        style={styles.replyMiniAction} 
                        onPress={() => setReplyingTo({ id: reply.id, author: reply.author })}
                      >
                        <Ionicons name="return-down-forward" size={14} color="#757575" />
                        <Text style={styles.replyMiniText}>REPLY</Text>
                      </TouchableOpacity>

                      {reply.subReplies.length > 0 && (
                        <TouchableOpacity 
                          style={styles.replyMiniAction} 
                          onPress={() => setHiddenReplies(prev => ({ ...prev, [reply.id]: !isHidden }))}
                        >
                          <Ionicons name={isHidden ? "eye-outline" : "eye-off-outline"} size={14} color="#757575" />
                          <Text style={styles.replyMiniText}>
                            {isHidden ? `SHOW REPLIES (${reply.subReplies.length})` : 'HIDE REPLIES'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                </View>

                {/* Вложенные ответы */}
                {!isHidden && reply.subReplies.length > 0 && (
                  <View style={styles.subRepliesContainer}>
                    <View style={styles.threadLine} /> 
                    <View style={{ flex: 1 }}>
                      {reply.subReplies.map(subReply => (
                        <View key={subReply.id} style={styles.subReplyCard}>
                          <TouchableOpacity onPress={() => handleProfilePress(subReply.author, subReply.avatar)}>
                            <Image source={{ uri: subReply.avatar }} style={styles.subReplyAvatar} />
                          </TouchableOpacity>
                          <View style={styles.replyBody}>
                            <View style={styles.replyHeader}>
                              <TouchableOpacity onPress={() => handleProfilePress(subReply.author, subReply.avatar)}>
                                <Text style={styles.replyAuthor}>{subReply.author}</Text>
                              </TouchableOpacity>
                              <Text style={styles.replyTime}>{subReply.time}</Text>
                            </View>
                            <Text style={styles.replyText}>{subReply.text}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* === ПОЛЕ ВВОДА === */}
      <View style={styles.inputWrapper}>
        {replyingTo && (
          <View style={styles.replyingIndicator}>
            <Text style={styles.replyingIndicatorText}>Replying to <Text style={{color: '#D1FF00'}}>@{replyingTo.author}</Text></Text>
            <TouchableOpacity onPress={() => setReplyingTo(null)} hitSlop={{top:10, bottom:10, left:10, right:10}}>
              <Ionicons name="close-circle" size={16} color="#757575" />
            </TouchableOpacity>
          </View>
        )}
        
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.textInput}
            placeholder={replyingTo ? "WRITE A REPLY..." : "ADD A COMMENT..."}
            placeholderTextColor="#757575"
            value={replyText}
            onChangeText={setReplyText}
            multiline
          />
          <TouchableOpacity 
            style={[styles.sendButton, replyText.trim().length > 0 && styles.sendButtonActive]} 
            activeOpacity={0.8}
            onPress={handleSendReply}
          >
            <Ionicons name="send" size={18} color={replyText.trim().length > 0 ? "#000000" : "#757575"} />
          </TouchableOpacity>
        </View>
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
  
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  tagBadge: { backgroundColor: '#191919', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#262626' },
  tagText: { color: '#c1fffe', fontSize: 10, fontWeight: 'bold' },

  postActions: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  voteContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#191919', borderRadius: 20, borderWidth: 1, borderColor: '#262626', height: 40, overflow: 'hidden' },
  voteButton: { paddingHorizontal: 12, height: '100%', alignItems: 'center', justifyContent: 'center' },
  voteButtonActiveUp: { backgroundColor: '#D1FF00' },
  voteButtonActiveDown: { backgroundColor: '#ff3333' },
  ratingTextContainer: { paddingHorizontal: 4, minWidth: 28, alignItems: 'center' },
  ratingText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
  actionButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#191919', paddingHorizontal: 16, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#262626' },
  actionText: { color: '#D1FF00', fontSize: 12, fontWeight: 'bold', marginLeft: 6 },

  // Комментарии
  repliesSection: { padding: 24 },
  repliesHeader: { color: '#757575', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginBottom: 20 },
  
  replyThreadContainer: { marginBottom: 24 },
  replyCard: { flexDirection: 'row' },
  replyAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 12, backgroundColor: '#262626' },
  replyBody: { flex: 1 },
  replyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  replyAuthor: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  replyTime: { color: '#757575', fontSize: 10, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  replyText: { color: '#ababab', fontSize: 14, lineHeight: 20, marginBottom: 8 },
  
  replyActionsRow: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  replyMiniAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  replyMiniText: { color: '#757575', fontSize: 10, fontWeight: 'bold' },

  subRepliesContainer: { flexDirection: 'row', marginTop: 16, paddingLeft: 16 },
  threadLine: { width: 2, backgroundColor: '#262626', marginRight: 14, borderRadius: 2 },
  subReplyCard: { flexDirection: 'row', marginBottom: 16 },
  subReplyAvatar: { width: 24, height: 24, borderRadius: 12, marginRight: 10, backgroundColor: '#262626' },

  // Блок ввода
  inputWrapper: { backgroundColor: '#111111', borderTopWidth: 1, borderTopColor: '#262626', paddingBottom: Platform.OS === 'ios' ? 34 : 16 },
  replyingIndicator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  replyingIndicatorText: { color: '#ababab', fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, paddingVertical: 8 },
  textInput: { flex: 1, backgroundColor: '#191919', borderWidth: 1, borderColor: '#262626', borderRadius: 20, color: '#ffffff', fontSize: 14, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 14, minHeight: 45, maxHeight: 100 },
  sendButton: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#191919', alignItems: 'center', justifyContent: 'center', marginLeft: 12, borderWidth: 1, borderColor: '#262626' },
  sendButtonActive: { backgroundColor: '#D1FF00', borderColor: '#D1FF00' }
});