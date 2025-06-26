export default class FriendModel {
    constructor(userOneId, userTwoId, IsActive, IsDeleted) {
      this.userOneId = userOneId;
      this.userTwoId = userTwoId;
      this.IsActive = IsActive;
      this.IsDeleted = IsDeleted;
      this.createdAt = new Date().toISOString();
    }
  }
  