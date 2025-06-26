import { StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { db, auth } from '../firebase';

const profilResimListesi = {
  'profiller1.jpg': require('../assets/profiller/profiller1.jpg'),
  'profiller2.jpg': require('../assets/profiller/profiller2.jpg'),
  'profiller3.jpg': require('../assets/profiller/profiller3.jpg'),
  'profiller4.jpg': require('../assets/profiller/profiller4.jpg'),
  'profiller5.jpg': require('../assets/profiller/profiller5.jpg'),
};

export default function Score({ oyunId }) {
  const [player1, setPlayer1] = useState({ name: '', score: 0, id: '', profilResmi: '' });
  const [player2, setPlayer2] = useState({ name: '', score: 0, id: '', profilResmi: '' });
  const [gameResult, setGameResult] = useState('');
  const [resultColor, setResultColor] = useState('#fff');

  useEffect(() => {
    if (!oyunId) return;

    const gameRef = ref(db, `games/${oyunId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const gameData = snapshot.val();
      if (gameData) {
        const players = gameData.players || {};
        const playerList = Object.values(players);

        const p1 = playerList[0] || {};
        const p2 = playerList[1] || {};

        setPlayer1({
          name: p1.userName || 'Oyuncu 1',
          score: p1.score || 0,
          id: p1.id || '',
        });

        setPlayer2({
          name: p2.userName || 'Oyuncu 2',
          score: p2.score || 0,
          id: p2.id || '',
        });

        const currentUserId = auth.currentUser?.uid;
        if (gameData.winner) {
          if (gameData.winner === currentUserId) {
            setGameResult('Kazandın');
            setResultColor('#006400');
          } else {
            setGameResult('Kaybettin');
            setResultColor('#8B0000');
          }
        } else {
          setGameResult('Sonuç Yok');
          setResultColor('#333');
        }
      }
    });

    return () => unsubscribe();
  }, [oyunId]);

  
  useEffect(() => {
    const usersRef = ref(db, 'users');
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const entries = Object.values(data);

        const u1 = entries.find(u => u.UserId === player1.id);
        const u2 = entries.find(u => u.UserId === player2.id);

        setPlayer1(prev => ({ ...prev, profilResmi: u1?.profilResmi || '' }));
        setPlayer2(prev => ({ ...prev, profilResmi: u2?.profilResmi || '' }));
      }
    });

    return () => unsub();
  }, [player1.id, player2.id]);

  const getProfilResmi = (dosyaAdi) =>
    dosyaAdi && profilResimListesi[dosyaAdi]
      ? profilResimListesi[dosyaAdi]
      : require('../images/profile.jpg');

  return (
    <View style={styles.ScoreContainer}>
      <View style={styles.Score}>
        <Image source={getProfilResmi(player1.profilResmi)} style={styles.image} />
        <View style={{ marginLeft: 20 }}>
          <Text style={styles.ScoreText}>Puan: {player1.score}</Text>
          <Text style={styles.ScoreText}>{player1.name}</Text>
        </View>
      </View>

      <View style={styles.Score}>
        <Image source={getProfilResmi(player2.profilResmi)} style={styles.image} />
        <View style={{ marginLeft: 20 }}>
          <Text style={styles.ScoreText}>Puan: {player2.score}</Text>
          <Text style={styles.ScoreText}>{player2.name}</Text>
        </View>
      </View>

      <View style={{ width: '100%', alignItems: 'center', marginTop: 8 }}>
        <View style={styles.resultBox}>
          <Text style={[styles.resultText, { color: resultColor }]}>
            {gameResult}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ScoreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 2,
    marginRight: 2,
    borderRadius: 20,
    backgroundColor: '#339933',
    borderWidth: 2,
    borderColor: '#004d00',
    marginVertical: 7,
    padding: 10,
  },
  Score: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 20,
    paddingLeft: 10,
    width: '49%',
  },
  ScoreText: {
    color: '#fff',
    marginVertical: 2,
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  resultBox: {
    backgroundColor: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resultText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
