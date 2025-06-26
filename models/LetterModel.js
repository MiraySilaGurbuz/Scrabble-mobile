export default class LetterModel {
    constructor(baslik, puan) {
      this.baslik = baslik;
      this.puan = puan;
      this.createdAt = new Date().toISOString();
    }
  }
  