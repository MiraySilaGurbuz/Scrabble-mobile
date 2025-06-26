export default class HarfOyuncuMapModel {
  constructor(oyunId, oyuncuId, tasId, durumId) {
    this.oyunId = oyunId;
    this.oyuncuId = oyuncuId;
    this.tasId = tasId;
    this.durumId = durumId;
    this.createdAt = new Date().toISOString();
  }
  }

  //Not:DurumId 0-kullanılmamış ancak oyunda olan taşlar, 1-kullanımış taşlar, 2-pas geçilmiş pasif taşlar
  