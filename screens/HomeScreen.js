import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { addRandomGame } from '../services/gameService';
import { getDatabase, ref as dbRef, onValue } from 'firebase/database';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [progress, setProgress] = useState(0);
  const [profilResmi, setProfilResmi] = useState('');

  const profilResimListesi = {
    'profiller1.jpg': require('../assets/profiller/profiller1.jpg'),
    'profiller2.jpg': require('../assets/profiller/profiller2.jpg'),
    'profiller3.jpg': require('../assets/profiller/profiller3.jpg'),
    'profiller4.jpg': require('../assets/profiller/profiller4.jpg'),
    'profiller5.jpg': require('../assets/profiller/profiller5.jpg'),
  };

  useEffect(() => {
    if (auth.currentUser?.uid) {
      const db = getDatabase();
      const usersRef = dbRef(db, 'users');
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const entries = Object.entries(data);
          const currentUserEntry = entries.find(([_, user]) => user.UserId === auth.currentUser.uid);
          if (currentUserEntry) {
            const userData = currentUserEntry[1];
            setProfilResmi(userData.profilResmi || '');
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    if (isCreatingGame) {
      let interval = setInterval(() => {
        setProgress((p) => {
          if (p >= 1) {
            clearInterval(interval);
            return 1;
          }
          return p + 0.05;
        });
      }, 100);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isCreatingGame]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1, position: 'absolute', left: 0 }}>
          {(auth.currentUser) && (
            <TouchableOpacity
              onPress={() => navigation.navigate('Arkadaslarim')}
              style={[{ flexDirection: 'row', alignItems: 'center', borderRadius: 50, backgroundColor:'white', padding:7}]}
            >
              <FontAwesome name="users" size={24} color="#004d00" />
            </TouchableOpacity>
          )}
        </View>

        <View style={{ position: 'absolute', right: 0 }}>
          {(auth.currentUser) && (
            <TouchableOpacity onPress={() => navigation.navigate('ProfilSayfasi')}>
              {profilResmi && profilResimListesi[profilResmi] ? (
                <Image
                  source={profilResimListesi[profilResmi]}
                  style={{ width: 45, height: 45, borderRadius: 25 }}
                />
              ) : (
                <Ionicons name="person-circle-sharp" size={50} color="white" />
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Image style={styles.Logo} source={require('../images/Logo3.png')} />
      <Text style={styles.title}>Scrabble</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Oyun oluştur</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Oyunlarim')}>
          <Text style={styles.buttonText}>Oyunlarım</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('KurallarSayfasi')}>
        <Text style={styles.buttonText}>Kurallar</Text>
      </TouchableOpacity>

      {(auth.currentUser) && (
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Skorlar')}>
          <Text style={styles.buttonText}>Skorlar</Text>
        </TouchableOpacity>
      )}

      
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => !isCreatingGame && setModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => !isCreatingGame && setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {isCreatingGame ? (
                  <>
                    <Text style={styles.modalTitle}>Oyun oluşturuluyor...</Text>
                    <ActivityIndicator size="large" color="#004d00" style={{ marginTop: 20 }} />
                    <View style={styles.progressBar}>
                      <View style={[styles.progress, { width: `${progress * 100}%` }]} />
                    </View>
                  </>
                ) : (
                  <>
                    <Text style={styles.modalTitle}>Oyunu Seçin</Text>
                    <TouchableOpacity 
                      style={styles.modalButton} 
                      onPress={() => {
                        setModalVisible(false);
                        navigation.navigate('Arkadaslarim', { mode: 'select' });
                      }}
                    >
                      <Text style={styles.modalButtonText}>Arkadaşınla Oyna</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.modalButton} 
                      onPress={async () => {
                        setIsCreatingGame(true);
                        try {
                          const oyunId = await addRandomGame(auth.currentUser.uid);
                          if (oyunId) {
                            setModalVisible(false);
                            alert("Oyun oluşturuldu.");
                          } else {
                            alert("Oyun oluşturulamadı.");
                          }
                        } catch (error) {
                          alert("Hata oluştu: " + error.message);
                        } finally {
                          setIsCreatingGame(false);
                        }
                      }}
                    >
                      <Text style={styles.modalButtonText}>Rastgele Oyun</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#004d00', paddingTop: 50 },
  Logo: { width: 110, height: 110, borderRadius: 60, marginBottom: 30 },
  header: { position: 'absolute', top: 35, left: 20, right: 20, height: 60, flexDirection: 'row', alignItems: 'center' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 42, fontStyle: "italic", marginBottom: 20 },
  button: {
    backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10,
    marginVertical: 10, width: 130, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10,
  },
  buttonText: { color: '#004d00', fontWeight: 'bold' },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  modalContent: { width: 250, backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalButton: { backgroundColor: '#004d00', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, marginVertical: 10, width: '100%', alignItems: 'center' },
  modalButtonText: { color: 'white', fontWeight: 'bold' },
  progressBar: { height: 10, width: '100%', backgroundColor: '#ddd', borderRadius: 5, marginTop: 20 },
  progress: { height: '100%', backgroundColor: '#004d00', borderRadius: 5 },
});
