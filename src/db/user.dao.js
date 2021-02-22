export default class UserDao {
  static async injectDB(conn) {
    if (this.users) {
      return;
    }
    try {
      this.users = await conn.db('gphoto-bot').collection('User');
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`);
    }
  }

  static async updateUser(user) {
    try {
      await this.users.updateOne(
        { chatId: user.chatId },
        { $set: { token: user.token } },
        { upsert: true }
      );
      return true;
    } catch (e) {
      console.error(`Error accured: ${e}`);
      return false;
    }
  }

  static findUser(id) {
    try {
      return await this.users.findOne({ chatId: id });
    } catch (e) {
      console.error(`Error accured: ${e}`);
      return false;
    }
  }
}