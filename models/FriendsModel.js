export default class FriendsModel {
    constructor(userOneId, userTwoId, durumId) {
      this.userOneId = userOneId;
      this.userTwoId = userTwoId;
      this.durumId = durumId; 
      this.createdAt = new Date().toISOString();
    }
  }

  //durumId 1 aktif 0 pasif
  