import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Modal, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import AGame from '../components/AGame';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase';
import { getMyGamesByUserId, updateGameStatus, deleteGame } from '../services/gameService';
import {doldurHarfleri} from '../services/LetterService';
import { useRoute } from '@react-navigation/native';
import { onValue, ref, off } from 'firebase/database';
import { db } from '../firebase'; 


export default function MyGamesScreen() {
  const navigation = useNavigation();
  const [oyunlarim, setOyunlarim] = useState([]);
  const [aktifTab, setAktifTab] = useState('aktif');
  const [seciliOyun, setSeciliOyun] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCreatingGame, setIsCreatingGame] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bekleyenModalVisible, setBekleyenModalVisible] = useState(false);

  const route = useRoute();
  const userId = auth.currentUser?.uid;

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


  useEffect(() => {
    if (route.params?.tab === 'bekleyen') {
      setAktifTab('bekleyen');
    } else {
      setAktifTab('aktif');
    }
  }, [route.params]);
  
    useEffect(() => {
    if (!userId) return;

    const gamesRef = ref(db, 'games/');

    const unsubscribe = onValue(gamesRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setOyunlarim([]);
        return;
      }

      const filteredGames = Object.entries(data)
        .map(([id, game]) => ({ id, ...game }))
        .filter(
          (game) =>
            game.players?.includes(userId) ||
            game.host === userId ||
            game.invated === userId
        );

      setOyunlarim(filteredGames);
    });

    return () => {
      off(gamesRef);
    };
  }, [userId]);

  const oyunFiltrele = () => {
    switch (aktifTab) {
      case 'aktif':
        return oyunlarim.filter(g => g.status === 1);
      case 'bekleyen':
        return oyunlarim.filter(g => g.status === 0);
      case 'bitmis':
        return oyunlarim.filter(g => g.status === 2);
      default:
        return [];
    }
  };
  const handleOyunSec = (game) => {
    if (game.status === 1) {
      navigation.navigate('OyunSayfasi', { oyunId: game.id });
    } else if (game.status === 0) {
      if (game.host === userId) {
        setSeciliOyun(game);
        setBekleyenModalVisible(true);
      } else if (game.invated === userId) {
        setSeciliOyun(game);
        setModalVisible(true);
      }
    }
  };
  

  const handleKabulEt = async () => {
    setModalVisible(false);
    setIsCreatingGame(true);

    try {
      setOyunlarim(prev => prev.map(o => o.id === seciliOyun.id ? { ...o, status: 1 } : o));
      await doldurHarfleri(seciliOyun.id, seciliOyun.players);
      
      
      await updateGameStatus(seciliOyun.id, 1);
      navigation.navigate('OyunSayfasi', { oyunId: seciliOyun.id });
    } catch (err) {
      alert("Oyun başlatılırken hata oluştu.");
    } finally {
      setIsCreatingGame(false);
    }
  };
  

  const handleReddet = async () => {
    await deleteGame(seciliOyun.id);
    setModalVisible(false);
    setOyunlarim(prev => prev.filter(o => o.id !== seciliOyun.id));
  };

  return (
    <View style={styles.Container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 50, marginBottom: 10 }}>
        <AntDesign name="left" size={28} color="white" />
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        {["aktif", "bekleyen", "bitmis"].map((tab, i) => (
          <TouchableOpacity key={i} style={[styles.tab, aktifTab === tab && styles.activeTab]} onPress={() => setAktifTab(tab)}>
            <Text style={styles.tabText}>{tab.charAt(0).toUpperCase() + tab.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        {oyunFiltrele().length === 0 ? (
          <Text style={styles.bilgi}>Oyun bulunamadı.</Text>
        ) : (
          oyunFiltrele().map((game, index) => (
            <AGame key={index} game={game} onPress={handleOyunSec} isMine={game.host === userId} />
          ))
        )}
      </ScrollView>

    <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
                <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Oyunu kabul etmek istiyor musun?</Text>
                <View style={styles.modalButtons}>
                    <TouchableOpacity onPress={handleKabulEt} style={[styles.modalButton, { backgroundColor: '#007f00' }]}>
                    <Text style={styles.modalButtonText}>Kabul Et</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleReddet} style={[styles.modalButton, { backgroundColor: '#aa0000' }]}>
                    <Text style={styles.modalButtonText}>Reddet</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </TouchableWithoutFeedback>
            </View>
        </TouchableWithoutFeedback>
    </Modal>
    <Modal transparent visible={isCreatingGame} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Oyun oluşturuluyor...</Text>
          <ActivityIndicator size="large" color="#004d00" style={{ marginTop: 20 }} />
          <View style={styles.progressBar}>
            <View style={[styles.progress, { width: `${progress * 100}%` }]} />
          </View>
        </View>
      </View>
    </Modal>
    <Modal visible={bekleyenModalVisible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={() => setBekleyenModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Davet gönderildi!</Text>
              <Text style={{ textAlign: 'center', marginTop: 10 }}>
                Rakibin oyunu kabul etmesini bekliyorsunuz.
              </Text>
              <TouchableOpacity
                onPress={() => setBekleyenModalVisible(false)}
                style={styles.tamamButon}
              >
                <Text style={styles.tamamButonText}>Tamam</Text>
              </TouchableOpacity>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#004d00',
    paddingTop: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#003300',
    paddingVertical: 10,
    marginBottom: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#005500',
  },
  activeTab: {
    backgroundColor: '#00aa00',
  },
  tabText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bilgi: {
    color: 'white',
    marginTop: 10,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  modalButton: {
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressBar: {
  height: 10,
  width: '100%',
  backgroundColor: '#ddd',
  borderRadius: 5,
  marginTop: 20,
},
progress: {
  height: '100%',
  backgroundColor: '#004d00',
  borderRadius: 5,
},
  tamamButon: {
    backgroundColor: '#004d00',
    marginTop: 20,
    width: '100%',
    minHeight: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tamamButonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },

});
