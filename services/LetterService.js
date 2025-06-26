import axios from "axios";
import LetterModel from "../models/LetterModel";
import HarfOyuncuMapModel from "../models/HarfOyuncuMapModel";
import {TumBagliHarfler, TumKelimeler, TumKelimelerPuanlamaIcin} from "../services/gameService";

const DATABASE_URL = "https://scrabbleyeni-default-rtdb.firebaseio.com";

export const addMultipleTurkishLetters = async () => {
  const boardData = [
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),
    new LetterModel("A", 1),

    
    new LetterModel("E", 1),
    new LetterModel("E", 1),
    new LetterModel("E", 1),
    new LetterModel("E", 1),
    new LetterModel("E", 1),
    new LetterModel("E", 1),
    new LetterModel("E", 1),
    new LetterModel("E", 1),

    new LetterModel("İ", 2),
    new LetterModel("İ", 2),
    new LetterModel("İ", 2),
    new LetterModel("İ", 2),
    
    new LetterModel("K", 1),
    new LetterModel("K", 1),
    new LetterModel("K", 1),
    new LetterModel("K", 1),

    new LetterModel("L", 1),
    new LetterModel("L", 1),
    new LetterModel("L", 1),
    new LetterModel("L", 1),
    
    new LetterModel("R", 1),
    new LetterModel("R", 1),
    new LetterModel("R", 1),
    new LetterModel("R", 1),
    new LetterModel("R", 1),
    new LetterModel("R", 1),
    
    new LetterModel("N", 1),
    new LetterModel("N", 1),
    new LetterModel("N", 1),
    new LetterModel("N", 1),
    new LetterModel("N", 1),
    
    new LetterModel("T", 1),
    new LetterModel("T", 1),
    new LetterModel("T", 1),
    new LetterModel("T", 1),
    new LetterModel("T", 1),
    
    new LetterModel("M", 2),
    new LetterModel("M", 2),
    
    new LetterModel("O", 2),
    new LetterModel("O", 2),
    new LetterModel("O", 2),
    
    new LetterModel("U", 2),
    new LetterModel("U", 2),
    new LetterModel("U", 2),
    
    new LetterModel("S", 2),
    new LetterModel("S", 2),
    new LetterModel("S", 2),
    
    new LetterModel("D", 3),
    new LetterModel("D", 3),
    new LetterModel("D", 3),
    
    new LetterModel("Y", 3),
    new LetterModel("Y", 3),
    new LetterModel("Y", 3),
    
    new LetterModel("B", 3),
    new LetterModel("B", 3),
    
    new LetterModel("C", 4),
    new LetterModel("C", 4),

    new LetterModel("H", 5),
    
    new LetterModel("P", 5),
    new LetterModel("P", 5),
    
    new LetterModel("Z", 4),
    
    new LetterModel("G", 3),
    new LetterModel("G", 3),
    
    new LetterModel("Ş", 4),
    
    new LetterModel("Ç", 4),
    
    new LetterModel("Ü", 2),
    new LetterModel("Ü", 2),
    
    new LetterModel("Ö", 2),
    
    new LetterModel("Ğ", 8),
    
    new LetterModel("F", 7),
    
    new LetterModel("V", 7),
    
    new LetterModel("J", 10),

    new LetterModel(" ", 0),
    new LetterModel(" ", 0),
  ];

  try {
    const promises = boardData.map((board) =>
      axios.post(`${DATABASE_URL}/TurkishLetters.json`, board)
    );

    await Promise.all(promises);
    console.log("Türkçe harfler başarıyla eklendi.");
  } catch (error) {
    console.error("Türkçe harf ekleme hatası:", error);
  }
};

export async function getAllTurhishLetters(params) {
    try {

      const response = await axios.get(`${DATABASE_URL}/TurkishLetters.json`);
      
      if (response.data) {
        console.log("Türkçe harfler başarıyla çekildi");
        return response.data;
      } else {
        console.log("Türkçe harfler bulunamadı.");
        return [];
      }
    } catch (error) {
      console.error("Türkçe harf çekme hatası:", error);
      return [];
    }
  };

  export const addMultipleEnglishLetters = async () => {
    const boardData = [
      new LetterModel("A", 1),
      new LetterModel("A", 1),
      new LetterModel("A", 1),
      new LetterModel("A", 1),
      new LetterModel("A", 1),
      new LetterModel("A", 1),
      new LetterModel("A", 1),
      new LetterModel("A", 1),
      new LetterModel("A", 1),
  
      
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
      new LetterModel("E", 1),
  
      new LetterModel("I", 1),
      new LetterModel("I", 1),
      new LetterModel("I", 1),
      new LetterModel("I", 1),
      new LetterModel("I", 1),
      new LetterModel("I", 1),
      new LetterModel("I", 1),
      new LetterModel("I", 1),
      new LetterModel("I", 1),
      
      new LetterModel("K", 5),
  
      new LetterModel("L", 1),
      new LetterModel("L", 1),
      new LetterModel("L", 1),
      new LetterModel("L", 1),
      
      new LetterModel("R", 1),
      new LetterModel("R", 1),
      new LetterModel("R", 1),
      new LetterModel("R", 1),
      new LetterModel("R", 1),
      new LetterModel("R", 1),
      
      new LetterModel("N", 1),
      new LetterModel("N", 1),
      new LetterModel("N", 1),
      new LetterModel("N", 1),
      new LetterModel("N", 1),
      new LetterModel("N", 1),
      
      new LetterModel("T", 1),
      new LetterModel("T", 1),
      new LetterModel("T", 1),
      new LetterModel("T", 1),
      new LetterModel("T", 1),
      new LetterModel("T", 1),
      
      new LetterModel("M", 3),
      new LetterModel("M", 3),
      
      new LetterModel("O", 1),
      new LetterModel("O", 1),
      new LetterModel("O", 1),
      new LetterModel("O", 1),
      new LetterModel("O", 1),
      new LetterModel("O", 1),
      new LetterModel("O", 1),
      new LetterModel("O", 1),
      
      new LetterModel("U", 1),
      new LetterModel("U", 1),
      new LetterModel("U", 1),
      new LetterModel("U", 1),
      
      new LetterModel("S", 1),
      new LetterModel("S", 1),
      new LetterModel("S", 1),
      new LetterModel("S", 1),
      
      new LetterModel("D", 2),
      new LetterModel("D", 2),
      new LetterModel("D", 2),
      new LetterModel("D", 2),
      
      new LetterModel("Y", 4),
      new LetterModel("Y", 4),
      
      new LetterModel("B", 3),
      new LetterModel("B", 3),
      
      new LetterModel("C", 3),
      new LetterModel("C", 3),
  
      new LetterModel("H", 4),
      new LetterModel("H", 4),
      
      new LetterModel("P", 3),
      new LetterModel("P", 3),
      
      new LetterModel("Z", 10),
      
      new LetterModel("G", 2),
      new LetterModel("G", 2),
      new LetterModel("G", 2),
      
      new LetterModel("X", 8),
      
      new LetterModel("Ü", 2),
      new LetterModel("Ü", 2),
      
      new LetterModel("W", 4),
      new LetterModel("W", 4),
      
      new LetterModel("Q", 10),
      
      new LetterModel("F", 4),
      new LetterModel("F", 4),
      
      new LetterModel("V", 4),
      new LetterModel("V", 4),
      
      new LetterModel("J", 8),

      new LetterModel(" ", 0),
      new LetterModel(" ", 0),
    ];
  
    try {
      const promises = boardData.map((board) =>
        axios.post(`${DATABASE_URL}/EnglishLetters.json`, board)
      );
  
      await Promise.all(promises);
      console.log("İngilizce harfler başarıyla eklendi.");
    } catch (error) {
      console.error("İngilizce harf ekleme hatası:", error);
    }
  };

  export async function getAllEnglishLetters(params) {
    try {

      const response = await axios.get(`${DATABASE_URL}/EnglishLetters.json`);
      
      if (response.data) {
        console.log("İngilizce harfler başarıyla çekildi");
        return response.data;
      } else {
        console.log("İngilizce harfler bulunamadı.");
        return [];
      }
    } catch (error) {
      console.error("İngilizce harf çekme hatası:", error);
      return [];
    }
  };

  export const getActiveLetterCountForPlayer = async (oyunId, oyuncuId) => {
    try {
      const response = await axios.get(`${DATABASE_URL}/HarfOyuncuMap.json`);
  
      if (response.data) {
        const allEntries = Object.values(response.data);
        const filtered = allEntries.filter(
          (entry) =>
            entry.oyunId === oyunId &&
            entry.oyuncuId === oyuncuId &&
            entry.durumId === 0
        );
        
        console.log(
          `Oyun ID: ${oyunId}, Oyuncu ID: ${oyuncuId} için aktif harf sayısı: ${filtered.length}`
        );
        return filtered.length;
      } else {
        console.log("HarfOyuncuMap verisi bulunamadı.");
        return 0;
      }
    } catch (error) {
      console.error("HarfOyuncuMap sorgulama hatası:", error);
      return 0;
    }
  };

  export const getLetterIdsForGame = async (oyunId) => {
    try {
      const response = await axios.get(`${DATABASE_URL}/HarfOyuncuMap.json`);
  
      if (response.data) {
        const allEntries = Object.values(response.data);
        
        const harfIdList = allEntries
        .filter(entry => entry.oyunId === oyunId)
        .map(entry => entry.tasId); 

        console.log(
          `Oyun ID: ${oyunId} için harfId listesi:`,
          harfIdList
        );
        return harfIdList;
      } else {
        console.log("HarfOyuncuMap verisi bulunamadı.");
        return [];
      }
    } catch (error) {
      console.error("HarfOyuncuMap sorgulama hatası:", error);
      return [];
    }
  };

  export const addOyuncuLetterMap = async (harfOyuncuMapModel) => {
    try {
      const response = await axios.post(`${DATABASE_URL}/HarfOyuncuMap.json`, harfOyuncuMapModel);
      console.log(response.data);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };
  
  export const deleteLetterEntry = async (harfId, oyunId, oyuncuId) => {
    try {
      const response = await axios.get(`${DATABASE_URL}/HarfOyuncuMap.json`);
  
      if (response.data) {
        const entries = response.data;
        const entryToDelete = Object.entries(entries).find(
          ([key, entry]) =>
            entry.harfId === harfId &&
            entry.oyunId === oyunId &&
            entry.oyuncuId === oyuncuId
        );
  
        if (entryToDelete) {
          const entryKey = entryToDelete[0];
          await axios.delete(`${DATABASE_URL}/HarfOyuncuMap/${entryKey}.json`);
          console.log("Kayıt başarıyla silindi:", entryKey);
          return true;
        } else {
          console.log("Silinecek kayıt bulunamadı.");
          return false;
        }
      } else {
        console.log("HarfOyuncuMap verisi boş.");
        return false;
      }
    } catch (error) {
      console.error("Kayıt silme hatası:", error);
      return false;
    }
  };

  export const getRandomUnusedTurkishLetter = async (oyunId) => {
    try {
      const usedHarfIds = await getLetterIdsForGame(oyunId);
  
      const response = await axios.get(`${DATABASE_URL}/TurkishLetters.json`);
  
      if (response.data) {
        const entries = Object.entries(response.data); 
        
        const unusedLetters = entries.filter(
          ([key, letter]) => !usedHarfIds.includes(key)
        );
  
        if (unusedLetters.length === 0) {
          console.log("Tüm harfler kullanıldı.");
          return null;
        }
  
        const randomIndex = Math.floor(Math.random() * unusedLetters.length);
        const [randomId, randomLetter] = unusedLetters[randomIndex];
  
        console.log("Rastgele seçilen kullanılmamış harf:", randomLetter, "ID:", randomId);
  
        return {
          id: randomId,
          ...randomLetter,
        };
      } else {
        console.log("Türkçe harfler tablosu boş.");
        return null;
      }
    } catch (error) {
      console.error("Rastgele harf seçimi hatası:", error);
      return null;
    }
  };
  

  export const doldurHarfleri = async (oyunId, oyuncular) => {
    const kullanilanHarfIdListesi = await getLetterIdsForGame(oyunId);
  
    for (const oyuncu of oyuncular) {
      const oyuncuId = oyuncu.id;
      console.log("oyuncular", oyuncuId);
      let mevcutHarfSayisi = await getActiveLetterCountForPlayer(oyunId, oyuncuId);
      console.log("mevcutHarfSayisi", mevcutHarfSayisi);
  
      while (mevcutHarfSayisi < 7) {
        const yeniHarf = await getRandomUnusedTurkishLetter(oyunId);
  
        if (!yeniHarf || kullanilanHarfIdListesi.includes(yeniHarf.id)) {
          console.log("Aynı harf atlanıyor:", yeniHarf?.id);
          continue;
        }
  
        const model = new HarfOyuncuMapModel(
          oyunId,
          oyuncuId,
          yeniHarf.id,
          0
        );
  
        await addOyuncuLetterMap(model);
  
        kullanilanHarfIdListesi.push(yeniHarf.id);
  
        mevcutHarfSayisi++;
      }
    }
  };

 export const HarfleriTamamla = async (oyunId, oyuncuId) => {
  const kullanilanHarfIdListesi = await getLetterIdsForGame(oyunId);
  //console.log("kullanilanHarfIdListesi", kullanilanHarfIdListesi);

  //console.log("oyuncular", oyuncuId);
  await new Promise(resolve => setTimeout(resolve, 300));

  let yeniHarf = null;

  while (
    !yeniHarf ||
    kullanilanHarfIdListesi.includes(yeniHarf.id)
  ) {
    if (yeniHarf) {
      console.log("Aynı harf atlanıyor, yeni harf üretiliyor:", yeniHarf.id);
    }
    yeniHarf = await getRandomUnusedTurkishLetter(oyunId);
  }

  const model = new HarfOyuncuMapModel(
    oyunId,
    oyuncuId,
    yeniHarf.id,
    0
  );

  await addOyuncuLetterMap(model);

  kullanilanHarfIdListesi.push(yeniHarf.id);
};

  

  export const getActiveLettersForPlayer = async (oyunId, oyuncuId) => {
    try {
      const harfMapResponse = await axios.get(`${DATABASE_URL}/HarfOyuncuMap.json`);
      const turkishLettersResponse = await axios.get(`${DATABASE_URL}/TurkishLetters.json`);
  
      if (harfMapResponse.data && turkishLettersResponse.data) {
        const allEntries = Object.values(harfMapResponse.data);
        const aktifTaslar = allEntries.filter(
          entry =>
            entry.oyunId === oyunId &&
            entry.oyuncuId === oyuncuId &&
            entry.durumId === 0
        );
  
        const turkishLetters = turkishLettersResponse.data;
  
        const sonuc = aktifTaslar.map(tas => {
          const harfVerisi = turkishLetters[tas.tasId];
          return {
            id: tas.tasId,
            baslik: harfVerisi?.baslik || "",
            puan: harfVerisi?.puan || 0,
          };
        });
  
        return sonuc;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Aktif taşlar çekilirken hata:", error);
      return [];
    }
  };  
  
//export const HamleDoğrulama = async(taslarArray){
  //for(const tas in taslarArray){
    //tas.anaDeger
  //}
//}
export const HarfOyuncuMapGüncelle = async (taslarArray, oyunId, oyuncuId) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/HarfOyuncuMap.json`);
    const veriler = response.data;

    if (!veriler) return;

    const entries = Object.entries(veriler);

    for (const [key, value] of entries) {
      const eslesenTas = taslarArray.find(t => t.id === value.tasId);
      if (
        value.oyunId === oyunId &&
        value.oyuncuId === oyuncuId &&
        eslesenTas &&
        value.durumId === 0
      ) {
        await axios.patch(`${DATABASE_URL}/HarfOyuncuMap/${key}.json`, {
          durumId: 1
        });
        console.log(`Güncellendi: ${key}`);
      }
    }
  } catch (error) {
    console.error("Taş bilgileri güncellenirken hata:", error);
  }
};


export const TaslariGameBoardaKaydet = async (taslarArray, oyunId, oyuncuId) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/standartBoard.json`);
    const boardData = response.data;
    const boardEntries = boardData
      ? Object.entries(boardData).map(([key, val]) => ({ key, ...val }))
      : [];

    for (const tas of taslarArray) {
      const eslesenKare = boardEntries.find(kare => kare.anaDeger === tas.anaDeger);
      //console.log(eslesenKare);

      let modelToSave;

      if (eslesenKare) {
        modelToSave = {
          turId: eslesenKare.turId,
          baslik: tas.letter,
          renkKodu: eslesenKare.renkKodu,
          carpanDegeri: eslesenKare.carpanDegeri,
          yerDegeri: tas.position,
          anaDeger: tas.anaDeger,
          durumId: 2,
          tasId: tas.id,
          puan:tas.puan,
        };
      } else {
        modelToSave = {
          turId: 0,
          baslik: tas.letter,
          renkKodu: '#339933',
          carpanDegeri: 1,
          yerDegeri: tas.position,
          anaDeger: tas.anaDeger,
          durumId: 2,
          tasId: tas.id,
          puan:tas.puan,
        };
      }

      const postResponse = await axios.post(`${DATABASE_URL}/GameBoard/${oyunId}.json`, modelToSave);
      const yeniGameBoardId = postResponse.data.name;

      await axios.patch(`${DATABASE_URL}/games/${oyunId}/board.json`, {
        [yeniGameBoardId]: true
      });
      
      console.log(`GameBoard'a kaydedildi: ${yeniGameBoardId}`);
    }

    console.log("Tüm taşlar GameBoard'a kaydedildi.");
  } catch (error) {
    console.error("GameBoard'a kayıt sırasında hata:", error);
  }
};

export const OyuncuScoreDegeriGüncelleme = async (taslarArray, oyunId, oyuncuId) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/standartBoard.json`);
    const boardData = response.data;
    const boardEntries = boardData
      ? Object.entries(boardData).map(([key, val]) => ({ key, ...val }))
      : [];

    let toplamPuan = 0;
    let eklenecekPuan = 0;
    let carpilacakDeger = 1;

    for (const tas of taslarArray) {
      toplamPuan += tas.puan;
    }

    for (const tas of taslarArray) {
      const eslesenKare = boardEntries.find(kare => kare.anaDeger === tas.anaDeger);
      //console.log("eslesenKare",eslesenKare)
      if (eslesenKare?.turId === 1) {
        eklenecekPuan = (eslesenKare.carpanDegeri - 1) * tas.puan;
        toplamPuan += eklenecekPuan;
      } else if (eslesenKare?.turId === 2) {
        carpilacakDeger *= eslesenKare.carpanDegeri;
      }
    }

    toplamPuan = toplamPuan * carpilacakDeger;

    const gameResponse = await axios.get(`${DATABASE_URL}/games/${oyunId}/players.json`);
    const playersData = gameResponse.data;

    const playerEntry = Object.entries(playersData).find(([key, val]) => val.id === oyuncuId);

    if (!playerEntry) {
      console.error("Oyuncu bulunamadı.");
      return;
    }

    const [playerKey, player] = playerEntry;
    const yeniPuan = (player.score || 0) + toplamPuan;

    await axios.patch(`${DATABASE_URL}/games/${oyunId}/players/${playerKey}.json`, {
      score: yeniPuan
    });

    console.log("Puan başarıyla güncellendi:", yeniPuan);
  } catch (error) {
    console.error("Puan güncelleme sırasında hata:", error);
  }
};


export const OyuncuScoreDegeriGuncellemeV2 = async (taslarim, oyunId, oyuncuId) => {
  try {
    const boardDataResponse = await axios.get(`${DATABASE_URL}/standartBoard.json`);
    const boardData = boardDataResponse.data;
    const boardEntries = boardData ? Object.entries(boardData).map(([_, val]) => val) : [];

    const tumTaslar = await TumBagliHarfler(oyunId, taslarim);
    const kelimeGrubu = TumKelimelerPuanlamaIcin(tumTaslar); 

    if (kelimeGrubu.length === 0) return;

    let toplamPuan = 0;

    for (const kelime of kelimeGrubu) {
      let kelimePuani = 0;
      let kelimeCarpanlari = [];

      for (const harf of kelime) {
        const eslesenKare = boardEntries.find(k => k.anaDeger === harf.anaDeger);
        const tasYeniMi = taslarim.some(t => t.anaDeger === harf.anaDeger);
        let harfPuani = harf.puan;

        if (tasYeniMi && eslesenKare) {
          if (eslesenKare.turId === 1) {
            harfPuani *= eslesenKare.carpanDegeri;
          } else if (eslesenKare.turId === 2) {
            kelimeCarpanlari.push(eslesenKare.carpanDegeri);
          }
        }

        kelimePuani += harfPuani;
      }

      
      for (const carp of kelimeCarpanlari) {
        kelimePuani *= carp;
      }

      toplamPuan += kelimePuani;
    }

    
    const gameResponse = await axios.get(`${DATABASE_URL}/games/${oyunId}/players.json`);
    const playersData = gameResponse.data;
    const playerEntry = Object.entries(playersData).find(([_, val]) => val.id === oyuncuId);

    if (!playerEntry) {
      console.error("Oyuncu bulunamadı.");
      return;
    }

    const [playerKey, player] = playerEntry;
    const yeniPuan = (player.score || 0) + toplamPuan;

    await axios.patch(`${DATABASE_URL}/games/${oyunId}/players/${playerKey}.json`, {
      score: yeniPuan
    });

    console.log(`✅ Oyuncu puanı güncellendi: ${yeniPuan}`);
  } catch (error) {
    console.error("❌ Puan güncelleme hatası:", error);
  }
};



export const removeOyuncuLetterMap = async (oyunId, oyuncuId, tasId) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/HarfOyuncuMap.json`);

    if (response.data) {
      const entries = Object.entries(response.data);
      const targetEntry = entries.find(
        ([_, entry]) =>
          entry.oyunId === oyunId &&
          entry.oyuncuId === oyuncuId &&
          entry.tasId === tasId
      );

      if (targetEntry) {
        const [entryKey] = targetEntry;
        await axios.delete(`${DATABASE_URL}/HarfOyuncuMap/${entryKey}.json`);
        console.log("Taş silindi:", entryKey);
        return true;
      } else {
        console.log("Silinecek taş bulunamadı.");
        return false;
      }
    } else {
      console.log("Veri bulunamadı.");
      return false;
    }
  } catch (error) {
    console.error("Taş silinirken hata:", error);
    return false;
  }
};


export const SecilenTaslariDegistir = async (tasIdListesi, oyunId, oyuncuId) => {
  if (!tasIdListesi || tasIdListesi.length === 0) return;

  const mapList = await getLetterIdsForGame(oyunId); 
  //console.log("mapList", mapList)
  const aktifTasIdListesi = mapList
    .filter(item => item.durumId === 0)
    .map(item => item.tasId);

  //console.log("aktifTasIdListesi", aktifTasIdListesi)

  for (const tasId of tasIdListesi) {
    await removeOyuncuLetterMap(oyunId, oyuncuId, tasId);

    let yeniTas = null;
    while (!yeniTas || aktifTasIdListesi.includes(yeniTas.id)) {
      yeniTas = await getRandomUnusedTurkishLetter(oyunId);
      console.log("yeniTas",yeniTas)
    }

    await addOyuncuLetterMap({
      oyunId,
      oyuncuId,
      tasId: yeniTas.id,
      durumId: 0,
      createdAt: new Date().toISOString()
    });

    aktifTasIdListesi.push(yeniTas.id);
  }
};

{/*
  export const addStaticHarfOyuncuMap = async () => {
    const oyun = new HarfOyuncuMapModel(
      1,
      '7Og7biF9KqfbrMTKdy2DbUvzkxV2',
      "-ONy7eNI7pv6wqW6nd89",
      "0",
    );
  
    try {
      const response = await axios.post(`${DATABASE_URL}/HarfOyuncuMap.json`, oyun);
      console.log("harf başarıyla eklendi:", response.data);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };
  */}

export const tamamlayiciTasUret = async (oyunId, userId, eksikSayi) => {
  const kullanilanHarfIdListesi = await getLetterIdsForGame(oyunId);

  let eklenecekSayi = 0;
  while (eklenecekSayi < eksikSayi) {
    const yeniHarf = await getRandomUnusedTurkishLetter(oyunId);
    if (!yeniHarf || kullanilanHarfIdListesi.includes(yeniHarf.id)) {
      continue; // Aynı harf atlanıyor
    }

    const yeniMapModel = new HarfOyuncuMapModel(
      oyunId,
      userId,
      yeniHarf.id,
      0
    );

    await addOyuncuLetterMap(yeniMapModel);
    kullanilanHarfIdListesi.push(yeniHarf.id);
    eklenecekSayi++;
  }
};

export const kontrolEtBitişikMi = async (oyunId, yeniTaslar) => {
  try {
    const response = await axios.get(`${DATABASE_URL}/GameBoard/${oyunId}.json`);
    const mevcutTaslar = response.data ? Object.values(response.data) : [];

    if (mevcutTaslar.length === 0) return true;

    const parsePosition = (pos) => {
      const [rowStr, colStr] = pos?.split('/') || [];
      const row = parseInt(rowStr, 10);
      const col = parseInt(colStr, 10);
      return { row, col };
    };

    const mevcutKoordinatlar = mevcutTaslar
      .map(tas => parsePosition(tas.yerDegeri))
      .filter(p => !isNaN(p.row) && !isNaN(p.col));

    const yeniKoordinatlar = yeniTaslar
      .map(tas => parsePosition(tas.position))
      .filter(p => !isNaN(p.row) && !isNaN(p.col));

    const bitisik = yeniKoordinatlar.some(yeni => {
      return mevcutKoordinatlar.some(eski => {
        const ds = Math.abs(yeni.row - eski.row);
        const ks = Math.abs(yeni.col - eski.col);
        return (ds + ks === 1);
      });
    });

    //console.log("🧩 bitişikMi sonucu:", bitisik);
    return bitisik;
  } catch (err) {
    console.error("❌ Mevcut taşlar alınamadı:", err);
    return false;
  }
};


  