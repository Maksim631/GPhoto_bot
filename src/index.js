import mongodb from 'mongodb'
import isBotCreated from './bot/bot.js'
import config from './config.js'
import UserDao from './db/user.dao.js'
import app from './server.js'

if (isBotCreated) {
  console.log('Bot successfully connected')
} else {
  console.log("Bot couldn't connect")
}

const { MongoClient } = mongodb
MongoClient.connect('mongodb://mongo:27017/gphoto-bot', {
  useNewUrlParser: true,
})
  .then(async (client) => {
    await UserDao.injectDB(client)
    app.listen(config.port, () => {
      console.log('App successfully listening on port 3000')
    })
  })
  .catch((e) => {
    console.error(`Error accured during connecting to Database. ${e}`)
    process.exit(1)
  })
