import axios from "axios";
import GameModel from "../models/GameModel";
import GameBoardSquareModel from "../models/GameBoardSquareModel";
import {getAllActiveUsersId} from "../services/userService";
import { getUserNameById } from "../services/userService";
import {getActiveLettersForPlayer} from "../services/LetterService"
import { ref, update } from "firebase/database";
import { db } from "../firebase";

const DATABASE_URL = "https://scrabbleyeni-default-rtdb.firebaseio.com";

export async function getAllGames(playerId) {
  try {
    const response = await axios.get(`${DATABASE_URL}/games.json`);
    if (response.data) {
      console.log("Veriler başarıyla çekildi");
      return response.data;
    } else {
      console.log("Veri bulunamadı.");
      return [];
    }
  } catch (error) {
    console.error("Veri çekme hatası:", error);
    return [];
  }
};

export const addRandomGame = async (hostId) => {
  try {
    const activeUserIds = await getAllActiveUsersId();
    const filteredUserIds = activeUserIds.filter(userId => userId !== hostId);

    if (filteredUserIds.length === 0) return null;

    const randomIndex = Math.floor(Math.random() * filteredUserIds.length);
    const player2Id = filteredUserIds[randomIndex];

    const hostUserName = await getUserNameById(hostId);
    const player2UserName = await getUserNameById(player2Id);
    const oyuncular = [
      { id: hostId, userName: hostUserName, score:0 },
      { id: player2Id, userName: player2UserName, score:0 }
    ];

    const oyun = new GameModel(
      [],          
      0,
      oyuncular,
      null, 
      player2Id, 
      hostId,
      player2Id,
    );

    const response = await axios.post(`${DATABASE_URL}/games.json`, oyun);
    const createdGameId = response.data.name;

    console.log("Oyun başarıyla oluşturuldu. ID:", createdGameId);
    return createdGameId;

  } catch (error) {
    console.error("Hata oluştu:", error);
    return null;
  }
};


/*
export const addStaticGameBoardSquare = async (oyunId) => {
  const oyun = new GameBoardSquareModel(
    1,
    1,
    "T",
    "#ffffff",
    2,
    "0/1",
    2,
    2
  );

  try {
    const response = await axios.post(`${DATABASE_URL}/GameBoard.json`, oyun);
    console.log("Oyun başarıyla eklendi:", response.data);
  } catch (error) {
    console.error("Hata oluştu:", error);
  }
};*/

export const getGameBoardByOyunId = async (oyunId) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/GameBoard/${oyunId}.json`);
    if (response.data) {
      const allData = Object.values(response.data);
      return allData;
    }
    return [];
  } catch (error) {
    console.error("GameBoard verisi çekilirken hata:", error);
    return [];
  }
};

export const getMyGamesByUserId = async (userId) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/games.json`);
    if (response.data) {
      return Object.entries(response.data)
        .filter(([_, entry]) => entry.host === userId || entry.invated === userId)
        .map(([id, entry]) => ({ id, ...entry }));
    }
    return [];
  } catch (error) {
    console.error("oyunlar verisi çekilirken hata:", error);
    return [];
  }
};

export const updateGameStatus = async (gameId, newStatus) => {
  await axios.patch(`${DATABASE_URL}/games/${gameId}.json`, { status: newStatus });
};

export const deleteGame = async (gameId) => {
  await axios.delete(`${DATABASE_URL}/games/${gameId}.json`);
};

export const getGameById = async (gameId) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/games/${gameId}.json`);
    if (response.data) {
      return { id: gameId, ...response.data };
    } else {
      console.warn(`Oyun bulunamadı: ${gameId}`);
      return null;
    }
  } catch (error) {
    console.error(`Oyun verisi çekilirken hata oluştu: ${error}`);
    return null;
  }
};

export const updateGameTurn = async (oyunId, yeniOyuncuId) => {
  if (!yeniOyuncuId) {
    console.warn("❗Yeni oyuncu ID geçersiz, turn güncellenmedi.");
    return;
  }
  
  await axios.patch(`${DATABASE_URL}/games/${oyunId}.json`, {
      turn: yeniOyuncuId,
    });

  console.log(`✅ Turn başarıyla güncellendi: ${yeniOyuncuId}`);
};

export const updatePassCounts = async (oyunId, userId) => {
  if (!userId) {
    console.warn("❗Yeni oyuncu ID geçersiz, turn güncellenmedi.");
    return;
  }

  await axios.patch(`${DATABASE_URL}/games/${oyunId}.json`, {
      [`passCounts/${userId}`]: 0
  });

  console.log(`✅ passCounts başarıyla güncellendi: ${userId}`);
};

export const increasePassCount = async (oyunId, userId) => {
  try {
    const path = `${DATABASE_URL}/games/${oyunId}/passCounts/${userId}.json`;

    const response = await axios.get(path);
    const mevcut = response.data ?? 0;
console.log(mevcut)
    const yeniDeger = mevcut + 1;

     await axios.patch(`${DATABASE_URL}/games/${oyunId}.json`, {
        [`passCounts/${userId}`]: yeniDeger
    });

    console.log(`🔁 ${userId} için yeni pas sayısı: ${yeniDeger}`);
    return yeniDeger;
  } catch (error) {
    console.error("❌ Pas sayısı artırılamadı:", error);
    return null;
  }
};

export const İlkHamleDoğrulaması= async (oyunId, taslarim) => { 
  try {
    const boardData = await getGameBoardByOyunId(oyunId);

    if (!boardData || boardData.length === 0) {
      const hasOrtaKareTas = taslarim?.some(tas => tas.anaDeger === 113);

      if (!hasOrtaKareTas) {
        return {
          isValid: false,
          message: 'İlk hamlede oluşturulan kelimenin bir harfi oyun tahtasının ortasındaki kırmızı daireli kutucuğa gelecek şekilde yerleştirilmelidir!',
        };
      }

     return {
      isValid: true,
      message: 'Oyun tahtası bulundu, hamle doğrulaması yapılabilir.',
    }; 
    }
    return {
      isValid: true,
      message: 'Oyun tahtası bulundu, hamle doğrulaması yapılabilir.',
    };
  } catch (error) {
    console.error("Hamle doğrulama sırasında hata:", error);
    return {
      isValid: false,
      message: 'Sunucu hatası: Oyun verisi alınamadı.',
    };
  }
};

export const TumBagliHarfler = async (oyunId, taslarim) => {
  try {
    const boardData = await getGameBoardByOyunId(oyunId);
    if (!boardData || boardData.length === 0) return taslarim;

    const boardMap = new Map();
    boardData.forEach(tas => boardMap.set(tas.anaDeger, tas));

    const tumIlgiliTaslar = new Map();

    const yonler = [
      { ad: 'sag', degisim: +1, ters: -1 },
      { ad: 'sol', degisim: -1, ters: +1 },
      { ad: 'asagi', degisim: +15, ters: -15 },
      { ad: 'yukari', degisim: -15, ters: +15 },
    ];

    for (const tas of taslarim) {
      tumIlgiliTaslar.set(tas.anaDeger, { ...tas, letter: tas.letter || tas.baslik });

      for (const { degisim, ters } of yonler) {
        const bagliAnaDeger = tas.anaDeger + degisim;

        if (boardMap.has(bagliAnaDeger)) {
          
          let current = tas.anaDeger;
          while (true) {
            current += ters;
            const bagliTas = boardMap.get(current);
            if (!bagliTas || tumIlgiliTaslar.has(current)) break;

            tumIlgiliTaslar.set(current, {
              ...bagliTas,
              letter: bagliTas.letter || bagliTas.baslik,
            });
          }

          
          current = bagliAnaDeger;
          while (true) {
            const ileriTas = boardMap.get(current);
            if (!ileriTas || tumIlgiliTaslar.has(current)) break;

            tumIlgiliTaslar.set(current, {
              ...ileriTas,
              letter: ileriTas.letter || ileriTas.baslik,
            });

            current += degisim;
          }
        }
      }
    }

    return Array.from(tumIlgiliTaslar.values());
  } catch (error) {
    console.error("Bağlantılı taşlar alınırken hata:", error);
    return taslarim;
  }
};



export const TumKelimeler = (tumTaslar) => {
  const anaDegerToTasMap = new Map();
  tumTaslar.forEach(tas => anaDegerToTasMap.set(tas.anaDeger, tas));

  const visited = new Set();
  const kelimeler = [];

  const getHorizontalWord = (startTas) => {
    let rowStart = startTas.anaDeger;

    while (
      anaDegerToTasMap.has(rowStart - 1) &&
      Math.floor((rowStart - 1) / 15) === Math.floor(startTas.anaDeger / 15)
    ) {
      rowStart -= 1;
    }

    let current = rowStart;
    const wordTiles = [];

    while (
      anaDegerToTasMap.has(current) &&
      Math.floor(current / 15) === Math.floor(startTas.anaDeger / 15)
    ) {
      wordTiles.push(anaDegerToTasMap.get(current));
      current += 1;
    }

    if (wordTiles.length > 1) {
      wordTiles.forEach(t => visited.add(t.anaDeger));
      return wordTiles.map(t => t.letter || t.baslik).join("");
    }

    return null;
  };
  
  const getVerticalWord = (startTas) => {
    let colStart = startTas.anaDeger;
    while (anaDegerToTasMap.has(colStart - 15)) {
      colStart -= 15;
    }

    let current = colStart;
    const wordTiles = [];
    while (anaDegerToTasMap.has(current)) {
      wordTiles.push(anaDegerToTasMap.get(current));
      current += 15;
    }

    if (wordTiles.length > 1) {
      wordTiles.forEach(t => visited.add(t.anaDeger));
      return wordTiles.map(t => t.letter || t.baslik).join("");
    }

    return null;
  };

  tumTaslar.forEach(tas => {
    if (!visited.has(tas.anaDeger)) {
      const yatayKelime = getHorizontalWord(tas);
      if (yatayKelime) kelimeler.push(yatayKelime);

      const dikeyKelime = getVerticalWord(tas);
      if (dikeyKelime) kelimeler.push(dikeyKelime);
    }
  });

  return kelimeler;
};

export const addGameWithFriend = async (hostId, friendId) => {
  try {
    
    const hostUserName = await getUserNameById(hostId);
    const friendsUserName = await getUserNameById(friendId);
    
    const oyuncular = [
      { id: hostId, userName: hostUserName, score:0 },
      { id: friendId, userName: friendsUserName, score:0 }
    ];

    const oyun = new GameModel(
      [],          
      0,
      oyuncular,
      null, 
      friendId, 
      hostId,
      friendId,
    );

    const response = await axios.post(`${DATABASE_URL}/games.json`, oyun);
    const createdGameId = response.data.name;

    console.log("Arkadasla oyun başarıyla oluşturuldu. ID:", createdGameId);
    return createdGameId;

  } catch (error) {
    console.error("Hata oluştu:", error);
    return null;
  }
};

export const TumKelimelerPuanlamaIcin = (tumTaslar) => {
  const anaDegerToTasMap = new Map();
  tumTaslar.forEach(tas => anaDegerToTasMap.set(tas.anaDeger, tas));

  const visited = new Set();
  const kelimelerListesi = [];

  const getHorizontalWord = (startTas) => {
    let rowStart = startTas.anaDeger;
    while (
      anaDegerToTasMap.has(rowStart - 1) &&
      Math.floor((rowStart - 1) / 15) === Math.floor(startTas.anaDeger / 15)
    ) {
      rowStart -= 1;
    }

    let current = rowStart;
    const wordTiles = [];
    while (
      anaDegerToTasMap.has(current) &&
      Math.floor(current / 15) === Math.floor(startTas.anaDeger / 15)
    ) {
      wordTiles.push(anaDegerToTasMap.get(current));
      current += 1;
    }

    if (wordTiles.length > 1) {
      wordTiles.forEach(t => visited.add(t.anaDeger));
      kelimelerListesi.push([...wordTiles]);
    }
  };

  const getVerticalWord = (startTas) => {
    let colStart = startTas.anaDeger;
    while (anaDegerToTasMap.has(colStart - 15)) {
      colStart -= 15;
    }

    let current = colStart;
    const wordTiles = [];
    while (anaDegerToTasMap.has(current)) {
      wordTiles.push(anaDegerToTasMap.get(current));
      current += 15;
    }

    if (wordTiles.length > 1) {
      wordTiles.forEach(t => visited.add(t.anaDeger));
      kelimelerListesi.push([...wordTiles]);
    }
  };

  tumTaslar.forEach(tas => {
    if (!visited.has(tas.anaDeger)) {
      getHorizontalWord(tas);
      getVerticalWord(tas);
    }
  });

  return kelimelerListesi;
};


export const forfeitGame = async (oyunId, userId, rakipId) => {
  try {
    const gameRef = ref(db, `games/${oyunId}`);

    await update(gameRef, {
      status: 2,
      winner: rakipId,
      gameEndReason: "teslim",
      message: "Oyunculardan biri oyunu terk etti.",
    });
  } catch (error) {
    console.error("Teslim olma sırasında hata:", error);
  }
};

export const UcKerePasGecildi = async (oyunId, userId, rakipId) => {
  try {
    const gameRef = ref(db, `games/${oyunId}`);

    await update(gameRef, {
      status: 2,
      winner: rakipId,
      gameEndReason: "uc_pas",
      message: "Oyunculardan biri uc kere pas gecti.",
    });
  } catch (error) {
    console.error("pas sırasında hata:", error);
  }
};