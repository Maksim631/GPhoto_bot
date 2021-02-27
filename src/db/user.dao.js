export default class UserDao {
  static async injectDB(conn) {
    if (this.users) {
      return
    }
    try {
      this.users = await conn.db('gphoto-bot').collection('User')
    } catch (e) {
      console.error(`Unable to establish collection handles in userDAO: ${e}`)
    }
  }

  static async update({ chatId, accessToken, refreshToken }) {
    try {
      await this.users.updateOne(
        { chatId },
        { $set: { accessToken, refreshToken } },
        { upsert: true },
      )
      return true
    } catch (e) {
      console.error(`Error accured: ${e}`)
      return false
    }
  }

  static async find(id) {
    try {
      return await this.users.findOne({ chatId: id })
    } catch (e) {
      console.error(`Error accured: ${e}`)
      return false
    }
  }

  static async findAll() {
    try {
      let cursor =  await this.users.find({})
      return cursor.toArray();
    } catch (e) {
      console.error(`Error accured: ${e}`)
      return false
    }
  }
}
