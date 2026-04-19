import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CreateThreadScreen() {
  const navigation = useNavigation();

  // Состояния для формы
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  // Обработчик создания треда
  const handleCreate = () => {
    // Здесь должна быть логика отправки данных на сервер или в стейт-менеджер
    console.log({
      title,
      content,
      tags: tags.split(' ').filter(tag => tag.length > 0) // Разбиваем строку тегов в массив
    });

    // Возвращаемся обратно после "создания"
    navigation.goBack();
  };

  const isFormValid = title.trim().length > 0 && content.trim().length > 0;

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          
          {/* ШАПКА */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
              <Ionicons name="arrow-back" size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>NEW_THREAD</Text>
              <Text style={styles.headerSubtitle}>// INITIATE DISCUSSION</Text>
            </View>
            <View style={{ width: 44 }} /> {/* Пустой блок для выравнивания заголовка по центру */}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            {/* ПОЛЕ: ЗАГОЛОВОК */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>THREAD TITLE</Text>
              <TextInput
                style={styles.input}
                placeholder="ENTER TITLE HERE..."
                placeholderTextColor="#757575"
                value={title}
                onChangeText={setTitle}
                selectionColor="#D1FF00"
                maxLength={100}
              />
            </View>

            {/* ПОЛЕ: ТЕКСТ ТРЕДА */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>INITIAL TRANSMISSION (CONTENT)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="WHAT'S ON YOUR MIND?..."
                placeholderTextColor="#757575"
                value={content}
                onChangeText={setContent}
                selectionColor="#D1FF00"
                multiline={true}
                textAlignVertical="top"
              />
            </View>

            {/* ПОЛЕ: ТЕГИ */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>TAGS (SPACE SEPARATED)</Text>
              <View style={styles.tagsInputContainer}>
                <Ionicons name="pricetag-outline" size={18} color="#757575" style={styles.inputIcon} />
                <TextInput
                  style={styles.tagsInput}
                  placeholder="#TECH #NEWS #UPDATE"
                  placeholderTextColor="#757575"
                  value={tags}
                  onChangeText={setTags}
                  selectionColor="#D1FF00"
                  autoCapitalize="none"
                />
              </View>
            </View>

          </ScrollView>

          {/* КНОПКА СОЗДАНИЯ */}
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[styles.submitButton, !isFormValid && styles.submitButtonDisabled]} 
              activeOpacity={0.8}
              onPress={handleCreate}
              disabled={!isFormValid}
            >
              <Text style={[styles.submitButtonText, !isFormValid && styles.submitButtonTextDisabled]}>
                BROADCAST THREAD
              </Text>
              <Ionicons 
                name="send" 
                size={18} 
                color={isFormValid ? "#000000" : "#757575"} 
                style={{ marginLeft: 8 }} 
              />
            </TouchableOpacity>
          </View>

        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0e0e0e' 
  },
  innerContainer: {
    flex: 1,
  },
  
  // Header styles (matching AllThreadsScreen)
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingTop: Platform.OS === 'ios' ? 60 : 40, 
    paddingBottom: 20, 
    paddingHorizontal: 20, 
    backgroundColor: 'rgba(14, 14, 14, 0.9)', 
    zIndex: 10 
  },
  backButton: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#191919', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderWidth: 1, 
    borderColor: '#262626' 
  },
  headerTitleContainer: { 
    alignItems: 'center' 
  },
  headerTitle: { 
    color: '#D1FF00', 
    fontSize: 18, 
    fontWeight: '900', 
    letterSpacing: 2 
  },
  headerSubtitle: { 
    color: '#757575', 
    fontSize: 10, 
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', 
    fontWeight: 'bold', 
    marginTop: 2 
  },

  // Form styles
  scrollContent: { 
    paddingHorizontal: 20, 
    paddingTop: 30, 
    paddingBottom: 40 
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#D1FF00',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  input: {
    backgroundColor: '#191919',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    color: '#ffffff',
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  textArea: {
    height: 180,
    paddingTop: 16,
  },
  tagsInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191919',
    borderWidth: 1,
    borderColor: '#262626',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  tagsInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },

  // Footer & Button styles
  footer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#191919',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#D1FF00',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#D1FF00',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    backgroundColor: '#191919',
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#262626',
  },
  submitButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  submitButtonTextDisabled: {
    color: '#757575',
  }
});