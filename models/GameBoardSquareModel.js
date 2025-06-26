export default class GameBoardSquareModel {
  constructor(oyunId, turId, baslik, renkKodu, carpanDegeri, yerDegeri, anaDeger, durumId, tasId, puan) {
    this.turId = turId;
    this.baslik = baslik;
    this.renkKodu = renkKodu;
    this.carpanDegeri = carpanDegeri;
    this.yerDegeri = yerDegeri;
    this.anaDeger = anaDeger;
    this.durumId = durumId;
    this.tasId = tasId;
    this.puan = puan;
    this.createdAt = new Date().toISOString();
  }
  }

  //Not:DurumId 0-Boş, 1-Dolu, 2-Kilitli
  