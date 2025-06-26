export default class UserModel {
    constructor(UserId, Email, UserName, IsActive) {
      this.UserId = UserId;
      this.Email=Email;
      this.UserName = UserName;
      this.IsActive = IsActive;
      this.createdAt = new Date().toISOString();
    }
  }
  