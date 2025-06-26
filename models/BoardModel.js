export default class BoardModel {
    constructor(turId, baslik, renkKodu, carpanDegeri, yerDegeri, anaDeger, durumId) {
      this.turId = turId;
      this.baslik = baslik;
      this.renkKodu = renkKodu;
      this.carpanDegeri = carpanDegeri;
      this.yerDegeri = yerDegeri;
      this.anaDeger = anaDeger;
      this.durumId = durumId; 
      this.createdAt = new Date().toISOString();
    }
  }
  