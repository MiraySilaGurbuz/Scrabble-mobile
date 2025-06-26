import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onValue, ref as dbRef } from 'firebase/database';

const profilResimListesi = {
  'profiller1.jpg': require('../assets/profiller/profiller1.jpg'),
  'profiller2.jpg': require('../assets/profiller/profiller2.jpg'),
  'profiller3.jpg': require('../assets/profiller/profiller3.jpg'),
  'profiller4.jpg': require('../assets/profiller/profiller4.jpg'),
  'profiller5.jpg': require('../assets/profiller/profiller5.jpg'),
};

export default function AGame({ game, onPress, isMine }) {
  const currentUserId = auth.currentUser?.uid;
  const [profilResimleri, setProfilResimleri] = useState({});

  const oyunKodu = "#" + game.id.slice(-4).toUpperCase();

  useEffect(() => {
    const usersRef = dbRef(db, 'users');
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const updatedResimler = {};
        game.players.forEach(p => {
          const userEntry = Object.values(data).find(user => user.UserId === p.id);
          if (userEntry?.profilResmi) {
            updatedResimler[p.id] = userEntry.profilResmi;
          }
        });
        setProfilResimleri(updatedResimler);
      }
    });
  }, [game.players]);

  const getProfilResmi = (userId) => {
    const dosyaAdi = profilResimleri[userId];
    return dosyaAdi && profilResimListesi[dosyaAdi]
      ? profilResimListesi[dosyaAdi]
      : require('../images/profile.jpg');
  };

  return (
    <TouchableOpacity
      style={[
        styles.ScoreContainer,
        isMine ? styles.mine : styles.theirs
      ]}
      onPress={() => onPress?.(game)}
      activeOpacity={0.6}
    >
      <View style={styles.headerRow}>
        <Text style={styles.leftHeader}>
          {`${oyunKodu}  •  Rakip: ${game.players.find(p => p.id !== currentUserId)?.userName ?? "Rakip"}`}
        </Text>
        {!isMine && (
          <View style={styles.badgeWrapper}>
            <Text style={styles.badgeText}>Rakibin Daveti</Text>
          </View>
        )}
      </View>

      <View style={styles.playerContainer}>
        {game.players.map((player, i) => (
          <View key={i} style={styles.Score}>
            <Image source={getProfilResmi(player.id)} style={styles.image} />
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.Scores}>{player.score ?? 0}</Text>
              <Text style={styles.ScoreText}>{player.userName ?? `Oyuncu ${i + 1}`}</Text>
            </View>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  ScoreContainer: {
    borderRadius: 20,
    borderWidth: 2,
    marginVertical: 7,
    padding: 10,
    marginHorizontal: 4,
  },
  mine: {
    backgroundColor: '#2e7d32',
    borderColor: '#1b5e20',
  },
  theirs: {
    backgroundColor: '#66bb6a',
    borderColor: '#388e3c',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 10,
  },
  leftHeader: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  badgeWrapper: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  Score: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
  },
  ScoreText: {
    color: '#fff',
    marginTop: 2,
    fontWeight: 'bold',
    fontSize: 14,
  },
  Scores: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
});
