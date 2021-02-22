import { MongoClient } from 'mongodb'
import Bot from './bot/bot.js'
import config from './config'
import UserDao from './db/user.dao'
import app from './server'

new Bot(logger.child({ class: 'TelegramBot' }))

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
