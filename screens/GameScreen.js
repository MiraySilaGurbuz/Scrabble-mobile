import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Modal } from 'react-native';
import GameBoard from '../components/GameBoard';
import SuruklenebilirTas from '../components/SuruklenebilirTas';
import TasTahtasi from '../components/TasTahtasi';
import { cellSize } from '../components/Constants';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getGameById } from '../services/gameService';
import { getActiveLettersForPlayer, doldurHarfleri, HarfleriTamamla, SecilenTaslariDegistir } from '../services/LetterService';
import { auth } from '../firebase';
import { HarfOyuncuMapGüncelle, TaslariGameBoardaKaydet, OyuncuScoreDegeriGuncellemeV2,kontrolEtBitişikMi } from '../services/LetterService';
import { updateGameTurn } from '../services/gameService';
import {İlkHamleDoğrulaması, TumBagliHarfler, TumKelimeler } from '../services/gameService';
import { eksikKelimeleriBul } from "../services/eksikKontrol";
import { ref, onValue, set, get, update } from "firebase/database";
import { db } from "../firebase";
import { tamamlayiciTasUret } from "../services/LetterService";
import { forfeitGame, increasePassCount, updatePassCounts, UcKerePasGecildi } from '../services/gameService';
import { Alert } from 'react-native';
import ChatBox from '../components/ChatBox';


export default function GameScreen() {
  const [dropZones, setDropZones] = useState([]);
  const [tasTahtasiTaslari, setTasTahtasiTaslari] = useState([]);
  const [taslarKilitli, setTaslarKilitli] = useState(false);
  const [droppedLetterInfo, setDroppedLetterInfo] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [jokerModalGorunur, setJokerModalGorunur] = useState(false);
  const [secilecekJokerTaslar, setSecilecekJokerTaslar] = useState([]);
  const [aktifJokerIndex, setAktifJokerIndex] = useState(0);
  const scrollOffsetRef = useRef({ x: 0, y: 0 });
  const navigation = useNavigation();
  const [kareBasliklari, setKareBasliklari] = useState({});
  const [oyun, setOyun] = useState([]);
  const route = useRoute();
  const { oyunId } = route.params || {};
  const [friendUserIds, setFriendUserIds] = useState([]);
  const [isFriendListLoaded, setIsFriendListLoaded] = useState(false);
  const [durumlar, setDurumlar] = useState({});
  const [harfDegistirModalVisible, setHarfDegistirModalVisible] = useState(false);
  const [seciliTaslar, setSeciliTaslar] = useState([]);
  const [chatVisible, setChatVisible] = useState(false);
  const [profilResimleri, setProfilResimleri] = useState({});
  const [oyunSonuModalGorunur, setOyunSonuModalGorunur] = useState(false);
  const [oyunSonuBilgi, setOyunSonuBilgi] = useState({
    baslik: '',
    mesaj: '',
    durum: ''
  });
  const [uyariModalGorunur, setUyariModalGorunur] = useState(false);
  const [uyariMesaji, setUyariMesaji] = useState('');
  const [teslimModalGorunur, setTeslimModalGorunur] = useState(false);



  const profilResimListesi = {
    'profiller1.jpg': require('../assets/profiller/profiller1.jpg'),
    'profiller2.jpg': require('../assets/profiller/profiller2.jpg'),
    'profiller3.jpg': require('../assets/profiller/profiller3.jpg'),
    'profiller4.jpg': require('../assets/profiller/profiller4.jpg'),
    'profiller5.jpg': require('../assets/profiller/profiller5.jpg'),
  };

  const showUyariModal = (mesaj) => {
    setUyariMesaji(mesaj);
    setUyariModalGorunur(true);
  };


  useEffect(() => {
    if (!oyun?.players || oyun.players.length < 2) return;

    const usersRef = ref(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updated = {};
        oyun.players.forEach(p => {
          const user = Object.values(data).find(u => u.UserId === p.id);
          if (user?.profilResmi) {
            updated[p.id] = user.profilResmi;
          }
        });
        setProfilResimleri(updated);
      }
    });
  }, [oyun?.players]);


  const getProfilResmi = (userId) => {
    const dosyaAdi = profilResimleri[userId];
    return dosyaAdi && profilResimListesi[dosyaAdi]
      ? profilResimListesi[dosyaAdi]
      : require('../images/profile.jpg'); 
  };

  const KaristirTaslar = () => {
  setTasTahtasiTaslari(prev => {
    const shuffled = [...prev];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });
};

useEffect(() => {
  if (!oyunId) return;

  const statusRef = ref(db, `games/${oyunId}/status`);
  const unsubscribe = onValue(statusRef, async (snapshot) => {
    const status = snapshot.val();
    if (status !== 2) return;

    const winnerRef = ref(db, `games/${oyunId}/winner`);
    const reasonRef = ref(db, `games/${oyunId}/gameEndReason`);

    const [winnerSnap, reasonSnap] = await Promise.all([
      get(winnerRef),
      get(reasonRef)
    ]);

    const winnerId = winnerSnap.exists() ? winnerSnap.val() : null;
    const gameEndReason = reasonSnap.exists() ? reasonSnap.val() : null;

    let baslik = "Oyun Bitti";
    let mesaj = "";

    if (gameEndReason === "uc_pas") {
      if (winnerId === userId) {
        baslik = "🎉 Tebrikler!";
        mesaj = "Rakibiniz 3 kez pas geçti. Oyunu kazandınız.";
        durum = "kazandi";
      } else {
        mesaj = "3 kez pas geçtiğiniz için oyunu kaybettiniz.";
        durum = "kaybetti";
      }
    } else if (gameEndReason === "teslim") {
      if (winnerId === userId) {
        baslik = "🎉 Tebrikler!";
        mesaj = "Rakibiniz teslim oldu. Oyunu kazandınız.";
        durum = "kazandi";
      } else {
        mesaj = "Teslim olduğunuz için oyunu kaybettiniz.";
        durum = "kaybetti";
      }
    } else {
      mesaj = "Oyun sona erdi.";
      durum = "bilgi";
    }

    setOyunSonuBilgi({ baslik, mesaj, durum  });
    setOyunSonuModalGorunur(true);
  });

  return () => unsubscribe();
}, [oyunId]);




useEffect(() => {
  const fetchFriends = async () => {
    if (!userId) return;
    const friendList = await fetchUserFriends(userId); 
    console.log("friendList", friendList)
    const ids = friendList.map(f => f.userId);
    console.log("ids", ids)
    setFriendUserIds(ids);
    setIsFriendListLoaded(true); 
  };

  fetchFriends();
}, [userId]);



const handleGeriAlPress = () => {
  setTasTahtasiTaslari(prev => {
    const mevcutTasSayisi = prev.length;

    const geriAlinacakTaslar = Object.entries(kareBasliklari)
      .filter(([_, bilgi]) => bilgi.fromBoard === true)
      .map(([konum, bilgi], index) => ({
        id: bilgi.id,
        baslik: bilgi.letter,
        puan: bilgi.puan,
        initialPosition: {
          x: (mevcutTasSayisi + index) * (cellSize + 5),
          y: 15
        }
      }));

    const yeniTaslar = geriAlinacakTaslar.filter(
      tas => !prev.some(prevTas => prevTas.id === tas.id)
    );

    return [...prev, ...yeniTaslar];
  });

  
  const yeniKareler = { ...kareBasliklari };
  const yeniDurumlar = { ...durumlar };

  Object.entries(kareBasliklari).forEach(([key, val]) => {
    if (val.fromBoard === true) {
      delete yeniKareler[key];
      delete yeniDurumlar[key];
    }
  });

  setKareBasliklari(yeniKareler);
  setDurumlar(yeniDurumlar);
  setDroppedLetterInfo(null);

  setTimeout(() => {
    setDurumlar(prev => ({ ...prev }));
  }, 100);
};


  useEffect(() => {
    if (!oyunId) return;

    const playersRef = ref(db, `games/${oyunId}/players`);
    const unsubscribe = onValue(playersRef, (snapshot) => {
      const playersData = snapshot.val();
      setOyun(prev => ({
        ...prev,
        players: Object.values(playersData)
      }));
    });

    return () => unsubscribe();
  }, [oyunId]);

  useEffect(() => {
  if (!oyunId) return;

  const turnRef = ref(db, `games/${oyunId}/turn`);
  const unsubscribe = onValue(turnRef, (snapshot) => {
    const turnId = snapshot.val();
    setOyun(prev => ({ ...prev, turn: turnId }));
  });

  return () => unsubscribe();
}, [oyunId]);

  useEffect(() => {
    const fetchGames = async () => {
      const game = await getGameById(oyunId);
      setOyun(game);

      const oyuncu1 = game.players?.[0];
      const oyuncu2 = game.players?.[1];
      const benimOyuncum = oyuncu1?.id === auth.currentUser?.uid ? oyuncu1 : oyuncu2;

      if (benimOyuncum) {
        const taslar = await getActiveLettersForPlayer(oyunId, benimOyuncum.id);
        console.log(taslar)
        setTasTahtasiTaslari(taslar);
      }
    };

    if (oyunId) fetchGames();
  }, [oyunId]);

  const userId = auth.currentUser?.uid;
  const oyuncu1 = oyun.players?.[0];
  const oyuncu2 = oyun.players?.[1];
  const benimOyuncum = oyuncu1?.id === userId ? oyuncu1 : oyuncu2;
  const digerOyuncu = oyuncu1?.id === userId ? oyuncu2 : oyuncu1;

  const handleDrop = (row, col, letter, id) => {
    const key = `${row}/${col}`;
    const zone = dropZones.find(z => z.key === key);
    const tas = tasTahtasiTaslari.find(t => t.id === id);
    const anaDeger = zone?.anaDeger ?? null;
  
    setDroppedLetterInfo(null);
  
    setTimeout(() => {
      setDroppedLetterInfo({ row, col, letter, id, puan: tas?.puan ?? 0, anaDeger });
  
      setTasTahtasiTaslari(prev => {
        const index = prev.findIndex(l => l.id === id);
        if (index !== -1) {
          const newTaslar = [...prev];
          newTaslar.splice(index, 1);
          return newTaslar;
        }
        return prev;
      });
  
      setKareBasliklari(prev => ({
        ...prev,
        [key]: { id, letter, puan: tas?.puan ?? 0, anaDeger, fromBoard: true }
      }));

      setDurumlar(prev => ({
        ...prev,
        [key]: 1
      }));
    }, 50);
  };
  

  const handlePasPress = async () => {
    if (oyun?.turn !== userId) {
      showUyariModal("Sıra sizde değil!");
      return;
    }

    const yeniPasSayisi = await increasePassCount(oyunId, userId);

    if (yeniPasSayisi >= 3) {
      UcKerePasGecildi(oyunId, userId, digerOyuncu?.id);
    } else {
      await updateGameTurn(oyunId, digerOyuncu?.id);
    }
  };

  

  const handleRetrieveLetter = ({ id }) => {
    if (!id) return;
    const kare = Object.entries(kareBasliklari).find(([_, val]) => val.id === id);
    if (!kare) return;
  
    const [key, val] = kare;
  
    setKareBasliklari(prev => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
  
    setTasTahtasiTaslari(prev => [...prev, { id: val.id, baslik: val.letter, puan: val.puan }]);
    setDurumlar(prev => {
      const updated = { ...prev };
      updated[key] = 0;
      return updated;
    });

  };

  

  const handlePlayPress = async () => {
    const taslarimRaw = Object.entries(kareBasliklari)
      .filter(([_, bilgi]) => bilgi.fromBoard === true)
      .map(([position, bilgi]) => ({
        letter: bilgi.letter,
        id: bilgi.id,
        puan: bilgi.puan,
        anaDeger: bilgi.anaDeger,
        position
      }));

    const taslarim = JSON.parse(JSON.stringify(taslarimRaw));
    //console.log("taslarım:",taslarim);
    const dogrulamaSonucu = await İlkHamleDoğrulaması(oyunId, taslarim);
    if (!dogrulamaSonucu.isValid) {
      showUyariModal(dogrulamaSonucu.message);
      handleGeriAlPress();
      return;
    }

    const jokerTaslar = taslarim.filter(tas => tas.puan === 0);
    if (jokerTaslar.length > 0) {
      setSecilecekJokerTaslar(jokerTaslar);
      setAktifJokerIndex(0);
      setJokerModalGorunur(true);
      return;
    }

    handlePlayPressDevam();
  };

  const handlePlayPressDevam = async () => {
    const taslarim = Object.entries(kareBasliklari)
      .filter(([_, bilgi]) => bilgi.fromBoard === true)
      .map(([konum, bilgi]) => ({
        letter: bilgi.letter,
        id: bilgi.id,
        puan: bilgi.puan,
        anaDeger: bilgi.anaDeger,
        position: konum
      }));

    const ilgiliTaslar = await TumBagliHarfler(oyunId, taslarim);
    console.log("ilgili taslar", ilgiliTaslar);

    if (ilgiliTaslar.length < 2) {
      showUyariModal("Lütfen geçerli bir kelime girin.");
      return;
    }

    const kelimeler = TumKelimeler(ilgiliTaslar);
    console.log("kelimeler", kelimeler);
    const eksikler = eksikKelimeleriBul(kelimeler);

    if (eksikler.length > 0) {
      showUyariModal("Geçersiz kelimeler var: " + eksikler.join(", "));
      handleGeriAlPress();
      return;
    }

    const bitisikMi = await kontrolEtBitişikMi(oyunId, taslarim);
    
    console.log("bitisikMi", bitisikMi)
    if (!bitisikMi) {
      showUyariModal("Kelimenin en az bir harfi mevcut kelimelere bitişik olmalıdır!");
      handleGeriAlPress();
      return;
    }
    console.log("geçersiz kelime yok")
    HarfOyuncuMapGüncelle(taslarim, oyunId, userId);
    TaslariGameBoardaKaydet(taslarim, oyunId, userId);
    OyuncuScoreDegeriGuncellemeV2(taslarim, oyunId, userId);
    updatePassCounts(oyunId, userId);
    updateGameTurn(oyunId, digerOyuncu?.id);

    let eklenecekTasSayisi = 7 - tasTahtasiTaslari.length;
    console.log(eklenecekTasSayisi)

    for (let i = 0; i < eklenecekTasSayisi; i++) {
      await HarfleriTamamla(oyunId, userId);
    }

    

    await new Promise(resolve => setTimeout(resolve, 300));

    const yeniTaslar = await getActiveLettersForPlayer(oyunId, userId);
    setTasTahtasiTaslari(yeniTaslar);
  };
  
  const jokerHarfSecildi = (secilenHarf) => {
    const secilenTas = secilecekJokerTaslar[aktifJokerIndex];

    setKareBasliklari(prev => {
      const guncellenmis = { ...prev };
      if (guncellenmis[secilenTas.position]) {
        guncellenmis[secilenTas.position].letter = secilenHarf;
        guncellenmis[secilenTas.position].gercekHarf = secilenHarf;
      }
      return guncellenmis;
    });

    if (aktifJokerIndex < secilecekJokerTaslar.length - 1) {
      setAktifJokerIndex(aktifJokerIndex + 1);
    } else {
      setJokerModalGorunur(false);
      handlePlayPressDevam();
    }
  };

  const handleHarfDegistirPress = async (seciliHarfler) => {
    try {
      await SecilenTaslariDegistir(seciliHarfler, oyunId, userId);

      const yeniTaslar = await getActiveLettersForPlayer(oyunId, userId);
      //console.log("yeniTaslar",yeniTaslar)
      setTasTahtasiTaslari(yeniTaslar);
      updateGameTurn(oyunId, digerOyuncu?.id);
    } catch (error) {
      console.error("Harf değiştirme hatası:", error);
    }
  }

  const mainButtons = ["Oyna", "Geri Al", "Karıştır", "Pas"];
  const extraButtons = ["Teslim Ol", "Harf Değiştir"];

  return (
    <View style={{ flex: 1, paddingTop: 40, backgroundColor: '#1a661a' }}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 50, paddingLeft: 10 }}
      >
        <AntDesign name="left" size={30} color="white" />
        <Text style={{ color: 'white', fontSize: 18, marginLeft: 5 }}>Geri</Text>
      </TouchableOpacity>

      
      <TouchableOpacity
        onPress={() => setChatVisible(true)}
        style={{
           position: 'absolute',
            top: 40,
            right: 10,
            padding: 10,
            borderRadius: 25,
            zIndex: 10,
            backgroundColor: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(5px)',
        }}
      >
        <AntDesign name="wechat" size={24} color="white" />
      </TouchableOpacity>

      <View style={styles.playerContainer}>
        <View style={styles.playerBox}>
          <Image source={getProfilResmi(benimOyuncum?.id)} style={styles.profileImage} />
          <View style={{ marginLeft: 20 }}>
            <Text style={styles.playerText}>{benimOyuncum?.userName ?? "Ben"}</Text>
            <Text style={styles.playerScore}>{benimOyuncum?.score}</Text>
          </View>
        </View>

        <View style={styles.playerBox}>
          <Text style={styles.rakipEtiketi}>Rakip</Text>
          <Image source={getProfilResmi(digerOyuncu?.id)} style={styles.profileImage} />
          <View style={{ marginLeft: 20 }}>
            <Text style={styles.playerText}>{digerOyuncu?.userName ?? "Rakip"}</Text>
            <Text style={styles.playerScore}>{digerOyuncu?.score}</Text>
          </View>
          {digerOyuncu?.id && isFriendListLoaded && !friendUserIds.includes(digerOyuncu.id) && (
            <TouchableOpacity style={styles.addButton}>
              <Ionicons name="person-add" size={20} color="#1a661a" />
            </TouchableOpacity>
          )}


        </View>
      </View>

          
      <GameBoard
        setDropZones={setDropZones}
        scrollOffsetRef={scrollOffsetRef}
        onRetrieveLetter={handleRetrieveLetter}
        droppedLetter={droppedLetterInfo}
        validDropZones={dropZones}
        kareBasliklari={kareBasliklari}
        setKareBasliklari={setKareBasliklari}
        oyunId={oyunId}
        durumlar={durumlar}
        setDurumlar={setDurumlar}
      />

      <TasTahtasi>
        {dropZones.length > 0 &&
          tasTahtasiTaslari.map((tas, index) => (
            <SuruklenebilirTas
              key={tas.id}
              id={tas.id}
              letter={tas.baslik}
              puan={tas.puan}
              validDropZones={dropZones}
              isLocked={taslarKilitli}
              initialPosition={{ x: index * (cellSize - 23), y: 15 }}
              onDrop={handleDrop}
              scrollOffsetRef={scrollOffsetRef}
              setTasTahtasiTaslari={setTasTahtasiTaslari}
              durumlar={durumlar}
            />
          ))}
      </TasTahtasi>

      <View style={styles.ButtonContainer}>
        {mainButtons.map((title, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.Button,
              title === "Oyna" && oyun?.turn !== userId && { backgroundColor: '#ccc' },
              title === "Pas" && oyun?.turn !== userId && { backgroundColor: '#ccc' }
            ]}
            disabled={(title === "Oyna" || title === "Pas") && oyun?.turn !== userId}
            onPress={() => {
              if (title === "Oyna") {
                if (oyun?.turn !== userId) {
                  showUyariModal("Sıra sizde değil!");
                  return;
                }
                handlePlayPress();
              } else if (title === "Pas") {
                handlePasPress();
              } 
              else if (title === "Geri Al") {
                handleGeriAlPress();
              }
              else if (title === "Karıştır") {
                KaristirTaslar();
              }
              else {
                alert(title);
              }
            }}
          >
            {title === "Oyna" ? (
              <AntDesign name="caretright" size={24} color="#004d00" />
            ) : (
              <Text style={styles.ButtonText}>{title}</Text>
            )}
          </TouchableOpacity>

        ))}

        <TouchableOpacity style={styles.Button} onPress={() => setSettingsVisible(true)}>
          <Feather name="settings" size={24} color="#004d00" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={settingsVisible} animationType="fade">
        <TouchableOpacity style={styles.modalBackground} onPress={() => setSettingsVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={[styles.modalButton, oyun?.turn !== userId && { backgroundColor: '#ccc' }]}
              onPress={async () => {
                if (oyun?.turn !== userId) return;

                if (!oyunId || !userId || !digerOyuncu?.id) return;

                setTeslimModalGorunur(true);

                setSettingsVisible(false);
              }}
              disabled={oyun?.turn !== userId}
            >
              <Text style={styles.ButtonText}>Teslim Ol</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalButton, oyun?.turn !== userId && { backgroundColor: '#ccc' }]}
              onPress={() => {
                if (oyun?.turn !== userId) return;

                setHarfDegistirModalVisible(true);
                setSettingsVisible(false);
              }}
              disabled={oyun?.turn !== userId}
            >
              <Text style={styles.ButtonText}>Harf Değiştir</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal visible={jokerModalGorunur} transparent>
        <View style={{
          flex: 1, justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }}>
          <View style={{
            backgroundColor: 'white', padding: 20, borderRadius: 10,
            alignItems: 'center', width: '80%'
          }}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>
              Bu boş taş hangi harfi temsil etsin?
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {"ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ".split('').map((harf) => (
                <TouchableOpacity
                  key={harf}
                  onPress={() => jokerHarfSecildi(harf)}
                  style={{ margin: 5, padding: 10, backgroundColor: '#e6ffe6', borderRadius: 10 }}
                >
                  <Text style={{ fontSize: 16, color: '#004d00' }}>{harf}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={harfDegistirModalVisible} transparent animationType="slide">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            width: '80%',
            alignItems: 'center'
          }}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              Değiştirmek istediğiniz harf(ler)i seçin
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
              {tasTahtasiTaslari.map(tas => {
                const isSelected = seciliTaslar.includes(tas.id);
                return (
                  <TouchableOpacity
                    key={tas.id}
                    onPress={() => {
                      setSeciliTaslar(prev => {
                        if (isSelected) {
                          return prev.filter(id => id !== tas.id);
                        } else {
                          return [...prev, tas.id];
                        }
                      });
                    }}
                    style={{
                      margin: 5,
                      padding: 10,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: isSelected ? '#1a661a' : '#ccc',
                      backgroundColor: isSelected ? '#ccffcc' : '#e6ffe6',
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#004d00' }}>{tas.baslik}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => {
                  console.log("Seçilen taş ID'leri:", seciliTaslar);
                  setHarfDegistirModalVisible(false);
                  handleHarfDegistirPress(seciliTaslar);
                  setSeciliTaslar([]);
                }}
                style={{
                  backgroundColor: '#1a661a',
                  padding: 10,
                  borderRadius: 10,
                  marginRight: 10
                }}
              >
                <Text style={{ color: 'white' }}>Onayla</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setHarfDegistirModalVisible(false);
                  setSeciliTaslar([]);
                }}
                style={{
                  backgroundColor: '#ccc',
                  padding: 10,
                  borderRadius: 10
                }}
              >
                <Text>İptal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal visible={chatVisible} animationType="slide">
        <View style={{ flex: 1, backgroundColor: '#dfffdc'}}>
          <TouchableOpacity
            onPress={() => setChatVisible(false)}
            style={{ padding: 10, flexDirection: 'row', alignItems: 'center' }}
          >
            <AntDesign name="left" size={24} color="#004d00" fontWeight='bold'/>
            <Text style={{ fontSize: 16, marginLeft: 5, color: '#004d00', fontWeight:'bold' }}>Geri</Text>
          </TouchableOpacity>

          <ChatBox
            oyunId={oyunId}
            userId={userId}
            userName={benimOyuncum?.userName || "Ben"}
          />
        </View>
      </Modal>
      <Modal visible={oyunSonuModalGorunur} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 25,
            borderRadius: 20,
            alignItems: 'center',
            width: '80%'
          }}>

            {oyunSonuBilgi.durum === 'kazandi' && (
              <AntDesign name="Trophy" size={50} color="#ffd700" style={{ marginBottom: 10 }} />
            )}
            {oyunSonuBilgi.durum === 'kaybetti' && (
              <Ionicons name="sad-outline" size={50} color="#999" style={{ marginBottom: 10 }} />
            )}
            {oyunSonuBilgi.durum === 'bilgi' && (
              <Feather name="info" size={50} color="#4a90e2" style={{ marginBottom: 10 }} />
            )}
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: '#004d00' }}>
              {oyunSonuBilgi.baslik}
            </Text>
            <Text style={{ fontSize: 16, marginBottom: 20, color: '#1a661a', textAlign: 'center' }}>
              {oyunSonuBilgi.mesaj}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setOyunSonuModalGorunur(false);
                navigation.goBack();
              }}
              style={{
                backgroundColor: '#1a661a',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 10
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={uyariModalGorunur} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 25,
            borderRadius: 20,
            alignItems: 'center',
            width: '80%'
          }}>
            <Text style={{
              fontSize: 18,
              marginBottom: 20,
              textAlign: 'center',
              color: '#004d00'
            }}>
              {uyariMesaji}
            </Text>

            <TouchableOpacity
              onPress={() => setUyariModalGorunur(false)}
              style={{
                backgroundColor: '#1a661a',
                paddingVertical: 10,
                paddingHorizontal: 30,
                borderRadius: 10
              }}
            >
              <Text style={{ color: 'white', fontSize: 16 }}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal visible={teslimModalGorunur} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.6)',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 25,
            borderRadius: 20,
            alignItems: 'center',
            width: '80%'
          }}>
            <Feather name="alert-triangle" size={50} color="#f39c12" style={{ marginBottom: 10 }} />
            <Text style={{
              fontSize: 18,
              marginBottom: 20,
              textAlign: 'center',
              color: '#004d00'
            }}>
              Gerçekten teslim olmak istiyor musunuz?
            </Text>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                onPress={() => {
                  setTeslimModalGorunur(false);
                }}
                style={{
                  backgroundColor: '#ccc',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10,
                  marginRight: 10
                }}
              >
                <Text style={{ fontSize: 16 }}>İptal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  setTeslimModalGorunur(false);
                  await forfeitGame(oyunId, userId, digerOyuncu?.id);
                  setOyunSonuBilgi({
                    baslik: "Oyun Bitti",
                    mesaj: "Teslim oldunuz. Oyun sona erdi.",
                    durum: "kaybetti"
                  });
                  setOyunSonuModalGorunur(true);
                }}
                style={{
                  backgroundColor: '#1a661a',
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  borderRadius: 10
                }}
              >
                <Text style={{ color: 'white', fontSize: 16 }}>Evet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </View>
  );
}

const styles = StyleSheet.create({
  playerContainer: { flexDirection: 'row', justifyContent: 'space-between', margin: 10, marginBottom: 5 },
  playerBox: {
  flexDirection: 'row',
  borderWidth: 2,
  borderColor: '#ccc',
  borderRadius: 20,
  padding: 10,
  backgroundColor: '#e6ffe6',
  width: '49%',
  position: 'relative',
  marginTop:14,
},
  playerText: { fontSize: 11, fontWeight: 'bold', color: '#004d00' },
  playerScore: { fontSize: 18, fontWeight: 'bold', color: '#004d00' },
  profileImage: { width: 45, height: 45, borderRadius: 20 },
  addButton: { position: 'absolute', right: 3, top: 3, padding: 7 },
  ButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 10, backgroundColor: '#e6ffe6', borderTopLeftRadius: 20, borderTopRightRadius: 20, position: 'absolute', bottom: 0, width: '100%' },
  Button: { backgroundColor: 'white', borderRadius: 20, padding: 8, flex: 1, marginHorizontal: 4, alignItems: 'center' },
  ButtonText: { color: '#1a661a', fontWeight: 'bold', fontSize: 12, textAlign: 'center' },
  modalBackground: { flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  modalContainer: { backgroundColor: 'white', borderRadius: 15, padding: 10, marginBottom: 70, marginRight: 10, alignSelf: 'flex-end' },
  modalButton: { padding: 10, marginVertical: 3, width: 130, alignItems: 'center', backgroundColor: '#e6ffe6', borderRadius: 10 },
  rakipEtiketi: {
  position: 'absolute',
  bottom: 1,
  right: 1,
  margin:2,
  backgroundColor: '#004d00',
  color: '#fff',
  fontSize: 10,
  fontWeight: 'bold',
  paddingHorizontal: 6,
  paddingVertical: 2,
  borderRadius: 10,
  overflow: 'hidden',
  zIndex: 1,
},


});
