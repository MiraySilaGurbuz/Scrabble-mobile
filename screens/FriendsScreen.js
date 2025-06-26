import {
  StyleSheet,
  Text,
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  fetchAllUsers,
  addStaticFriends,
  fetchUserFriends,
  fetchFriendsDetails,
  removeFriend,
} from '../services/friendService';
import { auth } from '../firebase';
import { addGameWithFriend } from '../services/gameService';
import { onValue, ref } from 'firebase/database';
import { db } from '../firebase';

const profilResimListesi = {
  'profiller1.jpg': require('../assets/profiller/profiller1.jpg'),
  'profiller2.jpg': require('../assets/profiller/profiller2.jpg'),
  'profiller3.jpg': require('../assets/profiller/profiller3.jpg'),
  'profiller4.jpg': require('../assets/profiller/profiller4.jpg'),
  'profiller5.jpg': require('../assets/profiller/profiller5.jpg'),
};

export default function FriendsScreen() {
  const [search, setSearch] = useState('');
  const [mode, setMode] = useState('friends');
  const [allUsers, setAllUsers] = useState([]);
  const [friendIds, setFriendIds] = useState([]);
  const [addedFriends, setAddedFriends] = useState([]);
  const [friendsData, setFriendsData] = useState([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const [gameLoading, setGameLoading] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();

  const isAddMode = mode === 'add';
  const userId = auth.currentUser.uid;
  const selectionMode = route.params?.mode === 'select';

  useEffect(() => {
    const friendRef = ref(db, 'friends');

    const unsubscribe = onValue(friendRef, async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setFriendIds([]);
        setFriendsData([]);
        return;
      }

      const allFriendPairs = Object.values(data);
      const userFriends = allFriendPairs.filter(
        (pair) =>
          (pair.userOneId === userId || pair.userTwoId === userId) &&
          pair.IsActive === 1
      );

      const newFriendIds = userFriends.map((pair) =>
        pair.userOneId === userId ? pair.userTwoId : pair.userOneId
      );

      setFriendIds(newFriendIds);

      if (newFriendIds.length > 0) {
        const friendDetails = await fetchFriendsDetails(newFriendIds);
        setFriendsData(friendDetails);
      } else {
        setFriendsData([]);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadFriends = async () => {
      const friendList = await fetchUserFriends(userId);
      const friendIds = friendList.map((friend) => friend.userId);
      setFriendIds(friendIds);

      if (friendIds.length > 0) {
        const friendDetails = await fetchFriendsDetails(friendIds);
        setFriendsData(friendDetails);
      }
    };

    loadFriends();
  }, []);

  useEffect(() => {
    if (isAddMode) {
      fetchUsers(search);
    }
  }, [isAddMode, search]);

  const fetchUsers = async (searchTerm) => {
    const users = await fetchAllUsers(searchTerm);
    setAllUsers(users);
  };

  const toggleMode = () => {
    setMode((prev) => (prev === 'friends' ? 'add' : 'friends'));
    setSearch('');
    setAllUsers([]);
  };

  const addFriends = async (userId, userTwoId) => {
    await addStaticFriends(userId, userTwoId);
    setAddedFriends((prev) => [...prev, userTwoId]);
  };

  const filteredData = isAddMode
    ? allUsers.filter(
        (user) => !friendIds.includes(user.userId) && user.userId !== userId
      )
    : friendsData.filter((friend) =>
        friend.name.toLowerCase().includes(search.toLowerCase())
      );

  const promptRemoveFriend = (friendUserId) => {
    setSelectedFriendId(friendUserId);
    setConfirmVisible(true);
  };

  const confirmRemoveFriend = async () => {
    await removeFriend(userId, selectedFriendId);
    setFriendIds((prev) => prev.filter((id) => id !== selectedFriendId));
    setFriendsData((prev) =>
      prev.filter((friend) => friend.userId !== selectedFriendId)
    );
    setConfirmVisible(false);
    setSelectedFriendId(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="left" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>
          {isAddMode ? 'Yeni Arkadaş Ekle' : 'Arkadaşlar'}
        </Text>
        <TouchableOpacity onPress={toggleMode}>
          <AntDesign name={isAddMode ? 'close' : 'plus'} size={28} color="white" />
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder={isAddMode ? 'Yeni arkadaş ara...' : 'Arkadaş ara...'}
        placeholderTextColor="#a8d5a8"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={async () => {
              if (selectionMode) {
                setGameLoading(true);
                const createdGameId = await addGameWithFriend(userId, item.userId);
                setGameLoading(false);
                if (createdGameId) {
                  navigation.navigate('Oyunlarim', { tab: 'bekleyen' });
                }
              }
            }}
            disabled={!selectionMode}
          >
            <View style={styles.friendItem}>
              
              <Image
                source={
                  item.profilResmi && profilResimListesi[item.profilResmi]
                    ? profilResimListesi[item.profilResmi]
                    : require('../images/profile.jpg')
                }
                style={styles.profilePhotoSmall}
              />

              <Text style={styles.friendName}>{item.name}</Text>

              {!isAddMode && (
                <TouchableOpacity
                  onPress={() => promptRemoveFriend(item.userId)}
                  style={styles.removeButtonContainer}
                >
                  <View style={[styles.performanceTag, { backgroundColor: '#cc0000' }]}>
                    <AntDesign name="minus" size={20} color="white" />
                  </View>
                </TouchableOpacity>
              )}

              {isAddMode && (
                friendIds.includes(item.userId) || addedFriends.includes(item.userId) ? (
                  <View style={[styles.performanceTag, { marginLeft: 'auto' }]}>
                    <AntDesign name="check" size={24} color="white" />
                  </View>
                ) : (
                  <TouchableOpacity onPress={() => addFriends(userId, item.userId)} style={{ marginLeft: 'auto' }}>
                    <View style={styles.performanceTag}>
                      <AntDesign name="plus" size={24} color="white" />
                    </View>
                  </TouchableOpacity>
                )
              )}
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={() => setConfirmVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Bu kişiyi arkadaşlıktan çıkarmak istiyor musun?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setConfirmVisible(false)} style={styles.cancelButton}>
                <Text style={styles.modalButtonText}>İptal</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={confirmRemoveFriend} style={styles.confirmButton}>
                <Text style={styles.modalButtonText}>Evet</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={gameLoading} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Oyun oluşturuluyor...</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#004d00',
    padding: 16,
    paddingTop: 40,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#66bb66',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#003300',
    color: '#ffffff',
  },
  friendItem: {
    backgroundColor: '#006600',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 10,
  },
  profilePhotoSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ccc',
  },
  removeButtonContainer: {
    marginLeft: 'auto',
  },
  performanceTag: {
    backgroundColor: '#339933',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#004d00',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#999',
    padding: 10,
    marginRight: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#cc0000',
    padding: 10,
    marginLeft: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
