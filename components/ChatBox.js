import React, { useEffect, useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { db } from '../firebase';
import { ref, onValue, push } from 'firebase/database';

const ChatBox = ({ oyunId, userId, userName }) => {
  const [mesaj, setMesaj] = useState('');
  const [mesajlar, setMesajlar] = useState([]);

  useEffect(() => {
    const chatRef = ref(db, `games/${oyunId}/chat`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const veriler = snapshot.val();
      if (veriler) {
        const liste = Object.entries(veriler).map(([id, val]) => ({ id, ...val }));
        liste.sort((a, b) => a.timestamp - b.timestamp);
        setMesajlar(liste);
      }
    });

    return () => unsubscribe();
  }, [oyunId]);

  const mesajGonder = () => {
    if (mesaj.trim() === '') return;
    push(ref(db, `games/${oyunId}/chat`), {
      senderId: userId,
      userName,
      message: mesaj.trim(),
      timestamp: Date.now()
    });
    setMesaj('');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <FlatList
        data={mesajlar}
        renderItem={({ item }) => (
          <View style={[
            styles.mesajKutusu,
            item.senderId === userId ? styles.benimMesaj : styles.digerMesaj
          ]}>
            <Text style={styles.kullaniciAdi}>{item.userName}</Text>
            <Text style={styles.mesajMetni}>{item.message}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Mesaj yaz..."
          value={mesaj}
          onChangeText={setMesaj}
          style={styles.input}
          placeholderTextColor="#888"
            multiline
        />
        <TouchableOpacity onPress={mesajGonder} style={styles.gonderButonu}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Gönder</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#dfffdc',
    padding: 10
  },
  mesajKutusu: {
    marginVertical: 5,
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10
  },
  benimMesaj: {
    backgroundColor: '#b9fbc0',
    alignSelf: 'flex-end'
  },
  digerMesaj: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start'
  },
  kullaniciAdi: {
    fontSize: 10,
    color: '#555'
  },
  mesajMetni: {
    fontSize: 14,
    color: '#333'
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  input: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 14
  },
  gonderButonu: {
    backgroundColor: '#1a661a',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20
  }
});
