import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Score from '../components/Score';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function ScoreScreen() {
  const navigation = useNavigation();
  const [myGameIds, setMyGameIds] = useState([]);
  const [performance, setPerformance] = useState(0);
  const [winCount, setWinCount] = useState(0);
  const userId = auth.currentUser?.uid;

 useEffect(() => {
  if (!userId) return;

  const gamesRef = ref(db, 'games/');
  const unsubscribe = onValue(gamesRef, (snapshot) => {
    const data = snapshot.val();
    if (!data) {
      setMyGameIds([]);
      setPerformance(0);
      setWinCount(0);
      return;
    }

    let wins = 0;

    const filteredGameIds = Object.entries(data)
      .filter(([gameId, game]) => {
        const players = game.players || {};
        const playerArray = Object.values(players);
        const userIsParticipant = playerArray.some(player => player?.id === userId);
        const gameHasStatus = game.status == 2 || game.status === "2"; // ✅

        console.log("players", players);
        console.log("playerArray", playerArray);
        console.log("userIsParticipant", userIsParticipant);
        console.log("gameHasStatus", gameHasStatus);

        return userIsParticipant && gameHasStatus;
      })
      .map(([gameId, game]) => {
        if (game.winner === userId || game.winner?.toString() === userId) {
          wins += 1;
          console.log("Kazandığım oyun:", gameId);
        }
        return gameId;
      });

    const total = filteredGameIds.length;
    const performancePercent = total > 0 ? Math.round((wins / total) * 100) : 0;

    console.log("Toplam tamamlanmış oyun:", total);
    console.log("Toplam kazanılan oyun:", wins);
    console.log("Performans %:", performancePercent);

    setMyGameIds(filteredGameIds);
    setPerformance(performancePercent);
    setWinCount(wins);
  });

  return () => unsubscribe();
}, [userId]);


  return (
    <ScrollView style={styles.Container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={{ flexDirection: 'row', alignItems: 'center', borderRadius: 50, marginBottom: 10 }}
      >
        <AntDesign name="left" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Skorlar</Text>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Performans</Text>
          <Text style={styles.statValue}>%{performance}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Kazanılan Oyun</Text>
          <Text style={styles.statValue}>{winCount}</Text>
        </View>
      </View>

      {myGameIds.map((id) => (
        <Score key={id} oyunId={id} />
      ))}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: '#004d00',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#e6ffe6',
    padding: 15,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004d00',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#006600',
    marginTop: 5,
  },
});
