import axios from "axios";
import UserModel from "../models/UserModel";

const DATABASE_URL = "https://scrabbleyeni-default-rtdb.firebaseio.com";

export async function getAllActiveUsersInformations() {
  try {
    const response = await axios.get(`${DATABASE_URL}/users.json`);

    if (response.data) {
      const allUsers = Object.values(response.data);

      const activeUsers = allUsers.filter(user => user.IsActive === true);

      console.log("Aktif kullanıcılar başarıyla çekildi:", activeUsers);
      return activeUsers;
    } else {
      console.log("Kullanıcılar bulunamadı.");
      return [];
    }
  } catch (error) {
    console.error("Kullanıcılar çekme hatası:", error);
    return [];
  }
}

export async function getAllActiveUsersId() {
  try {
    const response = await axios.get(`${DATABASE_URL}/users.json`);

    if (response.data) {
      const activeUsers = Object.values(response.data)
        .filter(user => user.IsActive === true)
        .map(user => user.UserId);
      console.log(activeUsers)
      console.log("Aktif kullanıcı userId'leri başarıyla çekildi:", activeUsers);
      return activeUsers;
    } else {
      console.log("Kullanıcılar bulunamadı.");
      return [];
    }
  } catch (error) {
    console.error("Kullanıcılar çekme hatası:", error);
    return [];
  }
}


  export const addActiveUsers = async (userId, email) => {
    const userName = email.split('@')[0];
    const user = new UserModel(userId, email, userName, true);
  
    try {
      const response = await axios.post(`${DATABASE_URL}/users.json`, user);
      console.log("Kullanıcı aktif edildi.");
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };

  export const changeUsersPassive = async (userId) => {
    try {
      const response = await axios.get(`${DATABASE_URL}/users.json`);
      const users = response.data;
  
      const userEntry = Object.entries(users).find(
        ([_, user]) => user.userId === userId
      );
  
      if (!userEntry) {
        console.warn("Kullanıcı bulunamadı.");
        return;
      }
  
      const [firebaseUserKey] = userEntry;
  
      const updatedData = {
        isActive: false,
      };
  
      await axios.patch(`${DATABASE_URL}/users/${firebaseUserKey}.json`, updatedData);
      console.log("Kullanıcı pasif edildi.");
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };
  
  
  export const getUserNameById = async (userId) => {
    try {
      const response = await axios.get(`${DATABASE_URL}/users.json`);
      
      if (response.data) {
        const users = Object.values(response.data);
        const matchingUser = users.find(user => user.UserId === userId);
        console.log(matchingUser)
        return matchingUser?.UserName || null;
      }
  
      return null;
    } catch (error) {
      console.error("Kullanıcı emaili alınırken hata:", error);
      return null;
    }
  };
  
  
