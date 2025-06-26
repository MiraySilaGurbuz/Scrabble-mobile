import axios from "axios";
import FriendModel from "../models/FriendModel";
import { auth } from '../firebase';

const DATABASE_URL = "your_url";

export async function getAllFriends(userId) {
  try {
    const response = await axios.get(`${DATABASE_URL}/friends.json`);
    
    if (response.data) {
      const allEntries = Object.values(response.data);

      const filteredFriends = allEntries.filter(friend =>
        friend.isActive === 1 &&
        (friend.userOneId === userId || friend.userTwoId === userId)
      );

      console.log("Filtrelenmiş arkadaşlar başarıyla çekildi:", filteredFriends);
      return filteredFriends;
    } else {
      console.log("Veri bulunamadı.");
      return [];
    }
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    return [];
  }
}


export const addStaticFriends = async (userOneId, userTwoId) => {
  const friend = new FriendModel(
    userOneId,
    userTwoId,
    1
  );

  try {
    const response = await axios.post(`${DATABASE_URL}/friends.json`, friend);
    console.log("Arkadaş başarıyla eklendi:", response.data);
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
};


export const fetchAllUsers = async (search) => {
  try {
    const currentUser = auth.currentUser;
    const response = await axios.get(`${DATABASE_URL}/users.json`);
    const data = response.data;

    if (!data) return [];

    return Object.entries(data)
      .map(([id, user]) => ({
        id,
        name: user.UserName || '',
        email: user.Email || '',
        userId: user.UserId || '',
        isActive: user.IsActive ?? false,
        profilResmi: user.profilResmi,
      }))
      .filter(
        (u) =>
          u.isActive &&
          u.userId !== currentUser.uid &&
          (
            u.name.toLowerCase().includes(search.toLowerCase()) ||
            u.email.toLowerCase().includes(search.toLowerCase())
          )
      );
  } catch (error) {
    console.error('Kullanıcılar alınamadı:', error);
    return [];
  }
};

export async function fetchUserFriends(userId) {
  try {
    const response = await axios.get(`${DATABASE_URL}/friends.json`);
    //console.log("response",response.data);
    if (!response.data) return [];

    const allFriendPairs = Object.values(response.data);
    //console.log(allFriendPairs)
    
    const userFriends = allFriendPairs.filter(
      (pair) =>
        (pair.userOneId === userId || pair.userTwoId === userId) &&
        pair.IsActive === 1
    );

    //console.log(userFriends)

    const friendUserIds = userFriends.map(pair =>
      pair.userOneId === userId ? pair.userTwoId : pair.userOneId
    );
    //console.log("friendUserIds",friendUserIds)

    return friendUserIds.map(id => ({ userId: id }));
  } catch (error) {
    console.error('Arkadaşlar alınamadı:', error);
    return [];
  }
};


export const fetchFriendsDetails = async (friendIds) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/users.json`);
    const users = response.data;
    console.log("users", users)
    
    console.log("friendIds", friendIds)
    if (!users) return [];
    return Object.entries(users)
      .map(([id, user]) => ({
        id,
        name: user.UserName || '',
        email: user.Email || '',
        userId: user.UserId,
        performance: user.Performance || 0,
        isActive: user.IsActive,
        profilResmi: user.profilResmi,
      }))
      .filter(user => friendIds.includes(user.userId));
  } catch (error) {
    console.error("Arkadaş detayları alınamadı:", error);
    return [];
  }
};

export const removeFriend = async (userId, friendId) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/friends.json`);
    const allEntries = response.data;
//console.log(allEntries);
    const friendshipKey = Object.keys(allEntries).find(
      key =>
        (allEntries[key].userOneId === userId && allEntries[key].userTwoId === friendId) ||
        (allEntries[key].userOneId === friendId && allEntries[key].userTwoId === userId)
    );
//console.log("friendshipKey",friendshipKey);
    if (friendshipKey) {
      await axios.delete(`${DATABASE_URL}/friends/${friendshipKey}.json`);
    }
  } catch (error) {
    console.error("Arkadaş silme hatası:", error);
  }
};

