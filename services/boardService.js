import axios from "axios";
import BoardModel from "../models/BoardModel";

const DATABASE_URL = "https://scrabbleyeni-default-rtdb.firebaseio.com";

export const addMultipleBoards = async () => {
  const boardData = [
    new BoardModel(2, "Kelime x3", "#f00000", 3, "0/0", 1, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "0/3", 4, 0),
    new BoardModel(2, "Kelime x3", "#f00000", 3, "0/7", 8, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "0/11", 12, 0),
    new BoardModel(2, "Kelime x3", "#f00000", 3, "0/14", 15, 0),

    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "1/1", 17, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "1/5", 21, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "1/9", 25, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "1/13", 29, 0 ),

    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "2/2", 33, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "2/6", 37, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "2/8", 39, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "2/12", 43, 0),

    new BoardModel(1, "Harf x2", "#cce5ff", 2, "3/0", 46, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "3/3", 49, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "3/7", 53, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "3/11", 57, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "3/14", 60, 0),

    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "4/4", 65, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "4/10", 71, 0),

    new BoardModel(1, "Harf x3", "#66b2ff", 3, "5/1", 77, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "5/5", 81, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "5/9", 85, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "5/13", 89, 0),

    new BoardModel(1, "Harf x2", "#cce5ff", 2, "6/2", 93, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "6/6", 97, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "6/8", 99, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "6/12", 103, 0),
    
    new BoardModel(2, "Kelime x3", "#f00000", 3, "7/0", 106, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "7/3", 109, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "7/7", 113, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "7/11", 117, 0),
    new BoardModel(2, "Kelime x3", "#f00000", 3, "7/14", 120, 0),
    
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "8/2", 123, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "8/6", 127, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "8/8", 129, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "8/12", 133, 0),

    new BoardModel(1, "Harf x3", "#66b2ff", 3, "9/1", 137, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "9/5", 141, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "9/9", 145, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "9/13", 149, 0),
    
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "10/4", 155, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "10/10", 161, 0),
    
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "11/0", 166, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "11/3", 169, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "11/7", 173, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "11/11", 177, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "11/14", 180, 0),
    
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "12/2", 183, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "12/6", 187, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "12/8", 189, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "12/12", 193, 0),
    
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "13/1", 197, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "13/5", 201, 0),
    new BoardModel(1, "Harf x3", "#66b2ff", 3, "13/9", 205, 0),
    new BoardModel(2, "Kelime x2", "#ffcc00", 2, "13/13", 209, 0),
    
    new BoardModel(2, "Kelime x3", "#f00000", 3, "14/0", 211, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "14/3", 214, 0),
    new BoardModel(2, "Kelime x3", "#f00000", 3, "14/7", 218, 0),
    new BoardModel(1, "Harf x2", "#cce5ff", 2, "14/11", 222, 0),
    new BoardModel(2, "Kelime x3", "#f00000", 3, "14/14", 225, 0),

  ];

  try {
    const promises = boardData.map((board) =>
      axios.post(`${DATABASE_URL}/standartBoard.json`, board)
    );

    await Promise.all(promises);
    console.log("Birden fazla veri başarıyla eklendi.");
  } catch (error) {
    console.error("Veri ekleme hatası:", error);
  }
};

export async function getAllBoards(params) {
    try {

      const response = await axios.get(`${DATABASE_URL}/standartBoard.json`);
      
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


  export const addStaticBoard = async () => {
    const sabitBoard = new BoardModel(
      1,
      "Örnek Başlık",
      "#FF0000",
      2,
      5,
      "üst"
    );
  
    try {
      const response = await axios.post(`${DATABASE_URL}/boards.json`, sabitBoard);
      console.log("Veri başarıyla eklendi:", response.data);
    } catch (error) {
      console.error("Hata oluştu:", error);
    }
  };